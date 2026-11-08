import { Menu, ShoppingCart, WalletCards } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Accueil' },
  { to: '/catalog', label: 'Acheter Diamonds' },
  { to: '/login', label: 'Connexion' },
  { to: '/signup', label: 'Créer un compte' },
  { to: '/wallet', label: 'Mon portefeuille' },
  { to: '/profile', label: 'Historique des commandes' },
  { to: '/support', label: 'Support client' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl">
      <div className="container-shell flex items-center justify-between py-4">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 via-blue-600 to-slate-200 text-lg font-black text-white shadow-glow">
            B
          </div>
          <div>
            <div className="text-xl font-black tracking-wide text-white">BREX TOP UP</div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Free Fire</div>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-5 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? 'text-red-400' : 'text-slate-300 hover:text-white'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:border-sky-500">
            <WalletCards size={16} />
            Portefeuille
          </button>
          <NavLink to="/catalog" className="btn-primary">
            <ShoppingCart size={16} className="mr-2" />
            Acheter
          </NavLink>
        </div>

        <button className="rounded-xl border border-slate-700 p-2 lg:hidden">
          <Menu size={18} />
        </button>
      </div>
    </header>
  );
}
