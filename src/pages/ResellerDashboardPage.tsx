import { BarChart3, CreditCard, Package, ShoppingCart, TrendingUp, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { productCatalog } from '../data/mockData';

const resellerProducts = productCatalog.slice(0, 6);

export default function ResellerDashboardPage() {
  return (
    <div className="container-shell py-14">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-sky-300">Portail revendeur</p>
          <h1 className="mt-2 text-4xl font-black text-white">Dashboard revendeur</h1>
        </div>
        <Link to="/" className="btn-secondary">Retour au site</Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="card-surface p-5">
          <div className="flex items-center gap-3 text-sky-300"><Wallet size={18} /> <span className="text-sm uppercase tracking-[0.2em] text-slate-400">Solde</span></div>
          <div className="mt-4 text-3xl font-black text-white">18 250 HTG</div>
        </div>

        <div className="card-surface p-5">
          <div className="flex items-center gap-3 text-red-300"><ShoppingCart size={18} /> <span className="text-sm uppercase tracking-[0.2em] text-slate-400">Commandes</span></div>
          <div className="mt-4 text-3xl font-black text-white">27</div>
        </div>

        <div className="card-surface p-5">
          <div className="flex items-center gap-3 text-emerald-300"><TrendingUp size={18} /> <span className="text-sm uppercase tracking-[0.2em] text-slate-400">Ventes</span></div>
          <div className="mt-4 text-3xl font-black text-white">54 200 HTG</div>
        </div>

        <div className="card-surface p-5">
          <div className="flex items-center gap-3 text-violet-300"><BarChart3 size={18} /> <span className="text-sm uppercase tracking-[0.2em] text-slate-400">Rendement</span></div>
          <div className="mt-4 text-3xl font-black text-white">98.4%</div>
        </div>
      </div>

      <div className="mt-10 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="card-surface p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-black text-white">Catalogue revendeur</h2>
            <span className="text-sm text-sky-300">Tarifs préférentiels</span>
          </div>

          <div className="space-y-4">
            {resellerProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between gap-4 rounded-xl border border-slate-700 bg-slate-900/70 p-4">
                <div>
                  <div className="font-semibold text-white">{product.name}</div>
                  <div className="text-sm text-slate-400">{product.description}</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-red-400">{product.price.toLocaleString('fr-FR')} HTG</div>
                  <div className="text-xs text-slate-500">Tarif revendeur</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card-surface p-6">
          <h2 className="text-2xl font-black text-white">Commandes récentes</h2>
          <div className="mt-5 space-y-4">
            {[
              { id: 'BTU-1021', status: 'Paid', amount: '1 500 HTG' },
              { id: 'BTU-1022', status: 'Processing', amount: '750 HTG' },
              { id: 'BTU-1023', status: 'Completed', amount: '300 HTG' },
            ].map((order) => (
              <div key={order.id} className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{order.id}</span>
                  <span className="rounded-full border border-slate-600 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-300">
                    {order.status}
                  </span>
                </div>
                <div className="mt-2 text-sm text-slate-300">Montant: {order.amount}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <div className="card-surface p-6">
          <div className="flex items-center gap-3 text-sky-300">
            <Package size={18} />
            <span className="text-sm uppercase tracking-[0.2em] text-slate-400">Stock</span>
          </div>
          <div className="mt-4 text-3xl font-black text-white">89%</div>
        </div>

        <div className="card-surface p-6">
          <div className="flex items-center gap-3 text-red-300">
            <CreditCard size={18} />
            <span className="text-sm uppercase tracking-[0.2em] text-slate-400">Retraits</span>
          </div>
          <div className="mt-4 text-3xl font-black text-white">5</div>
        </div>

        <div className="card-surface p-6">
          <div className="flex items-center gap-3 text-emerald-300">
            <TrendingUp size={18} />
            <span className="text-sm uppercase tracking-[0.2em] text-slate-400">Croissance</span>
          </div>
          <div className="mt-4 text-3xl font-black text-white">+12%</div>
        </div>
      </div>
    </div>
  );
}
