import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();

  return (
    <article className="card-surface overflow-hidden transition hover:-translate-y-1 hover:border-sky-500/50">
      <img src={product.image} alt={product.name} className="h-44 w-full object-cover" />
      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full border border-slate-700 bg-slate-800 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-sky-300">
            {product.category}
          </span>
          <span className="text-lg font-black text-white">{product.price.toLocaleString('fr-FR')} HTG</span>
        </div>

        <div>
          <h3 className="text-xl font-bold text-white">{product.name}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">{product.description}</p>
        </div>

        <button
          onClick={() => navigate('/checkout', { state: { product } })}
          className="btn-primary w-full"
        >
          <ShoppingCart size={16} className="mr-2" />
          Acheter
        </button>
      </div>
    </article>
  );
}
