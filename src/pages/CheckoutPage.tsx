import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { paymentMethods, productCatalog } from '../data/mockData';
import { requireSupabase, supabaseConfigured } from '../lib/supabase';
import type { PaymentMethod, Product, Region } from '../types';

type CreatedOrder = { id: string; reference: string; status: string; amount_htg: number };

export default function CheckoutPage() {
  const location = useLocation();
  const initialProduct = (location.state as { product?: Product } | null)?.product ?? productCatalog[0];
  const [selectedProductId, setSelectedProductId] = useState(initialProduct.id);
  const [playerId, setPlayerId] = useState('');
  const [region, setRegion] = useState<Region>('LATAM');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('NatCash');
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<CreatedOrder | null>(null);

  const selectedProduct = useMemo(
    () => productCatalog.find((product) => product.id === selectedProductId) ?? productCatalog[0],
    [selectedProductId],
  );
  const total = selectedProduct.price;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (!/^\d{5,32}$/.test(playerId.trim())) {
      setError('Saisissez un Player ID composé de 5 à 32 chiffres.');
      return;
    }
    if (!confirm) {
      setError('Confirmez le Player ID, la région et le montant avant de continuer.');
      return;
    }
    if (!supabaseConfigured) {
      setError('Les commandes ne sont pas activées : Supabase doit être configuré.');
      return;
    }

    setBusy(true);
    try {
      const sb = requireSupabase();
      const { data: { user }, error: authError } = await sb.auth.getUser();
      if (authError) throw authError;
      if (!user) {
        setError('Connectez-vous ou créez un compte avant de passer commande.');
        return;
      }
      const { data, error: orderError } = await sb.rpc('create_order', {
        p_product_id: selectedProduct.id,
        p_player_id: playerId.trim(),
        p_region: region,
        p_payment_method: paymentMethod,
        p_idempotency_key: crypto.randomUUID(),
      });
      if (orderError) throw orderError;
      const created = (Array.isArray(data) ? data[0] : data) as CreatedOrder | null;
      if (!created?.reference) throw new Error('La commande a été reçue sans référence. Contactez le support avant de repayer.');
      setOrder(created);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'La commande n’a pas pu être créée.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container-shell py-14">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-[0.2em] text-sky-300">Acheter</div>
        <h1 className="mt-3 text-4xl font-black text-white">Finaliser votre commande</h1>
      </div>

      {order ? (
        <section className="card-surface mx-auto max-w-2xl p-7">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Commande enregistrée</p>
          <h2 className="mt-2 text-3xl font-black">Référence {order.reference}</h2>
          <p className="mt-4 text-slate-300">{selectedProduct.name} · {Number(order.amount_htg ?? total).toLocaleString('fr-FR')} HTG · Player ID {playerId} · {region}</p>
          <p className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-100">
            Statut : {order.status}. La commande n’est pas encore livrée. Pour NatCash/MonCash, effectuez le paiement puis envoyez la preuve au support en indiquant cette référence. La livraison ne sera confirmée qu’après vérification du paiement et du fournisseur.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/profile" className="btn-primary">Suivre ma commande</Link>
            <Link to="/payments" className="btn-secondary">Coordonnées de paiement</Link>
          </div>
        </section>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
          <form onSubmit={handleSubmit} className="card-surface p-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="product" className="mb-2 block text-sm font-medium text-slate-200">Produit</label>
                <select id="product" value={selectedProductId} onChange={(event) => setSelectedProductId(event.target.value)} className="input-field">
                  {productCatalog.map((product) => <option key={product.id} value={product.id}>{product.name} — {product.price.toLocaleString('fr-FR')} HTG</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="player-id" className="mb-2 block text-sm font-medium text-slate-200">Free Fire Player ID</label>
                <input id="player-id" inputMode="numeric" autoComplete="off" required minLength={5} maxLength={32} pattern="[0-9]{5,32}" value={playerId} onChange={(event) => setPlayerId(event.target.value)} placeholder="Ex : 123456789" className="input-field" />
              </div>
              <div>
                <span className="mb-2 block text-sm font-medium text-slate-200">Région du compte</span>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(['LATAM', 'GLOBAL'] as Region[]).map((option) => <button key={option} type="button" onClick={() => setRegion(option)} className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${region === option ? 'border-sky-500 bg-sky-500/10 text-white' : 'border-slate-700 bg-slate-900 text-slate-300'}`}>{option}</button>)}
                </div>
              </div>
              <div>
                <span className="mb-2 block text-sm font-medium text-slate-200">Moyen de paiement</span>
                <div className="grid gap-3 sm:grid-cols-3">
                  {paymentMethods.map((method) => <button key={method} type="button" onClick={() => setPaymentMethod(method)} className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${paymentMethod === method ? 'border-red-500 bg-red-500/10 text-white' : 'border-slate-700 bg-slate-900 text-slate-300'}`}>{method}</button>)}
                </div>
              </div>
              <label className="flex items-start gap-3 rounded-xl border border-slate-700 bg-slate-900/60 p-4 text-sm text-slate-300">
                <input type="checkbox" checked={confirm} onChange={(event) => setConfirm(event.target.checked)} className="mt-1 h-4 w-4" />
                <span>Je vérifie le Player ID et la région, et j’accepte le montant total affiché.</span>
              </label>
              {error && <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{error} {error.includes('Connectez-vous') && <Link className="underline" to="/login">Connexion</Link>}</div>}
              <button type="submit" disabled={busy} className="btn-primary w-full">{busy ? 'Enregistrement…' : 'Créer la commande'}</button>
            </div>
          </form>

          <aside className="card-surface h-fit p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Récapitulatif</div>
            <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-950 p-4">
              <div className="text-sm text-slate-400">Produit</div><div className="mt-2 text-xl font-black text-white">{selectedProduct.name}</div>
              <div className="mt-4 flex justify-between text-sm text-slate-300"><span>Région</span><span>{region}</span></div>
              <div className="mt-3 flex justify-between text-sm text-slate-300"><span>Paiement</span><span>{paymentMethod}</span></div>
              <div className="mt-5 flex justify-between border-t border-slate-800 pt-4 text-lg font-black text-white"><span>Total</span><span>{total.toLocaleString('fr-FR')} HTG</span></div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-400">La création d’une commande ne confirme ni le paiement ni la livraison. Gardez votre référence pour le suivi.</p>
          </aside>
        </div>
      )}
    </div>
  );
}
