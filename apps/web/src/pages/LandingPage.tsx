import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Logo from '../components/brand/Logo';

const VALUES = [
  { eyebrow: 'Originales', title: 'Autenticidad garantizada', desc: 'Todas nuestras fragancias son originales, importadas directamente.' },
  { eyebrow: 'Asesoría', title: 'Valentina, a toda hora', desc: 'Nuestra asesora te ayuda a elegir tu perfume en cualquier momento.' },
  { eyebrow: 'Envíos', title: 'A tu puerta', desc: 'Despacho en 24 horas. Llega en 2 a 5 días hábiles en Colombia.' },
];

export default function LandingPage() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetch('/api/products/featured?limit=8')
      .then(r => r.json())
      .then(setFeatured)
      .catch(() => {});
  }, []);

  const openChat = () => document.querySelector<HTMLButtonElement>('[aria-label="Chat con Valentina"]')?.click();

  return (
    <div>
      {/* Portada: composición centrada, como la etiqueta frontal */}
      <section data-theme="noir" className="border-b border-line">
        <div className="page min-h-[78vh] flex flex-col items-center justify-center text-center py-ez-8">
          <h1 className="sr-only">Esenzzia, perfumes y esencias</h1>
          <Logo variant="vertical" size={112} />
          <p className="mt-ez-6 max-w-xl text-body text-ink-soft sm:text-[15px]">
            Perfumes de autor y esencias que acompañan tu día. Valentina, nuestra asesora, te ayuda a encontrar el tuyo.
          </p>
          <div className="mt-ez-6 flex flex-wrap justify-center gap-ez-3">
            <Link to="/shop" className="btn-primary">Explorar el catálogo</Link>
            <button onClick={openChat} className="btn-outline">Hablar con Valentina</button>
          </div>
          <dl className="mt-ez-7 grid grid-cols-3 gap-ez-6 sm:gap-ez-8">
            {[['33+', 'Fragancias'], ['2 a 5', 'Días de envío'], ['100 %', 'Originales']].map(([n, l]) => (
              <div key={l} className="flex flex-col items-center gap-ez-1">
                <dt className="order-2 legal">{l}</dt>
                <dd className="order-1 font-display text-perfume text-accent">{n}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Destacados */}
      <section className="page py-ez-7">
        <div className="flex items-end justify-between mb-ez-6 gap-ez-4">
          <div>
            <p className="eyebrow mb-ez-2">Selección de la casa</p>
            <h2 className="text-[34px] leading-tight">Destacados</h2>
          </div>
          <Link to="/shop" className="btn-ghost">Ver todo</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-ez-4 sm:gap-ez-6">
          {featured.length > 0
            ? featured.map((p: any) => <ProductCard key={p.id} product={p} />)
            : [...Array(8)].map((_, i) => (
                <div key={i} className="card overflow-hidden" aria-hidden>
                  <div className="aspect-[4/3] bg-surface-alt animate-pulse" />
                  <div className="p-ez-5 space-y-ez-2">
                    <div className="h-3 bg-line rounded-sm animate-pulse w-1/2" />
                    <div className="h-5 bg-line rounded-sm animate-pulse" />
                    <div className="h-4 bg-line rounded-sm animate-pulse w-1/3" />
                  </div>
                </div>
              ))}
        </div>
      </section>

      {/* Propuesta de valor */}
      <section className="bg-surface-alt border-y border-line">
        <div className="page py-ez-7 grid grid-cols-1 sm:grid-cols-3 gap-ez-6">
          {VALUES.map(v => (
            <div key={v.title}>
              <p className="eyebrow mb-ez-2">{v.eyebrow}</p>
              <h3 className="text-perfume-sm mb-ez-2">{v.title}</h3>
              <p className="text-body text-ink-soft">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
