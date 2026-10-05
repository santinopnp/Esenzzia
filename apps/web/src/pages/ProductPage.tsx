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
        <svg key={star} className={`${s} ${star <= Math.round(rating) ? 'text-gold' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
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
      await addToCart(selectedVariant.id, qty);
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
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gold" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-gray-600">Producto no encontrado</p>
        <button onClick={() => navigate('/tienda')} className="text-gold underline">Volver a la tienda</button>
      </div>
    );
  }

  const placeholder = `https://placehold.co/600x600/1A1A1A/C9A84C?text=${encodeURIComponent(product.brand)}`;
  const images = product.images?.length ? product.images : [placeholder];

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 flex gap-2">
          <button onClick={() => navigate('/')} className="hover:text-gold">Inicio</button>
          <span>/</span>
          <button onClick={() => navigate('/tienda')} className="hover:text-gold">Tienda</button>
          <span>/</span>
          <button onClick={() => navigate(`/tienda?categoria=${product.category?.slug}`)} className="hover:text-gold capitalize">{product.category?.name}</button>
          <span>/</span>
          <span className="text-dark">{product.name}</span>
        </nav>

        {/* Main grid */}
        <div className="grid md:grid-cols-2 gap-10 mb-16">
          {/* Images */}
          <div>
            <div className="aspect-square bg-dark rounded-xl overflow-hidden mb-3">
              <img src={images[imgIdx]} alt={product.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = placeholder; }} />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)} className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${ i === imgIdx ? 'border-gold' : 'border-transparent' }`}>
                    <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = placeholder; }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-1">{product.brand}</p>
              <h1 className="text-3xl font-bold text-dark mb-2">{product.name}</h1>
              <div className="flex items-center gap-3">
                <StarRating rating={product.avg_rating || 0} size="lg" />
                <span className="text-sm text-gray-500">({product.review_count || 0} reseñas)</span>
                <span className="text-sm px-2 py-0.5 bg-gold/10 text-gold rounded-full capitalize">{product.fragrance_family}</span>
                <span className="text-sm px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full capitalize">{product.gender}</span>
              </div>
            </div>

            {/* Variants */}
            <div>
              <p className="text-sm font-semibold text-dark mb-2">Tamaño</p>
              <div className="flex gap-3">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    disabled={v.stock_quantity === 0}
                    className={`px-5 py-2.5 rounded-lg border-2 text-sm font-semibold transition-all ${
                      selectedVariant?.id === v.id
                        ? 'border-gold bg-gold text-dark'
                        : v.stock_quantity === 0
                        ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                        : 'border-gray-300 text-dark hover:border-gold'
                    }`}
                  >
                    {v.size_ml}ml
                    {v.stock_quantity === 0 && <span className="block text-xs font-normal">Agotado</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            {selectedVariant && (
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-dark">
                  ${selectedVariant.price.toLocaleString('es-CO')} COP
                </span>
                {selectedVariant.compare_price && selectedVariant.compare_price > selectedVariant.price && (
                  <span className="text-xl text-gray-400 line-through">
                    ${selectedVariant.compare_price.toLocaleString('es-CO')}
                  </span>
                )}
              </div>
            )}

            {/* Qty + CTA */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-lg font-bold hover:bg-gray-100">−</button>
                <span className="px-4 py-2 text-center w-12">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-3 py-2 text-lg font-bold hover:bg-gray-100">+</button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={adding || !selectedVariant || selectedVariant.stock_quantity === 0}
                className="flex-1 bg-gold hover:bg-gold/90 disabled:bg-gray-300 text-dark font-bold py-3 px-6 rounded-lg transition-all"
              >
                {adding ? 'Agregando...' : '🛒 Agregar al carrito'}
              </button>
            </div>
            {addedMsg && <p className={`text-sm font-semibold ${addedMsg.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>{addedMsg}</p>}

            {/* Notes */}
            {(product.notes_top?.length || product.notes_heart?.length || product.notes_base?.length) && (
              <div className="border border-gold/20 rounded-xl p-5 bg-white/60">
                <p className="font-semibold text-dark mb-3">Notas de fragancia</p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  {product.notes_top?.length > 0 && (
                    <div>
                      <p className="text-gold font-medium mb-1">Salida</p>
                      {product.notes_top.map((n) => <p key={n} className="text-gray-600">{n}</p>)}
                    </div>
                  )}
                  {product.notes_heart?.length > 0 && (
                    <div>
                      <p className="text-gold font-medium mb-1">Corazón</p>
                      {product.notes_heart.map((n) => <p key={n} className="text-gray-600">{n}</p>)}
                    </div>
                  )}
                  {product.notes_base?.length > 0 && (
                    <div>
                      <p className="text-gold font-medium mb-1">Base</p>
                      {product.notes_base.map((n) => <p key={n} className="text-gray-600">{n}</p>)}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            )}
          </div>
        </div>

        {/* Valentina Recommendations */}
        <div className="bg-dark rounded-2xl p-8 mb-16">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-cream">✨ Valentina recomienda para ti</h2>
              <p className="text-gray-400 text-sm mt-1">Nuestra IA experta en fragancias</p>
            </div>
            <button
              onClick={handleGetRecommendations}
              disabled={loadingRec}
              className="bg-gold hover:bg-gold/90 text-dark font-bold px-6 py-2.5 rounded-lg transition-all disabled:opacity-60"
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
                  className="text-left bg-white/5 hover:bg-white/10 rounded-xl p-4 border border-gold/20 transition-all"
                >
                  <p className="text-gold font-semibold mb-1">{rec.name}</p>
                  <p className="text-gray-400 text-sm">{rec.reason}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reviews */}
        <div>
          <h2 className="text-2xl font-bold text-dark mb-6">Reseñas ({product.review_count || 0})</h2>

          {token && (
            <form onSubmit={handleReviewSubmit} className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
              <h3 className="font-semibold text-dark mb-4">Dejar una reseña</h3>
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} type="button" onClick={() => setReviewRating(s)} className={`text-2xl transition-transform hover:scale-110 ${s <= reviewRating ? 'text-gold' : 'text-gray-300'}`}>★</button>
                ))}
              </div>
              <input
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 mb-3 focus:outline-none focus:border-gold"
                placeholder="Título"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                maxLength={100}
              />
              <textarea
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 mb-3 h-24 resize-none focus:outline-none focus:border-gold"
                placeholder="Cuéntanos tu experiencia..."
                value={reviewBody}
                onChange={(e) => setReviewBody(e.target.value)}
                maxLength={1000}
              />
              <button type="submit" disabled={reviewSubmitting} className="bg-gold hover:bg-gold/90 text-dark font-bold px-6 py-2.5 rounded-lg transition-all disabled:opacity-60">
                {reviewSubmitting ? 'Publicando...' : 'Publicar reseña'}
              </button>
              {reviewMsg && <p className="mt-2 text-sm text-green-600">{reviewMsg}</p>}
            </form>
          )}

          {product.reviews?.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Aún no hay reseñas. ¡Sé el primero!</p>
          ) : (
            <div className="space-y-5">
              {product.reviews?.map((r) => (
                <div key={r.id} className="bg-white rounded-xl border border-gray-100 p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-dark">{r.user.first_name} {r.user.last_name[0]}.</p>
                      <StarRating rating={r.rating} />
                    </div>
                    <p className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString('es-CO')}</p>
                  </div>
                  {r.title && <p className="font-medium text-dark mt-2">{r.title}</p>}
                  {r.body && <p className="text-gray-600 text-sm mt-1">{r.body}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
