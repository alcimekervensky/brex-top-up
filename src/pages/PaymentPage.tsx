import { useState } from 'react';
import { Link } from 'react-router-dom';
import { requireSupabase, supabaseConfigured } from '../lib/supabase';

const paymentDetails = {
  beneficiary: 'Alcime Sheidlyne',
  NatCash: '43737529',
  MonCash: '31888253',
};

export default function PaymentPage() {
  const [method, setMethod] = useState<'NatCash' | 'MonCash'>('NatCash');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [proof, setProof] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabaseConfigured) { setMessage('Configurez Supabase avant d’envoyer une preuve.'); return; }
    setBusy(true); setMessage('');
    try {
      const sb = requireSupabase();
      const { data: { user } } = await sb.auth.getUser();
      if (!user) { setMessage('Connectez-vous pour soumettre une demande de dépôt.'); return; }
      const value = Number(amount);
      if (!Number.isSafeInteger(value) || value < 1) throw new Error('Montant invalide.');
      let proofPath: string | null = null;
      if (proof) {
        if (proof.size > 5 * 1024 * 1024 || !['image/png', 'image/jpeg', 'application/pdf'].includes(proof.type)) {
          throw new Error('Preuve invalide : JPG, PNG ou PDF, 5 Mo maximum.');
        }
        const path = `${user.id}/${crypto.randomUUID()}-${proof.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        const { error: uploadError } = await sb.storage.from('payment-proofs').upload(path, proof, { upsert: false });
        if (uploadError) throw uploadError;
        proofPath = path;
      }
      const { error } = await sb.from('deposit_requests').insert({ user_id: user.id, amount_htg: value, method, provider_reference: reference.trim(), proof_path: proofPath });
      if (error) throw error;
      setMessage('Demande envoyée. Le dépôt ne sera crédité qu’après vérification par l’administration.');
      setAmount(''); setReference(''); setProof(null);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Envoi impossible.');
    } finally { setBusy(false); }
  }

  return (
    <div className="container-shell py-14">
      <h1 className="text-4xl font-black">Paiement et preuve de dépôt</h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <form onSubmit={submit} className="card-surface space-y-4 p-6">
          <div className="rounded-xl border border-sky-500/20 bg-slate-950 p-4">
            <p className="text-sm text-slate-400">Bénéficiaire</p><p className="font-bold text-white">{paymentDetails.beneficiary}</p>
            <p className="mt-3 text-sm text-slate-400">{method}</p><p className="text-2xl font-black text-sky-300">{paymentDetails[method]}</p>
            <p className="mt-2 text-xs text-slate-500">Vérifiez le nom du bénéficiaire avant d’envoyer de l’argent.</p>
          </div>
          <label className="block text-sm">Moyen de paiement<select className="input-field mt-2" value={method} onChange={event => setMethod(event.target.value as 'NatCash' | 'MonCash')}><option>NatCash</option><option>MonCash</option></select></label>
          <input required min="1" step="1" type="number" className="input-field" placeholder="Montant (HTG)" value={amount} onChange={event => setAmount(event.target.value)} />
          <input required className="input-field" placeholder="Numéro de transaction du paiement" value={reference} onChange={event => setReference(event.target.value)} />
          <input type="file" accept="image/png,image/jpeg,application/pdf" onChange={event => setProof(event.target.files?.[0] ?? null)} className="input-field" />
          <p className="text-xs text-slate-400">Capture facultative, JPG/PNG/PDF, 5 Mo maximum. Pour une commande, indiquez aussi sa référence au support.</p>
          {message && <p role="status" className="text-sm text-sky-200">{message}</p>}
          <button disabled={busy} className="btn-primary w-full">{busy ? 'Envoi…' : 'Envoyer la preuve de dépôt'}</button>
        </form>
        <aside className="card-surface h-fit p-6">
          <h2 className="text-xl font-bold">Demande de dépôt</h2>
          <p className="mt-3 leading-7 text-slate-300">Cette page soumet une demande de dépôt au portefeuille, elle ne valide pas automatiquement le paiement. L’administration vérifiera le transfert avant tout crédit.</p>
          <Link to="/support" className="btn-secondary mt-5">Contacter le support</Link>
        </aside>
      </div>
    </div>
  );
}
