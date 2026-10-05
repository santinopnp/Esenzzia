import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

export default function LandingPage() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetch('/api/products/featured?limit=8')
      .then(r => r.json())
      .then(setFeatured)
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero — full-screen on mobile */}
      <section
        className="relative bg-dark text-white overflow-hidden"
        style={{ minHeight: '100svh' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark-muted to-black opacity-90" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 flex flex-col justify-end md:justify-center pb-28 md:pb-0 h-[100svh] md:min-h-[80vh] md:h-auto py-0 md:py-20">
          <p className="text-gold font-semibold text-xs uppercase tracking-[0.3em] mb-3 md:mb-4">
            Perfumes Premium Colombia
          </p>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold leading-tight mb-4 md:mb-6 max-w-2xl">
            Tu fragancia perfecta, descubierta
          </h1>
          <p className="text-gray-300 text-sm md:text-lg max-w-xl mb-8 md:mb-10 leading-relaxed">
            Valentina, nuestra asesora IA, te ayuda a encontrar el perfume ideal. Catálogo curado con las mejores marcas.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link to="/shop" className="btn-primary text-sm md:text-base px-6 md:px-8 py-4 text-center">
              Explorar catálogo
            </Link>
            <button
              onClick={() => document.querySelector<HTMLButtonElement>('[aria-label="Chat con Valentina"]')?.click()}
              className="btn-outline text-sm md:text-base px-6 md:px-8 py-4 border-gold-light text-gold-light"
            >
              Hablar con Valentina
            </button>
          </div>
          <div className="flex gap-8 md:gap-12 mt-10 md:mt-16 text-xs md:text-sm">
            <div><p className="text-xl md:text-2xl font-serif font-bold text-gold">33+</p><p className="text-gray-400">Fragancias</p></div>
            <div><p className="text-xl md:text-2xl font-serif font-bold text-gold">2-5</p><p className="text-gray-400">Días de envío</p></div>
            <div><p className="text-xl md:text-2xl font-serif font-bold text-gold">100%</p><p className="text-gray-400">Autenticidad</p></div>
          </div>
        </div>

        {/* scroll hint on mobile */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 md:hidden flex flex-col items-center gap-1 animate-bounce opacity-60">
          <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Featured — horizontal scroll on mobile, grid on desktop */}
      <section className="py-10 md:py-16">
        <div className="flex items-center justify-between mb-5 md:mb-8 px-5 sm:px-6 max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif font-bold">Destacados</h2>
          <Link to="/shop" className="text-gold text-sm font-semibold hover:underline">Ver todo</Link>
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="md:hidden">
          {featured.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-5 pb-2 hide-scrollbar">
              {featured.map((p: any) => (
                <div key={p.id} className="snap-start shrink-0 w-44">
                  <ProductCard product={p} compact />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto px-5 pb-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="shrink-0 w-44 card">
                  <div className="aspect-square bg-cream-warm animate-pulse" />
                  <div className="p-3 space-y-2">
                    <div className="h-2 bg-gray-200 rounded animate-pulse w-1/2" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop: grid */}
        <div className="hidden md:block max-w-7xl mx-auto px-6">
          {featured.length > 0 ? (
            <div className="grid grid-cols-3 lg:grid-cols-4 gap-6">
              {featured.map((p: any) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="grid grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card">
                  <div className="aspect-square bg-cream-warm animate-pulse" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories quick access — mobile only */}
      <section className="md:hidden px-5 pb-8">
        <h3 className="text-lg font-serif font-semibold mb-4">Explorar por categoría</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Hombre', slug: 'hombre', emoji: '👔' },
            { label: 'Mujer', slug: 'mujer', emoji: '💐' },
            { label: 'Unisex', slug: 'unisex', emoji: '✨' },
            { label: 'Árabes', slug: 'arabicos', emoji: '🕌' },
          ].map(cat => (
            <Link
              key={cat.slug}
              to={`/shop?category=${cat.slug}`}
              className="flex items-center gap-3 bg-cream-warm rounded-lg px-4 py-3 active:bg-cream transition-colors"
            >
              <span className="text-2xl">{cat.emoji}</span>
              <span className="font-medium text-sm text-dark">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Value props */}
      <section className="bg-cream-warm py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 text-center">
          {[
            { icon: '🌿', title: 'Autenticidad garantizada', desc: 'Todos nuestros perfumes son 100% originales, importados directamente.' },
            { icon: '🤖', title: 'Asesoría IA 24/7', desc: 'Valentina te ayuda a elegir la fragancia perfecta en cualquier momento.' },
            { icon: '🚀', title: 'Envío rápido', desc: 'Despacho en 24h. Llega en 2-5 días hábiles en Colombia.' },
          ].map(v => (
            <div key={v.title} className="p-4 md:p-6">
              <div className="text-3xl md:text-4xl mb-3">{v.icon}</div>
              <h3 className="font-serif font-semibold text-base md:text-lg mb-2">{v.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
