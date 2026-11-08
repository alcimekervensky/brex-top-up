import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ResellerLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password) {
      setMessage('Veuillez remplir les informations revendeur.');
      return;
    }

    setMessage('Connexion revendeur prête. Le tableau de bord est configuré pour l’accès autorisé.');
  };

  return (
    <div className="container-shell py-16">
      <form onSubmit={handleSubmit} className="card-surface mx-auto max-w-md space-y-5 p-7">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-sky-300">Revendeur</p>
          <h1 className="mt-2 text-3xl font-black text-white">Connexion revendeur</h1>
        </div>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          placeholder="Email revendeur"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          placeholder="Mot de passe"
        />

        {message && <p className="text-sm text-sky-200">{message}</p>}

        <button type="submit" className="btn-primary w-full">
          Se connecter
        </button>

        <p className="text-center text-sm text-slate-400">
          Accès réservé aux comptes revendeurs autorisés.
        </p>
      </form>
    </div>
  );
}
