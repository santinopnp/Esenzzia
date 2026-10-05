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
      {/* Hero */}
      <section className="relative bg-dark text-white overflow-hidden" style={{ minHeight: '80vh' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark-muted to-black opacity-90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 flex flex-col justify-center min-h-[80vh] py-20">
          <p className="text-gold font-semibold text-sm uppercase tracking-[0.3em] mb-4">Perfumes Premium Colombia</p>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold leading-tight mb-6 max-w-2xl">
            Tu fragancia perfecta, descubierta
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mb-10 leading-relaxed">
            Valentina, nuestra asesora IA, te ayuda a encontrar el perfume ideal para cada momento. Catalogo curado con las mejores marcas.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/shop" className="btn-primary text-base px-8 py-4">Explorar catalogo</Link>
            <button
              onClick={() => document.querySelector<HTMLButtonElement>('[aria-label="Chat con Valentina"]')?.click()}
              className="btn-outline text-base px-8 py-4 border-gold-light text-gold-light"
            >
              Hablar con Valentina
            </button>
          </div>
          <div className="flex gap-12 mt-16 text-sm">
            <div><p className="text-2xl font-serif font-bold text-gold">33+</p><p className="text-gray-400">Fragancias</p></div>
            <div><p className="text-2xl font-serif font-bold text-gold">2-5</p><p className="text-gray-400">Dias de envio</p></div>
            <div><p className="text-2xl font-serif font-bold text-gold">100%</p><p className="text-gray-400">Autenticidad</p></div>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-serif font-bold">Destacados</h2>
          <Link to="/shop" className="text-gold text-sm font-semibold hover:underline">Ver todo</Link>
        </div>
        {featured.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featured.map((p: any) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
      </section>

      {/* Value props */}
      <section className="bg-cream-warm py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { icon: '🌿', title: 'Autenticidad garantizada', desc: 'Todos nuestros perfumes son 100% originales, importados directamente.' },
            { icon: '🤖', title: 'Asesoria IA 24/7', desc: 'Valentina te ayuda a elegir la fragancia perfecta en cualquier momento.' },
            { icon: '🚀', title: 'Envio rapido', desc: 'Despacho en 24h. Llega a tu puerta en 2-5 dias habiles en Colombia.' },
          ].map(v => (
            <div key={v.title} className="p-6">
              <div className="text-4xl mb-4">{v.icon}</div>
              <h3 className="font-serif font-semibold text-lg mb-2">{v.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
