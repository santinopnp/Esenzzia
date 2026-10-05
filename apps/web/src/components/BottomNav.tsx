import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function BottomNav() {
  const { cart } = useCart();
  const { user } = useAuth();
  const { pathname } = useLocation();
  const itemCount = cart.items.reduce((s, i) => s + i.quantity, 0);

  const active = (path: string) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path);

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-100 pb-safe">
      <div className="flex h-16">
        <Link
          to="/"
          className={`flex-1 flex flex-col items-center justify-center gap-1 text-[10px] transition-colors ${active('/') ? 'text-gold' : 'text-gray-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Inicio
        </Link>

        <Link
          to="/shop"
          className={`flex-1 flex flex-col items-center justify-center gap-1 text-[10px] transition-colors ${active('/shop') && pathname !== '/cart' ? 'text-gold' : 'text-gray-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Catálogo
        </Link>

        {/* Valentina center FAB */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <button
            onClick={() => document.querySelector<HTMLButtonElement>('[aria-label="Chat con Valentina"]')?.click()}
            className="w-12 h-12 -mt-6 bg-gold rounded-full flex items-center justify-center shadow-lg shadow-gold/40 active:scale-95 transition-transform"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
          <span className="text-[10px] text-gold font-medium mt-1">Valentina</span>
        </div>

        <Link
          to={user ? '/account' : '/login'}
          className={`flex-1 flex flex-col items-center justify-center gap-1 text-[10px] transition-colors ${active('/account') || active('/login') ? 'text-gold' : 'text-gray-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {user ? (user.firstName?.split(' ')[0] || 'Cuenta') : 'Ingresar'}
        </Link>

        <Link
          to="/cart"
          className={`flex-1 flex flex-col items-center justify-center gap-1 text-[10px] transition-colors ${active('/cart') ? 'text-gold' : 'text-gray-400'}`}
        >
          <div className="relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-gold text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </div>
          Carrito
        </Link>
      </div>
    </nav>
  );
}
