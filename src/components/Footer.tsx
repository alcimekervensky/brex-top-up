import { ArrowRight, Github, MessageCircle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/80">
      <div className="container-shell py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-blue-500 font-black text-white">B</div>
              <div>
                <div className="font-black tracking-wide text-white">BREX TOP UP</div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Top Up</div>
              </div>
            </div>
            <p className="text-sm leading-6 text-slate-400">
              Plateforme professionnelle de vente de Diamonds Free Fire, memberships et produits gaming pour la communauté haïtienne.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Navigation</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><Link to="/catalog">Acheter Diamonds</Link></li>
              <li><Link to="/wallet">Portefeuille</Link></li>
              <li><Link to="/support">Support</Link></li>
              <li><Link to="/reseller">Revendeurs</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Légal</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><Link to="/terms">Conditions générales</Link></li>
              <li><Link to="/privacy">Politique de confidentialité</Link></li>
              <li><Link to="/refund">Politique de remboursement</Link></li>
              <li><Link to="/delivery">Conditions de livraison</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Paiement</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li>NatCash</li>
              <li>MonCash</li>
              <li>BREX Wallet</li>
              <li className="inline-flex items-center gap-2 text-sky-400"><MessageCircle size={14} /> WhatsApp</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-slate-800 pt-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>© 2026 BREX TOP UP. Tous droits réservés.</p>
          <div className="flex items-center gap-5 text-slate-500">
            <span className="inline-flex items-center gap-2"><ShieldCheck size={14} /> Sécurisé</span>
            <span className="inline-flex items-center gap-2"><Github size={14} /> GitHub-ready</span>
            <span className="inline-flex items-center gap-2"><ArrowRight size={14} /> Vercel-ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
