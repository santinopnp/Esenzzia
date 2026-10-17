import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Isotipo } from '../components/brand/Logo';

export default function CartPage() {
  const { cart, updateItem, refresh } = useCart();
  const navigate = useNavigate();
  const fmt = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format;

  useEffect(() => { refresh(); }, []);

  if (!cart.items.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="flex justify-center mb-6"><Isotipo size={64} /></div>
        <h2 className="font-display text-2xl font-medium mb-4">Tu carrito está vacío</h2>
        <p className="text-ink-muted mb-8">Descubre nuestro catálogo de fragancias</p>
        <Link to="/shop" className="btn-primary">Ver catálogo</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl font-medium mb-8">Carrito</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map(item => (
            <div key={item.variantId || item.productId} className="card p-4 flex gap-4">
              <div className="w-20 h-20 bg-surface-alt rounded flex-shrink-0 flex items-center justify-center text-3xl">
                {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" /> : <Isotipo size={40} />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="perfume-name text-perfume-sm truncate">{item.name}</h3>
                <p className="text-ink font-medium mt-1">{fmt(item.price)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => updateItem(item.productId, item.variantId, item.quantity - 1)}
                    className="w-8 h-8 border rounded flex items-center justify-center hover:border-accent">-</button>
                  <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateItem(item.productId, item.variantId, item.quantity + 1)}
                    className="w-8 h-8 border rounded flex items-center justify-center hover:border-accent">+</button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-sm">{fmt(item.lineTotal)}</p>
                <button onClick={() => updateItem(item.productId, item.variantId, 0)}
                  className="text-xs text-danger hover:text-danger mt-2">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
        <div className="card p-6 h-fit">
          <h2 className="font-display font-medium text-lg mb-4">Resumen</h2>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium">{fmt(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between text-ink-muted">
              <span>Envío</span>
              <span>{cart.subtotal >= 150000 ? 'Gratis' : fmt(12000)}</span>
            </div>
          </div>
          <div className="border-t pt-3 flex justify-between font-medium mb-6">
            <span>Total</span>
            <span className="text-accent">{fmt(cart.subtotal < 150000 ? cart.subtotal + 12000 : cart.subtotal)}</span>
          </div>
          <button onClick={() => navigate('/checkout')} className="btn-primary w-full">Proceder al pago</button>
          <Link to="/shop" className="block text-center text-sm text-ink-muted hover:text-accent mt-3">Seguir comprando</Link>
        </div>
      </div>
    </div>
  );
}
