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
      <h1 className="font-serif text-3xl font-bold mb-2">Mi cuenta</h1>
      <p className="text-gray-500 mb-8">Hola, {user.firstName}! Bienvenid@ de vuelta.</p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="card p-6">
          <h2 className="font-serif font-semibold text-lg mb-4">Perfil</h2>
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-500">Email:</span> {user.email}</p>
            <p><span className="text-gray-500">Nombre:</span> {user.firstName}</p>
          </div>
          <button onClick={() => { logout(); navigate('/'); }} className="mt-6 text-sm text-red-400 hover:text-red-600">Cerrar sesion</button>
        </div>
        <div className="lg:col-span-2">
          <h2 className="font-serif font-semibold text-lg mb-4">Mis pedidos</h2>
          {orders.length === 0 ? (
            <p className="text-gray-500 text-sm">No tienes pedidos aun.</p>
          ) : (
            <div className="space-y-3">
              {orders.map((o: any) => (
                <div key={o.id} className="card p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">{o.order_number}</p>
                    <p className="text-xs text-gray-500">{new Date(o.created_at).toLocaleDateString('es-CO')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gold">{fmt(o.total)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      o.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      o.status === 'cancelled' ? 'bg-red-100 text-red-700' :
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
