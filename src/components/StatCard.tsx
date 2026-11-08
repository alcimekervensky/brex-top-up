interface StatCardProps {
  label: string;
  value: string;
  accent?: 'red' | 'blue' | 'slate';
}

export default function StatCard({ label, value, accent = 'blue' }: StatCardProps) {
  const accentMap = {
    blue: 'from-blue-600/20 to-sky-500/5 text-sky-300 border-blue-500/30',
    red: 'from-red-600/20 to-red-500/5 text-red-300 border-red-500/30',
    slate: 'from-slate-600/20 to-slate-500/5 text-slate-200 border-slate-500/30',
  };

  return (
    <div className={`rounded-2xl border bg-gradient-to-br p-5 ${accentMap[accent]}`}>
      <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</div>
      <div className="mt-3 text-3xl font-black text-white">{value}</div>
    </div>
  );
}
