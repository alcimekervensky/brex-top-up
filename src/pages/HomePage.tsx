import { ArrowRight, CheckCircle2, CreditCard, ShieldCheck, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { featuredPromos, paymentInfo, productCatalog } from '../data/mockData';

export default function HomePage() {
  const featured = productCatalog.filter((product) => product.featured).slice(0, 4);

  return (
    <div>
      <section className="container-shell py-16 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-300">
              <Sparkles size={14} />
              Boutique officielle
            </div>
            <h1 className="max-w-xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              Achetez vos Diamonds Free Fire en HTG, rapidement et en toute sécurité.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
              BREX TOP UP propose des packs premium, des memberships et des moyens de paiement locaux pour des achats fiables et rapides.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/catalog" className="btn-primary">
                Acheter Diamonds
              </Link>
              <Link to="/signup" className="btn-secondary">
                Créer un compte
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="card-surface p-4">
                <div className="flex items-center gap-3 text-sky-300"><Zap size={18} /> <span className="font-bold">Livraison rapide</span></div>
              </div>
              <div className="card-surface p-4">
                <div className="flex items-center gap-3 text-red-300"><ShieldCheck size={18} /> <span className="font-bold">Sécurisé</span></div>
              </div>
              <div className="card-surface p-4">
                <div className="flex items-center gap-3 text-emerald-300"><TrendingUp size={18} /> <span className="font-bold">24/7</span></div>
              </div>
            </div>
          </div>

          <div className="card-surface overflow-hidden p-4">
            <div className="rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Offre du jour</div>
                  <div className="mt-2 text-3xl font-black text-white">-25%</div>
                </div>
                <div className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-green-300">
                  Valide aujourd’hui
                </div>
              </div>

              <div className="space-y-4">
                {featured.map((product) => (
                  <div key={product.id} className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/70 p-3">
                    <div>
                      <div className="font-semibold text-white">{product.name}</div>
                      <div className="text-sm text-slate-400">{product.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-sky-300">{product.price.toLocaleString('fr-FR')} HTG</div>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/catalog" className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-red-600 to-blue-600 px-4 py-3 font-semibold text-white">
                Voir tous les packs <ArrowRight className="ml-2" size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-800 bg-slate-900/40 py-12">
        <div className="container-shell">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-sky-300">Produits populaires</div>
              <h2 className="mt-3 text-3xl font-black text-white">Top packs Free Fire</h2>
            </div>
            <Link to="/catalog" className="text-sm font-semibold text-red-400 hover:text-red-300">Voir tout</Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell py-14">
        <div className="mb-8 text-center">
          <div className="text-xs uppercase tracking-[0.2em] text-sky-300">Dernières promos</div>
          <h2 className="mt-3 text-3xl font-black text-white">Réductions spéciales</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {featuredPromos.map((promo, index) => (
            <div key={promo.title} className={`rounded-2xl border p-6 ${index === 0 ? 'border-red-500/30 bg-red-500/10' : index === 1 ? 'border-sky-500/30 bg-sky-500/10' : 'border-slate-600 bg-slate-800/60'}`}>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-slate-950/50 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-300">Promo</div>
              <h3 className="text-2xl font-black text-white">{promo.title}</h3>
              <p className="mt-4 text-slate-300">{promo.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900/60 py-14">
        <div className="container-shell">
          <div className="mb-8 text-center">
            <div className="text-xs uppercase tracking-[0.2em] text-red-300">Moyens de paiement</div>
            <h2 className="mt-3 text-3xl font-black text-white">Paiements haïtiens sécurisés</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {paymentInfo.map((item) => (
              <div key={item.label} className="card-surface p-6">
                <div className="mb-3 flex items-center gap-3 text-sky-300">
                  <CreditCard size={18} />
                  <span className="text-sm uppercase tracking-[0.2em] text-slate-400">{item.label}</span>
                </div>
                <div className="text-xl font-bold text-white">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell py-14">
        <div className="card-surface p-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-sky-300">
            <CheckCircle2 size={14} />
            Support client
          </div>
          <h2 className="text-3xl font-black text-white">Besoin d’aide ? Un agent vous répond rapidement.</h2>
          <p className="mt-4 text-slate-300">
            Utilisez WhatsApp pour obtenir un soutien direct, des explications sur vos achats ou une vérification de paiement.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a href="https://wa.me/50900000000" target="_blank" rel="noreferrer" className="btn-primary">
              <MessageCircle size={16} className="mr-2" />
              WhatsApp
            </a>
            <Link to="/support" className="btn-secondary">Support client</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
