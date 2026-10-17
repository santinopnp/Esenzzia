import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/brand/Logo';

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
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" aria-label="Esenzzia, inicio" className="inline-flex"><Logo variant="vertical" size={80} tagline={false} /></Link>
          <p className="text-ink-muted mt-2">{mode === 'login' ? 'Inicia sesión en tu cuenta' : 'Crea tu cuenta'}</p>
        </div>
        <div className="card p-8">
          <div className="flex gap-1 mb-6 bg-surface-alt rounded-md p-1">
            {(['login', 'register'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2 text-sm font-medium rounded-sm transition-colors ${
                  mode === m ? 'bg-surface ring-1 ring-line text-ink' : 'text-ink-soft'
                }`}>
                {m === 'login' ? 'Ingresar' : 'Registrarme'}
              </button>
            ))}
          </div>
          <form onSubmit={submit} className="space-y-4">
            {mode === 'register' && (
              <div className="grid grid-cols-2 gap-3">
                <label className="block"><span className="field-label">Nombre</span><input className="input" value={form.firstName} onChange={set('firstName')} required /></label>
                <label className="block"><span className="field-label">Apellido</span><input className="input" value={form.lastName} onChange={set('lastName')} /></label>
              </div>
            )}
            <label className="block"><span className="field-label">Correo electrónico</span><input type="email" className="input" placeholder="tu@correo.com" autoComplete="email" value={form.email} onChange={set('email')} required /></label>
            <label className="block"><span className="field-label">Contraseña</span><input type="password" className="input" placeholder="Mínimo 8 caracteres" autoComplete="current-password" value={form.password} onChange={set('password')} required minLength={8} /></label>
            {error && <p role="alert" className="text-danger text-body-sm font-medium"><span aria-hidden>! </span>{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Cargando…' : mode === 'login' ? 'Ingresar' : 'Crear cuenta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
