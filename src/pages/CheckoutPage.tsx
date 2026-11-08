import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { paymentMethods, productCatalog } from '../data/mockData';
import type { Product, Region } from '../types';

export default function CheckoutPage() {
  const location = useLocation();
  const initialProduct = (location.state as { product?: Product } | null)?.product ?? productCatalog[0];

  const [selectedProductId, setSelectedProductId] = useState(initialProduct.id);
  const [playerId, setPlayerId] = useState('');
  const [region, setRegion] = useState<Region>('LATAM');
  const [paymentMethod, setPaymentMethod] = useState('NatCash');
  const [confirm, setConfirm] = useState(false);
  const [success, setSuccess] = useState('');

  const selectedProduct = useMemo(
    () => productCatalog.find((product) => product.id === selectedProductId) ?? productCatalog[0],
    [selectedProductId],
  );

  const total = selectedProduct.price;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!playerId || !confirm) {
      setSuccess('Veuillez remplir les informations et confirmer la commande.');
      return;
    }

    const orderRef = `BTU-${Math.floor(Math.random() * 90000 + 10000)}`;
    setSuccess(`Commande confirmée. Référence: ${orderRef}. Vous pouvez suivre votre commande depuis votre compte.`);
  };

  return (
    <div className="container-shell py-14">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-[0.2em] text-sky-300">Acheter</div>
        <h1 className="mt-3 text-4xl font-black text-white">Finaliser votre commande</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <form onSubmit={handleSubmit} className="card-surface p-6">
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Produit</label>
              <select
                value={selectedProductId}
                onChange={(event) => setSelectedProductId(event.target.value)}
                className="input-field"
              >
                {productCatalog.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} — {product.price.toLocaleString('fr-FR')} HTG
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Free Fire Player ID</label>
              <input
                value={playerId}
                onChange={(event) => setPlayerId(event.target.value)}
                placeholder="Ex: 123456789"
                className="input-field"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Région du compte</label>
              <div className="grid gap-3 sm:grid-cols-2">
                {(['LATAM', 'GLOBAL'] as Region[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setRegion(option)}
                    className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                      region === option ? 'border-sky-500 bg-sky-500/10 text-white' : 'border-slate-700 bg-slate-900 text-slate-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Moyen de paiement</label>
              <div className="grid gap-3 sm:grid-cols-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                      paymentMethod === method ? 'border-red-500 bg-red-500/10 text-white' : 'border-slate-700 bg-slate-900 text-slate-300'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-start gap-3 rounded-xl border border-slate-700 bg-slate-900/60 p-4 text-sm text-slate-300">
              <input type="checkbox" checked={confirm} onChange={() => setConfirm((value) => !value)} className="mt-1 h-4 w-4" />
              <span>Je confirme que les informations du compte et le montant sont corrects avant validation.</span>
            </label>

            {success && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
                {success}
              </div>
            )}

            <button type="submit" className="btn-primary w-full">
              Confirmer la commande
            </button>
          </div>
        </form>

        <aside className="card-surface h-fit p-6">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Aperçu</div>
          <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-950 p-4">
            <div className="text-sm text-slate-400">Produit sélectionné</div>
            <div className="mt-2 text-xl font-black text-white">{selectedProduct.name}</div>
            <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
              <span>Prix</span>
              <span>{selectedProduct.price.toLocaleString('fr-FR')} HTG</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-slate-300">
              <span>Région</span>
              <span>{region}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-slate-300">
              <span>Paiement</span>
              <span>{paymentMethod}</span>
            </div>
            <div className="mt-5 border-t border-slate-800 pt-4">
              <div className="flex items-center justify-between text-lg font-black text-white">
                <span>Total</span>
                <span>{total.toLocaleString('fr-FR')} HTG</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
