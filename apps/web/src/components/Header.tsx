import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const itemCount = cart.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-sm' : 'bg-white/95 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14 md:h-16">
        <Link to="/" className="font-serif text-xl md:text-2xl font-bold text-dark tracking-wide">
          Esenzzia
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/shop" className="text-sm font-medium hover:text-gold transition-colors">Catalogo</Link>
          <Link to="/shop?featured=true" className="text-sm font-medium hover:text-gold transition-colors">Destacados</Link>
          <Link to="/shop?category=arabicos" className="text-sm font-medium hover:text-gold transition-colors">Arabicos</Link>
          <Link to="/shop?category=nicho" className="text-sm font-medium hover:text-gold transition-colors">Nicho</Link>
        </nav>

        <div className="flex items-center gap-3">
          {/* Desktop user controls */}
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/account" className="text-sm text-gray-600 hover:text-gold">{user.firstName}</Link>
              <button onClick={() => { logout(); navigate('/'); }} className="text-xs text-gray-400 hover:text-red-500">Salir</button>
            </div>
          ) : (
            <Link to="/login" className="hidden md:block text-sm font-medium hover:text-gold transition-colors">Ingresar</Link>
          )}

          {/* Desktop cart */}
          <Link to="/cart" className="relative hidden md:block p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Mobile: search shortcut */}
          <Link to="/shop" className="md:hidden flex items-center justify-center w-9 h-9">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
