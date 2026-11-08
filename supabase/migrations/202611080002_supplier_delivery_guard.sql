-- Safety hardening: admin UI can receive and review orders, but cannot manually mark an order delivered.
-- Only a trusted backend supplier adapter may set provider_status to a confirmed delivery value.
create or replace function public.admin_set_order_status(p_order_id uuid,p_status text) returns void language plpgsql security definer set search_path=public as $$
declare o public.orders;
begin
 if not public.is_admin() then raise exception 'Admin only'; end if;
 if p_status not in ('Pending','Paid','Processing','Completed','Failed','Refunded') then raise exception 'Invalid status'; end if;
 select * into o from public.orders where id=p_order_id for update;
 if not found then raise exception 'Order not found'; end if;
 if p_status='Completed' and (o.status not in ('Processing','Paid') or coalesce(o.provider_status,'') not in ('delivered','completed')) then
   raise exception 'Supplier delivery confirmation required';
 end if;
 update public.orders set status=p_status,updated_at=now() where id=o.id;
 insert into public.notifications(user_id,title,body) values(o.user_id,'Mise à jour de commande','La commande '||o.reference||' est maintenant '||p_status||'.');
end; $$;
revoke all on function public.admin_set_order_status(uuid,text) from public;
grant execute on function public.admin_set_order_status(uuid,text) to authenticated;
