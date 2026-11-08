import { Link } from 'react-router-dom';

export default function InfoPage({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="container-shell py-16"><div className="card-surface mx-auto max-w-3xl p-8"><p className="text-xs uppercase tracking-[0.2em] text-sky-300">BREX TOP UP</p><h1 className="mt-3 text-3xl font-black text-white">{title}</h1><div className="mt-6 space-y-4 leading-7 text-slate-300">{children}</div><Link className="btn-secondary mt-8" to="/">Retour à l’accueil</Link></div></div>;
}
