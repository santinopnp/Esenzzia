import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

export default function ShopPage() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Array<{ slug: string; name: string }>>([]);
  const [total, setTotal]   = useState(0);
  const [page, setPage]     = useState(1);
  const [loading, setLoading] = useState(true);

  const category = params.get('category') || '';
  const search   = params.get('q') || '';
  const sort     = params.get('sort') || 'created_at';

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ page: String(page), limit: '24', sort });
      if (category) qs.set('category', category);
      if (search)   qs.set('search', search);
      const r = await fetch(`/api/products?${qs}`);
      const d = await r.json();
      setProducts(d.products || []);
      setTotal(d.total || 0);
    } finally { setLoading(false); }
  }, [page, category, search, sort]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    fetch('/api/products/categories').then(r => r.json()).then(setCategories).catch(() => {});
  }, []);

  const fmt = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row gap-8">
        {/* Sidebar filters */}
        <aside className="w-full sm:w-56 flex-shrink-0">
          <h3 className="font-serif font-semibold text-lg mb-4">Categorias</h3>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => { setParams({}); setPage(1); }}
                className={`w-full text-left px-3 py-2 rounded-sm text-sm transition-colors ${
                  !category ? 'bg-gold text-white' : 'hover:bg-cream-warm'
                }`}
              >Todos</button>
            </li>
            {categories.map((c) => (
              <li key={c.slug}>
                <button
                  onClick={() => { setParams({ category: c.slug }); setPage(1); }}
                  className={`w-full text-left px-3 py-2 rounded-sm text-sm transition-colors ${
                    category === c.slug ? 'bg-gold text-white' : 'hover:bg-cream-warm'
                  }`}
                >{c.name}</button>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <h3 className="font-serif font-semibold text-sm mb-3 uppercase tracking-wider">Ordenar</h3>
            <select
              value={sort}
              onChange={e => { setParams(p => { p.set('sort', e.target.value); return p; }); }}
              className="input text-sm"
            >
              <option value="created_at">Nuevos primero</option>
              <option value="price_asc">Precio: menor a mayor</option>
              <option value="price_desc">Precio: mayor a menor</option>
              <option value="name">Nombre</option>
            </select>
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-serif text-2xl font-bold">
              {category ? categories.find((c) => c.slug === category)?.name || 'Catalogo' : 'Catalogo'}
            </h1>
            <p className="text-sm text-gray-500">{total} productos</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="card">
                  <div className="aspect-square bg-cream-warm animate-pulse" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {products.map((p: any) => (
                <ProductCard key={p.id} product={p} />
              ))}
              {products.length === 0 && (
                <div className="col-span-3 text-center py-16 text-gray-400">
                  No se encontraron productos.
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {total > 24 && (
            <div className="flex justify-center gap-2 mt-10">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded border disabled:opacity-40">← Anterior</button>
              <span className="px-4 py-2 text-sm text-gray-500">Pág. {page} de {Math.ceil(total / 24)}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 24)} className="px-4 py-2 rounded border disabled:opacity-40">Siguiente →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
