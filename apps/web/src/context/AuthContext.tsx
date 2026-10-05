import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User { id: string; email: string; firstName: string; role: string; }
interface AuthCtx {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: Record<string, string>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthCtx>(null!);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('esz_token'));
  const [user, setUser]   = useState<User | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setUser({ id: data.id, email: data.email, firstName: data.first_name, role: data.role }))
      .catch(() => { setToken(null); localStorage.removeItem('esz_token'); });
  }, [token]);

  async function login(email: string, password: string) {
    const r = await fetch('/api/auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error);
    localStorage.setItem('esz_token', data.token);
    setToken(data.token);
  }

  async function register(body: Record<string, string>) {
    const r = await fetch('/api/auth/register', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error);
    localStorage.setItem('esz_token', data.token);
    setToken(data.token);
  }

  function logout() {
    setToken(null); setUser(null);
    localStorage.removeItem('esz_token');
  }

  return <AuthContext.Provider value={{ user, token, login, register, logout }}>{children}</AuthContext.Provider>;
}
