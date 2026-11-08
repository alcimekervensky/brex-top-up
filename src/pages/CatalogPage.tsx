import { useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { productCatalog } from '../data/mockData';

export default function CatalogPage() {
  const [search, setSearch] = useState('');

  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase();
    return productCatalog.filter((product) =>
      product.name.toLowerCase().includes(q) || product.description.toLowerCase().includes(q),
    );
  }, [search]);

  return (
    <div className="container-shell py-14">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-red-300">Catalogue</div>
          <h1 className="mt-3 text-4xl font-black text-white">Diamonds, Memberships et packs premium</h1>
        </div>
        <div className="w-full max-w-md">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher un produit..."
            className="input-field"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="card-surface mt-8 p-10 text-center">
          <h3 className="text-xl font-bold text-white">Aucun produit trouvé</h3>
          <p className="mt-2 text-slate-300">Essayez un autre mot-clé ou consultez les packs recommandés.</p>
        </div>
      )}
    </div>
  );
}
