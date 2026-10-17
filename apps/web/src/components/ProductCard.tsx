import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Isotipo } from './brand/Logo';

interface Product {
  id: string; slug: string; name: string; brand: string;
  price: number; compare_price?: number; currency: string;
  images?: string[]; fragrance_family?: string; avg_rating?: number;
}

/** Precio en pesos con punto de miles y espacio: $ 180.000 */
export const formatCOP = (n: number) => `$ ${Math.round(n).toLocaleString('es-CO')}`;

export default function ProductCard({ product }: { product: Product }) {
  const { addItem, loading } = useCart();

  return (
    <article className="card group flex flex-col overflow-hidden">
      <Link to={`/shop/${product.slug}`} className="flex flex-col flex-1 rounded-lg">
        <div className="relative aspect-[4/3] bg-surface-alt flex items-center justify-center overflow-hidden">
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <Isotipo size={56} />
          )}
          {product.compare_price && product.compare_price > product.price && (
            <span className="badge-oro absolute top-ez-3 left-ez-3">Oferta</span>
          )}
        </div>
        <div className="flex flex-col gap-ez-1 p-ez-4 sm:p-ez-5 flex-1">
          <span className="eyebrow">{product.brand}</span>
          <h3 className="perfume-name text-perfume-sm sm:text-perfume group-hover:underline decoration-accent-decor underline-offset-4">{product.name}</h3>
          {product.fragrance_family && (
            <p className="text-body-sm text-ink-soft capitalize">{product.fragrance_family}</p>
          )}
          <div className="mt-auto pt-ez-3 border-t border-line flex flex-wrap justify-between items-baseline gap-x-ez-2">
            {product.compare_price && product.compare_price > product.price ? (
              <span className="legal line-through whitespace-nowrap">{formatCOP(product.compare_price)}</span>
            ) : <span />}
            <span className="ml-auto font-medium text-nav text-ink tracking-[0.04em] whitespace-nowrap">{formatCOP(product.price)}</span>
          </div>
        </div>
      </Link>
      <div className="px-ez-4 pb-ez-4 sm:px-ez-5 sm:pb-ez-5">
        <button onClick={() => addItem(product.id, null)} disabled={loading} className="btn-primary w-full px-ez-2 tracking-normal sm:tracking-[0.08em]">
          Agregar al carrito
        </button>
      </div>
    </article>
  );
}
