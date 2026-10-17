import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AccountPage() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const fmt = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format;

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetch('/api/orders/my', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setOrders).catch(() => {});
  }, [user]);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl font-medium mb-2">Mi cuenta</h1>
      <p className="text-ink-muted mb-8">Hola, {user.firstName}. Qué bueno tenerte de vuelta.</p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="card p-6">
          <h2 className="font-display font-medium text-lg mb-4">Perfil</h2>
          <div className="space-y-2 text-sm">
            <p><span className="text-ink-muted">Email:</span> {user.email}</p>
            <p><span className="text-ink-muted">Nombre:</span> {user.firstName}</p>
          </div>
          <button onClick={() => { logout(); navigate('/'); }} className="mt-6 text-sm text-danger hover:text-danger">Cerrar sesión</button>
        </div>
        <div className="lg:col-span-2">
          <h2 className="font-display font-medium text-lg mb-4">Mis pedidos</h2>
          {orders.length === 0 ? (
            <p className="text-ink-muted text-sm">Aún no tienes pedidos.</p>
          ) : (
            <div className="space-y-3">
              {orders.map((o: any) => (
                <div key={o.id} className="card p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{o.order_number}</p>
                    <p className="text-xs text-ink-muted">{new Date(o.created_at).toLocaleDateString('es-CO')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-accent">{fmt(o.total)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      o.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      o.status === 'cancelled' ? 'bg-surface-alt text-danger' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>{o.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
