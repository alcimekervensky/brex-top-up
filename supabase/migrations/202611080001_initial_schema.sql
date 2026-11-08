create extension if not exists pgcrypto;

create type public.account_role as enum ('customer','reseller','admin');
create type public.order_status as enum ('Pending','Paid','Processing','Completed','Failed','Refunded');
create type public.deposit_status as enum ('Pending','Approved','Rejected');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role public.account_role not null default 'customer',
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create table public.products (
  id text primary key,
  name text not null,
  description text not null default '',
  category text not null check(category in ('Diamonds','Membership')),
  price_htg bigint not null check(price_htg >= 0),
  image_url text not null default '',
  active boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);
create table public.wallets (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  balance_htg bigint not null default 0 check(balance_htg >= 0),
  updated_at timestamptz not null default now()
);
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  reference text not null unique default ('BTU-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,12))),
  product_id text not null references public.products(id),
  product_name text not null,
  quantity integer not null default 1 check(quantity > 0),
  player_id text not null check(length(player_id) between 5 and 32),
  region text not null check(region in ('LATAM','GLOBAL')),
  amount_htg bigint not null check(amount_htg >= 0),
  payment_method text not null check(payment_method in ('NatCash','MonCash','BREX Wallet')),
  status public.order_status not null default 'Pending',
  idempotency_key uuid not null,
  provider_order_id text,
  provider_status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id,idempotency_key)
);
create table public.wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  kind text not null check(kind in ('Deposit','Withdrawal','Order','Refund','Adjustment')),
  amount_htg bigint not null check(amount_htg <> 0),
  status text not null check(status in ('Pending','Approved','Rejected','Completed')),
  description text not null default '',
  reference_id uuid,
  idempotency_key text unique,
  created_at timestamptz not null default now()
);
create table public.deposit_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  amount_htg bigint not null check(amount_htg > 0),
  method text not null check(method in ('NatCash','MonCash')),
  provider_reference text not null,
  proof_path text,
  status public.deposit_status not null default 'Pending',
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  unique(method,provider_reference)
);
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  title text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create table public.supplier_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id),
  event_type text not null,
  request_summary jsonb not null default '{}'::jsonb,
  response_summary jsonb not null default '{}'::jsonb,
  attempt integer not null default 1,
  created_at timestamptz not null default now()
);

create function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles(id,full_name) values(new.id,coalesce(new.raw_user_meta_data->>'full_name','')) on conflict do nothing;
  insert into public.wallets(user_id) values(new.id) on conflict do nothing;
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$
 select exists(select 1 from public.profiles where id=auth.uid() and role='admin' and active=true);
$$;
create function public.is_reseller() returns boolean language sql stable security definer set search_path=public as $$
 select exists(select 1 from public.profiles where id=auth.uid() and role in ('admin','reseller') and active=true);
$$;

create function public.create_order(p_product_id text,p_player_id text,p_region text,p_payment_method text,p_idempotency_key uuid)
returns public.orders language plpgsql security definer set search_path=public as $$
declare v_uid uuid:=auth.uid(); v_product public.products; v_order public.orders; v_wallet public.wallets;
begin
  if v_uid is null then raise exception 'Authentication required'; end if;
  if length(p_player_id) not between 5 and 32 then raise exception 'Invalid player ID'; end if;
  if p_region not in ('LATAM','GLOBAL') then raise exception 'Invalid region'; end if;
  if p_payment_method not in ('NatCash','MonCash','BREX Wallet') then raise exception 'Invalid payment method'; end if;
  select * into v_order from public.orders where user_id=v_uid and idempotency_key=p_idempotency_key;
  if found then return v_order; end if;
  select * into v_product from public.products where id=p_product_id and active=true for share;
  if not found then raise exception 'Product unavailable'; end if;
  if p_payment_method='BREX Wallet' then
    select * into v_wallet from public.wallets where user_id=v_uid for update;
    if v_wallet.balance_htg < v_product.price_htg then raise exception 'Insufficient wallet balance'; end if;
    update public.wallets set balance_htg=balance_htg-v_product.price_htg,updated_at=now() where user_id=v_uid;
    insert into public.wallet_transactions(user_id,kind,amount_htg,status,description,reference_id,idempotency_key)
    values(v_uid,'Order',-v_product.price_htg,'Completed','Paiement commande '||v_product.name,null,'order:'||p_idempotency_key::text);
    insert into public.orders(user_id,product_id,product_name,player_id,region,amount_htg,payment_method,status,idempotency_key)
    values(v_uid,v_product.id,v_product.name,p_player_id,p_region,v_product.price_htg,'BREX Wallet','Paid',p_idempotency_key) returning * into v_order;
  else
    insert into public.orders(user_id,product_id,product_name,player_id,region,amount_htg,payment_method,status,idempotency_key)
    values(v_uid,v_product.id,v_product.name,p_player_id,p_region,v_product.price_htg,p_payment_method,'Pending',p_idempotency_key) returning * into v_order;
  end if;
  insert into public.notifications(user_id,title,body) values(v_uid,'Commande reçue','Votre commande '||v_order.reference||' est enregistrée.');
  return v_order;
end; $$;

