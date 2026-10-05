import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

interface Product {
  id: string; slug: string; name: string; brand: string;
  price: number; compare_price?: number; currency: string;
  images?: string[]; fragrance_family?: string; avg_rating?: number;
}

export default function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { addItem, loading } = useCart();
  const formatted = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format;

  return (
    <div className="card group overflow-hidden">
      <Link to={`/shop/${product.slug}`}>
        <div className="aspect-square bg-cream-warm flex items-center justify-center overflow-hidden">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex flex-col items-center text-gray-300">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <span className="text-xs mt-1">{product.brand}</span>
            </div>
          )}
        </div>
        <div className={compact ? 'p-3' : 'p-4'}>
          <p className="text-xs text-gold font-semibold uppercase tracking-wider mb-1 truncate">{product.brand}</p>
          <h3 className={`font-serif font-semibold leading-snug group-hover:text-gold transition-colors mb-1.5 ${compact ? 'text-xs line-clamp-2' : 'text-sm mb-2'}`}>
            {product.name}
          </h3>
          {!compact && product.fragrance_family && (
            <span className="inline-block text-xs bg-cream-warm text-gray-500 px-2 py-0.5 rounded-sm capitalize mb-2">
              {product.fragrance_family}
            </span>
          )}
          <div className="flex items-baseline gap-1.5">
            <span className={`font-bold text-dark ${compact ? 'text-xs' : ''}`}>{formatted(product.price)}</span>
            {!compact && product.compare_price && product.compare_price > product.price && (
              <span className="text-xs text-gray-400 line-through">{formatted(product.compare_price)}</span>
            )}
          </div>
        </div>
      </Link>
      <div className={compact ? 'px-3 pb-3' : 'px-4 pb-4'}>
        <button
          onClick={() => addItem(product.id, null)}
          disabled={loading}
          className={`btn-primary w-full ${compact ? 'text-xs py-2.5' : 'text-sm py-2'}`}
        >
          {compact ? 'Agregar' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  );
}
