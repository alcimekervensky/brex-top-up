import { useState } from 'react';
import { ArrowRight, ChevronRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ResellerLandingPage() {
  const [email, setEmail] = useState('');

  return (
    <div className="container-shell py-16">
      <section className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-sky-300">Rejoignez le réseau</p>
          <h1 className="mt-3 text-4xl font-black text-white sm:text-5xl">Le portail revendeur BREX TOP UP</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Vendez des Diamonds et memberships avec des tarifs préférentiels, un stock intelligent et un tableau de bord personnel.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/reseller-login" className="btn-primary">Se connecter</Link>
            <Link to="/support" className="btn-secondary">Demander un accès</Link>
          </div>
          <div className="mt-8 flex items-center gap-3 text-sm text-slate-300">
            <ShieldCheck size={18} className="text-emerald-400" />
            Accès sécurisé réservé aux comptes approuvés.
          </div>
        </div>

        <div className="card-surface p-8">
          <div className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
            <div className="mb-4 text-xs uppercase tracking-[0.2em] text-red-300">Program</div>
            <h2 className="text-2xl font-black text-white">Accès revendeur</h2>
            <div className="mt-6 space-y-4 text-slate-300">
              <div className="flex items-center justify-between"><span>Tarif préférentiel</span><ChevronRight size={16} /></div>
              <div className="flex items-center justify-between"><span>Commandes suivies</span><ChevronRight size={16} /></div>
              <div className="flex items-center justify-between"><span>Solde et statistiques</span><ChevronRight size={16} /></div>
            </div>
            <div className="mt-6">
              <label className="mb-2 block text-sm text-slate-300">Email professionnel</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="you@example.com" />
              <button className="btn-primary mt-4 w-full">Demander l’accès <ArrowRight size={16} className="ml-2" /></button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
