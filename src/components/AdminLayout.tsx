import { LayoutDashboard, LogOut, PackageCheck, Settings, Store } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { requireSupabase, supabaseConfigured } from '../lib/supabase';

const links = [
  { to: '/admin', label: 'Vue générale', icon: LayoutDashboard, end: true },
  { to: '/admin/orders', label: 'Commandes reçues', icon: PackageCheck },
  { to: '/admin/supplier', label: 'Fournisseur API', icon: Settings },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  async function logout() {
    if (supabaseConfigured) await requireSupabase().auth.signOut();
    navigate('/login');
  }
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-slate-800 bg-slate-900/80 p-5 lg:min-h-screen lg:border-b-0 lg:border-r">
        <NavLink to="/admin" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-blue-600 font-black">B</span>
          <span><b className="block">BREX TOP UP</b><small className="text-slate-400">Administration</small></span>
        </NavLink>
        <nav className="mt-8 flex gap-2 overflow-x-auto lg:flex-col">
          {links.map(({to,label,icon:Icon,end}) => <NavLink key={to} to={to} end={end} className={({isActive})=>`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm ${isActive?'bg-red-600 text-white':'text-slate-300 hover:bg-slate-800'}`}><Icon size={17}/>{label}</NavLink>)}
          <NavLink to="/" className="flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 hover:bg-slate-800"><Store size={17}/>Boutique</NavLink>
        </nav>
        <button onClick={logout} className="btn-secondary mt-6 w-full"><LogOut size={16} className="mr-2"/>Déconnexion</button>
      </aside>
      <main className="min-w-0"><Outlet/></main>
    </div>
  );
}
