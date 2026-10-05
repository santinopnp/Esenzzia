import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface DashData {
  orders: { status: string; count: string }[];
  monthlyRevenue: string;
  totalCustomers: string;
  lowStockAlerts: { sku: string; stock: number; name: string }[];
}

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [data, setData]   = useState<DashData | null>(null);
  const [orders, setOrders] = useState([]);
  const fmt = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format;

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (!['admin', 'staff'].includes(user.role)) { navigate('/'); return; }
    Promise.all([
      fetch('/api/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch('/api/admin/orders?limit=10', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ]).then(([d, o]) => { setData(d); setOrders(o); }).catch(() => {});
  }, [user]);

  if (!data) return <div className="p-8 text-center"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" /></div>;

  const totalOrders = data.orders.reduce((s, o) => s + parseInt(o.count), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-serif text-3xl font-bold mb-8">Panel de Administracion</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Ingresos (30 dias)', value: fmt(Number(data.monthlyRevenue) || 0), icon: '💰' },
          { label: 'Total pedidos', value: totalOrders, icon: '📦' },
          { label: 'Clientes', value: data.totalCustomers, icon: '👥' },
          { label: 'Stock bajo', value: data.lowStockAlerts.length, icon: '⚠️', warn: data.lowStockAlerts.length > 0 },
        ].map(stat => (
          <div key={stat.label} className={`card p-5 ${stat.warn ? 'border-l-4 border-yellow-400' : ''}`}>
            <div className="text-2xl mb-2">{stat.icon}</div>
            <p className="text-2xl font-bold font-serif">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {data.lowStockAlerts.length > 0 && (
        <div className="card p-5 mb-6 border-l-4 border-yellow-400">
          <h2 className="font-semibold mb-3 text-sm uppercase tracking-wider">Alertas de Stock</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {data.lowStockAlerts.map(a => (
              <div key={a.sku} className="text-xs bg-yellow-50 rounded p-2">
                <p className="font-semibold truncate">{a.name}</p>
                <p className="text-yellow-700">{a.sku}: {a.stock} unidades</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-serif font-semibold text-lg">Ultimos pedidos</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream text-xs uppercase tracking-wider">
              <tr>
                {['Pedido','Cliente','Total','Estado','Fecha'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-gray-500 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((o: any) => (
                <tr key={o.id} className="hover:bg-cream">
                  <td className="px-4 py-3 font-mono text-xs">{o.order_number}</td>
                  <td className="px-4 py-3">{o.first_name} {o.last_name} <span className="text-gray-400 text-xs">{o.user_email}</span></td>
                  <td className="px-4 py-3 font-bold text-gold">{fmt(o.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      o.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      o.status === 'pending'   ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>{o.status}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{new Date(o.created_at).toLocaleDateString('es-CO')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
