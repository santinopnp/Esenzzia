import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') await login(form.email, form.password);
      else await register(form);
      navigate('/account');
    } catch (err: any) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="font-serif text-3xl font-bold text-dark">Esenzzia</Link>
          <p className="text-gray-500 mt-2">{mode === 'login' ? 'Inicia sesion en tu cuenta' : 'Crea tu cuenta'}</p>
        </div>
        <div className="card p-8">
          <div className="flex gap-1 mb-6 bg-cream rounded-sm p-1">
            {(['login', 'register'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2 text-sm font-semibold rounded-sm transition-colors ${
                  mode === m ? 'bg-white shadow-sm text-dark' : 'text-gray-500'
                }`}>
                {m === 'login' ? 'Ingresar' : 'Registrarme'}
              </button>
            ))}
          </div>
          <form onSubmit={submit} className="space-y-4">
            {mode === 'register' && (
              <div className="grid grid-cols-2 gap-3">
                <input className="input" placeholder="Nombre" value={form.firstName} onChange={set('firstName')} required />
                <input className="input" placeholder="Apellido" value={form.lastName} onChange={set('lastName')} />
              </div>
            )}
            <input type="email" className="input" placeholder="Correo electronico" value={form.email} onChange={set('email')} required />
            <input type="password" className="input" placeholder="Contrasena" value={form.password} onChange={set('password')} required minLength={8} />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Cargando...' : mode === 'login' ? 'Ingresar' : 'Crear cuenta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