create function public.review_deposit(p_deposit_id uuid,p_approve boolean) returns void language plpgsql security definer set search_path=public as $$
declare d public.deposit_requests;
begin
 if not public.is_admin() then raise exception 'Admin only'; end if;
 select * into d from public.deposit_requests where id=p_deposit_id for update;
 if not found or d.status <> 'Pending' then raise exception 'Deposit is not pending'; end if;
 update public.deposit_requests set status=case when p_approve then 'Approved'::public.deposit_status else 'Rejected'::public.deposit_status end,reviewed_by=auth.uid(),reviewed_at=now() where id=d.id;
 if p_approve then
   update public.wallets set balance_htg=balance_htg+d.amount_htg,updated_at=now() where user_id=d.user_id;
   insert into public.wallet_transactions(user_id,kind,amount_htg,status,description,reference_id,idempotency_key) values(d.user_id,'Deposit',d.amount_htg,'Approved','Dépôt vérifié',d.id,'deposit:'||d.id::text);
 end if;
 insert into public.notifications(user_id,title,body) values(d.user_id,case when p_approve then 'Dépôt accepté' else 'Dépôt refusé' end,case when p_approve then 'Votre dépôt vérifié a été crédité.' else 'Votre demande de dépôt a été refusée.' end);
end; $$;

create function public.admin_set_order_status(p_order_id uuid,p_status text) returns void language plpgsql security definer set search_path=public as $$
declare o public.orders;
begin
 if not public.is_admin() then raise exception 'Admin only'; end if;
 if p_status not in ('Pending','Paid','Processing','Completed','Failed','Refunded') then raise exception 'Invalid status'; end if;
 select * into o from public.orders where id=p_order_id for update;
 if not found then raise exception 'Order not found'; end if;
 if p_status='Completed' and o.status not in ('Processing','Paid') then raise exception 'Order must be paid or processing'; end if;
 update public.orders set status=p_status,updated_at=now() where id=o.id;
 insert into public.notifications(user_id,title,body) values(o.user_id,'Mise à jour de commande','La commande '||o.reference||' est maintenant '||p_status||'.');
end; $$;

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.wallets enable row level security;
alter table public.orders enable row level security;
alter table public.wallet_transactions enable row level security;
alter table public.deposit_requests enable row level security;
alter table public.notifications enable row level security;
alter table public.supplier_events enable row level security;

create policy "Profiles readable by owner or admin" on public.profiles for select using(id=auth.uid() or public.is_admin());
create policy "Profile owner edits non-role fields" on public.profiles for update using(id=auth.uid()) with check(id=auth.uid() and role=(select p.role from public.profiles p where p.id=auth.uid()));
create policy "Active products visible" on public.products for select using(active=true or public.is_admin());
create policy "Products admin manage" on public.products for all using(public.is_admin()) with check(public.is_admin());
create policy "Wallet owner read" on public.wallets for select using(user_id=auth.uid() or public.is_admin());
create policy "Orders owner or admin read" on public.orders for select using(user_id=auth.uid() or public.is_admin());
create policy "Wallet tx owner or admin read" on public.wallet_transactions for select using(user_id=auth.uid() or public.is_admin());
create policy "Deposit owner read" on public.deposit_requests for select using(user_id=auth.uid() or public.is_admin());
create policy "Deposit owner submit" on public.deposit_requests for insert with check(user_id=auth.uid());
create policy "Notifications owner read" on public.notifications for select using(user_id=auth.uid() or public.is_admin());
create policy "Notifications owner update" on public.notifications for update using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy "Supplier events admin only" on public.supplier_events for select using(public.is_admin());

revoke all on function public.create_order(text,text,text,text,uuid) from public;
grant execute on function public.create_order(text,text,text,text,uuid) to authenticated;
revoke all on function public.review_deposit(uuid,boolean) from public;
grant execute on function public.review_deposit(uuid,boolean) to authenticated;
revoke all on function public.admin_set_order_status(uuid,text) from public;
grant execute on function public.admin_set_order_status(uuid,text) to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_reseller() to authenticated;

insert into public.products(id,name,description,category,price_htg,image_url,sort_order) values
('diamond-110','110 Diamonds','Recharge Free Fire — 110 Diamonds','Diamonds',150,'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80',1),
('diamond-220','220 Diamonds','Recharge Free Fire — 220 Diamonds','Diamonds',300,'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80',2),
('diamond-341','341 Diamonds','Recharge Free Fire — 341 Diamonds','Diamonds',450,'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80',3),
('diamond-572','572 Diamonds','Recharge Free Fire — 572 Diamonds','Diamonds',750,'https://images.unsplash.com/photo-1526509867162-5d0d3e16f1a7?auto=format&fit=crop&w=900&q=80',4),
('diamond-1166','1 166 Diamonds','Recharge Free Fire — 1 166 Diamonds','Diamonds',1500,'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80',5),
('diamond-2398','2 398 Diamonds','Recharge Free Fire — 2 398 Diamonds','Diamonds',3000,'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80',6),
('diamond-6160','6 160 Diamonds','Recharge Free Fire — 6 160 Diamonds','Diamonds',7500,'https://images.unsplash.com/photo-1526509867162-5d0d3e16f1a7?auto=format&fit=crop&w=900&q=80',7),
('membership-weekly','Weekly Membership','Membership hebdomadaire — tarif administrable','Membership',250,'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80',8),
('membership-monthly','Monthly Membership','Membership mensuelle — tarif administrable','Membership',850,'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80',9),
('membership-level-up','Level Up Pass','Level Up Pass — tarif administrable','Membership',1200,'https://images.unsplash.com/photo-1526509867162-5d0d3e16f1a7?auto=format&fit=crop&w=900&q=80',10)
on conflict(id) do nothing;
