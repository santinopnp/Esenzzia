import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Logo from './brand/Logo';

const NAV = [
  { label: 'Perfumes', to: '/shop' },
  { label: 'Destacados', to: '/shop?featured=true' },
  { label: 'Árabes', to: '/shop?category=arabicos' },
  { label: 'Nicho', to: '/shop?category=nicho' },
];

export default function Header() {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const current = pathname + search;
  const [mobileOpen, setMobileOpen] = useState(false);

  const itemCount = cart.items.reduce((s, i) => s + i.quantity, 0);
  const navLink = 'text-ink-soft hover:text-ink hover:underline decoration-accent-decor underline-offset-8';

  return (
    <header data-theme="noir" className="sticky top-0 z-50 border-b border-line">
      <div className="page h-header flex items-center justify-between gap-ez-6">
        <Link to="/" aria-label="Esenzzia, inicio" className="rounded-sm">
          <Logo size={40} className="hidden sm:inline-flex" />
          <Logo variant="isotipo" size={40} className="sm:hidden" />
        </Link>

        <nav aria-label="Principal" className="hidden md:flex items-center gap-ez-6 font-sans text-nav">
          {NAV.map(n => (
            <Link
              key={n.to} to={n.to}
              aria-current={current === n.to ? 'page' : undefined}
              className={`${navLink} ${current === n.to ? 'text-ink underline' : ''}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-ez-4 font-sans text-nav">
          {user ? (
            <div className="hidden sm:flex items-center gap-ez-4">
              <Link to="/account" className={navLink}>{user.firstName}</Link>
              <button onClick={() => { logout(); navigate('/'); }} className="text-body-sm text-ink-muted hover:text-ink">Salir</button>
            </div>
          ) : (
            <Link to="/login" className={`hidden sm:inline ${navLink}`}>Ingresar</Link>
          )}
          <Link to="/cart" className="btn-outline">Carrito ({itemCount})</Link>
          <button
            className="md:hidden btn-ghost"
            aria-expanded={mobileOpen}
            aria-controls="menu-movil"
            onClick={() => setMobileOpen(o => !o)}
          >
            Menú
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav id="menu-movil" aria-label="Principal" className="md:hidden border-t border-line page py-ez-4 flex flex-col gap-ez-4 font-sans text-nav">
          {NAV.map(n => (
            <Link key={n.to} to={n.to} onClick={() => setMobileOpen(false)} className="text-ink-soft hover:text-ink">{n.label}</Link>
          ))}
          {user ? (
            <Link to="/account" onClick={() => setMobileOpen(false)} className="text-ink-soft hover:text-ink">Mi cuenta</Link>
          ) : (
            <Link to="/login" onClick={() => setMobileOpen(false)} className="text-ink-soft hover:text-ink">Ingresar</Link>
          )}
        </nav>
      )}
    </header>
  );
}
