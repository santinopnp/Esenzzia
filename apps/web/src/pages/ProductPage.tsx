import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface Variant {
  id: string;
  size_ml: number;
  price: number;
  compare_price: number | null;
  stock_quantity: number;
}

interface Review {
  id: string;
  rating: number;
  title: string;
  body: string;
  created_at: string;
  user: { first_name: string; last_name: string };
}

interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  description: string;
  fragrance_family: string;
  gender: string;
  notes_top: string[];
  notes_heart: string[];
  notes_base: string[];
  images: string[];
  variants: Variant[];
  reviews: Review[];
  avg_rating: number;
  review_count: number;
  category: { name: string; slug: string };
}

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const StarRating = ({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) => {
  const s = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className={`${s} ${star <= Math.round(rating) ? 'text-accent' : 'text-line-strong'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { token } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [addedMsg, setAddedMsg] = useState('');
  const [imgIdx, setImgIdx] = useState(0);
  const [recommendations, setRecommendations] = useState<Array<{ slug: string; name: string; reason: string }>>([]);
  const [loadingRec, setLoadingRec] = useState(false);

  // Review form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');

  useEffect(() => {
    if (!slug) return;
    fetch(`${API}/products/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setProduct(data);
        if (data.variants?.length) {
          const mid = data.variants.find((v: Variant) => v.size_ml === 50) || data.variants[0];
          setSelectedVariant(mid);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    setAdding(true);
    try {
      await addItem('', selectedVariant.id, qty);
      setAddedMsg('¡Agregado al carrito!');
      setTimeout(() => setAddedMsg(''), 3000);
    } catch {
      setAddedMsg('Error al agregar');
    } finally {
      setAdding(false);
    }
  };

  const handleGetRecommendations = async () => {
    if (!product) return;
    setLoadingRec(true);
    try {
      const res = await fetch(`${API}/chat/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferences: `Me interesa ${product.name} de ${product.brand}, familia ${product.fragrance_family}`,
        }),
      });
      const data = await res.json();
      setRecommendations(data.recommendations || []);
    } catch {
      /* silent */
    } finally {
      setLoadingRec(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !product) return;
    setReviewSubmitting(true);
    try {
      const res = await fetch(`${API}/products/${product.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rating: reviewRating, title: reviewTitle, body: reviewBody }),
      });
      if (res.ok) {
        setReviewMsg('¡Reseña publicada! Gracias.');
        setReviewTitle('');
        setReviewBody('');
        setReviewRating(5);
        // reload product to show new review
        const updated = await fetch(`${API}/products/${slug}`).then((r) => r.json());
        setProduct(updated);
      } else {
        const err = await res.json();
        setReviewMsg(err.error || 'Error al publicar');
      }
    } catch {
      setReviewMsg('Error de conexión');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-ink-soft">Producto no encontrado</p>
        <button onClick={() => navigate('/tienda')} className="text-accent underline">Volver a la tienda</button>
      </div>
    );
  }

  const placeholder = `https://placehold.co/600x600/E9E1D3/7A5A22?text=${encodeURIComponent(product.brand)}`;
  const images = product.images?.length ? product.images : [placeholder];

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-sm text-ink-muted mb-6 flex gap-2">
          <button onClick={() => navigate('/')} className="hover:text-accent">Inicio</button>
          <span>/</span>
          <button onClick={() => navigate('/tienda')} className="hover:text-accent">Tienda</button>
          <span>/</span>
          <button onClick={() => navigate(`/tienda?categoria=${product.category?.slug}`)} className="hover:text-accent capitalize">{product.category?.name}</button>
          <span>/</span>
          <span className="text-ink">{product.name}</span>
        </nav>

        {/* Main grid */}
        <div className="grid md:grid-cols-2 gap-10 mb-16">
          {/* Images */}
          <div>
            <div className="aspect-square bg-surface-alt rounded-xl overflow-hidden mb-3">
              <img src={images[imgIdx]} alt={product.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = placeholder; }} />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)} className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${ i === imgIdx ? 'border-accent' : 'border-transparent' }`}>
                    <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = placeholder; }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            <div>
              <p className="eyebrow mb-ez-2">{product.brand}</p>
              <h1 className="perfume-name text-perfume-xl mb-ez-3">{product.name}</h1>
              <div className="flex items-center gap-3">
                <StarRating rating={product.avg_rating || 0} size="lg" />
                <span className="text-sm text-ink-muted">({product.review_count || 0} reseñas)</span>
                <span className="text-sm px-2 py-0.5 bg-surface-alt text-accent rounded-full capitalize">{product.fragrance_family}</span>
                <span className="text-sm px-2 py-0.5 bg-surface-alt text-ink-soft rounded-full capitalize">{product.gender}</span>
              </div>
            </div>

            {/* Variants */}
            <div>
              <p className="text-sm font-medium text-ink mb-2">Tamaño</p>
              <div className="flex gap-3">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    disabled={v.stock_quantity === 0}
                    className={`px-5 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                      selectedVariant?.id === v.id
                        ? 'border-accent bg-action text-action-on'
                        : v.stock_quantity === 0
                        ? 'border-line text-line-strong cursor-not-allowed'
                        : 'border-line text-ink hover:border-accent'
                    }`}
                  >
                    {v.size_ml} ML
                    {v.stock_quantity === 0 && <span className="block text-xs font-normal">Agotado</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            {selectedVariant && (
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-medium text-ink">
                  ${selectedVariant.price.toLocaleString('es-CO')} COP
                </span>
                {selectedVariant.compare_price && selectedVariant.compare_price > selectedVariant.price && (
                  <span className="text-xl text-ink-muted line-through">
                    ${selectedVariant.compare_price.toLocaleString('es-CO')}
                  </span>
                )}
              </div>
            )}

            {/* Qty + CTA */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border-2 border-line rounded-lg overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-lg font-medium hover:bg-surface-alt">−</button>
                <span className="px-4 py-2 text-center w-12">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-3 py-2 text-lg font-medium hover:bg-surface-alt">+</button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={adding || !selectedVariant || selectedVariant.stock_quantity === 0}
                className="flex-1 bg-action hover:bg-action-hover disabled:bg-line text-action-on font-medium py-3 px-6 rounded-lg transition-all"
              >
                {adding ? 'Agregando...' : 'Agregar al carrito'}
              </button>
            </div>
            {addedMsg && <p className={`text-sm font-medium ${addedMsg.includes('Error') ? 'text-danger' : 'text-ink-soft'}`}>{addedMsg}</p>}

            {/* Notes */}
            {(product.notes_top?.length || product.notes_heart?.length || product.notes_base?.length) && (
              <div className="border border-line rounded-xl p-5 bg-surface-alt">
                <p className="font-medium text-ink mb-3">Notas de fragancia</p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  {product.notes_top?.length > 0 && (
                    <div>
                      <p className="text-accent font-medium mb-1">Salida</p>
                      {product.notes_top.map((n) => <p key={n} className="text-ink-soft">{n}</p>)}
                    </div>
                  )}
                  {product.notes_heart?.length > 0 && (
                    <div>
                      <p className="text-accent font-medium mb-1">Corazón</p>
                      {product.notes_heart.map((n) => <p key={n} className="text-ink-soft">{n}</p>)}
                    </div>
                  )}
                  {product.notes_base?.length > 0 && (
                    <div>
                      <p className="text-accent font-medium mb-1">Base</p>
                      {product.notes_base.map((n) => <p key={n} className="text-ink-soft">{n}</p>)}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <p className="text-ink-soft leading-relaxed">{product.description}</p>
            )}
          </div>
        </div>

        {/* Valentina Recommendations */}
        <div data-theme="noir" className="rounded-2xl p-8 mb-16">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-3xl font-medium text-ink">Valentina recomienda para ti</h2>
              <p className="text-ink-muted text-sm mt-1">Nuestra IA experta en fragancias</p>
            </div>
            <button
              onClick={handleGetRecommendations}
              disabled={loadingRec}
              className="bg-action hover:bg-action-hover text-action-on font-medium px-6 py-2.5 rounded-lg transition-all disabled:opacity-60"
            >
              {loadingRec ? 'Consultando...' : 'Ver similares'}
            </button>
          </div>
          {recommendations.length > 0 && (
            <div className="grid sm:grid-cols-3 gap-4 mt-4">
              {recommendations.map((rec) => (
                <button
                  key={rec.slug}
                  onClick={() => navigate(`/producto/${rec.slug}`)}
                  className="text-left bg-surface-alt hover:bg-surface rounded-xl p-4 border border-line transition-all"
                >
                  <p className="perfume-name text-perfume-sm mb-1">{rec.name}</p>
                  <p className="text-ink-muted text-sm">{rec.reason}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reviews */}
        <div>
          <h2 className="text-2xl font-medium text-ink mb-6">Reseñas ({product.review_count || 0})</h2>

          {token && (
            <form onSubmit={handleReviewSubmit} className="bg-surface rounded-xl border border-line p-6 mb-8">
              <h3 className="font-medium text-ink mb-4">Dejar una reseña</h3>
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} type="button" onClick={() => setReviewRating(s)} className={`text-2xl transition-transform hover:scale-110 ${s <= reviewRating ? 'text-accent' : 'text-line-strong'}`}>★</button>
                ))}
              </div>
              <input
                className="w-full border border-line rounded-lg px-4 py-2.5 mb-3 focus:border-accent"
                placeholder="Título"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                maxLength={100}
              />
              <textarea
                className="w-full border border-line rounded-lg px-4 py-2.5 mb-3 h-24 resize-none focus:border-accent"
                placeholder="Cuéntanos tu experiencia..."
                value={reviewBody}
                onChange={(e) => setReviewBody(e.target.value)}
                maxLength={1000}
              />
              <button type="submit" disabled={reviewSubmitting} className="bg-action hover:bg-action-hover text-action-on font-medium px-6 py-2.5 rounded-lg transition-all disabled:opacity-60">
                {reviewSubmitting ? 'Publicando...' : 'Publicar reseña'}
              </button>
              {reviewMsg && <p className="mt-2 text-sm text-ink-soft">{reviewMsg}</p>}
            </form>
          )}

          {product.reviews?.length === 0 ? (
            <p className="text-ink-muted text-center py-8">Aún no hay reseñas. Sé la primera persona en opinar.</p>
          ) : (
            <div className="space-y-5">
              {product.reviews?.map((r) => (
                <div key={r.id} className="bg-surface rounded-xl border border-line p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-ink">{r.user.first_name} {r.user.last_name[0]}.</p>
                      <StarRating rating={r.rating} />
                    </div>
                    <p className="text-xs text-ink-muted">{new Date(r.created_at).toLocaleDateString('es-CO')}</p>
                  </div>
                  {r.title && <p className="font-medium text-ink mt-2">{r.title}</p>}
                  {r.body && <p className="text-ink-soft text-sm mt-1">{r.body}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
