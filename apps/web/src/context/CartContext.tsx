import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface CartItem {
  productId: string; variantId: string | null;
  name: string; slug: string; price: number;
  quantity: number; image: string | null; lineTotal: number; currency: string;
}
interface Cart { items: CartItem[]; subtotal: number; currency: string; }
interface CartCtx {
  cart: Cart; loading: boolean;
  addItem: (productId: string, variantId: string | null, qty?: number) => Promise<void>;
  updateItem: (productId: string, variantId: string | null, qty: number) => Promise<void>;
  refresh: () => Promise<void>;
}

const SESSION_KEY = 'esz_cart_session';
function getSession() {
  let s = localStorage.getItem(SESSION_KEY);
  if (!s) { s = crypto.randomUUID(); localStorage.setItem(SESSION_KEY, s); }
  return s;
}

const CartContext = createContext<CartCtx>(null!);
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart]     = useState<Cart>({ items: [], subtotal: 0, currency: 'COP' });
  const [loading, setLoading] = useState(false);

  const headers = () => ({
    'Content-Type': 'application/json',
    'x-cart-session': getSession(),
    ...(localStorage.getItem('esz_token') ? { Authorization: `Bearer ${localStorage.getItem('esz_token')}` } : {}),
  });

  const refresh = useCallback(async () => {
    const r = await fetch('/api/cart', { headers: headers() });
    if (r.ok) setCart(await r.json());
  }, []);

  const addItem = useCallback(async (productId: string, variantId: string | null, qty = 1) => {
    setLoading(true);
    try {
      const r = await fetch('/api/cart/items', {
        method: 'POST', headers: headers(),
        body: JSON.stringify({ productId, variantId, quantity: qty }),
      });
      if (r.ok) setCart(await r.json());
    } finally { setLoading(false); }
  }, []);

  const updateItem = useCallback(async (productId: string, variantId: string | null, quantity: number) => {
    const r = await fetch('/api/cart/items', {
      method: 'PUT', headers: headers(),
      body: JSON.stringify({ productId, variantId, quantity }),
    });
    if (r.ok) setCart(await r.json());
  }, []);

  return (
    <CartContext.Provider value={{ cart, loading, addItem, updateItem, refresh }}>
      {children}
    </CartContext.Provider>
  );
}
