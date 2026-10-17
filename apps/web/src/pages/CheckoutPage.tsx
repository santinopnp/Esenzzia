import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Isotipo } from '../components/brand/Logo';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';


interface AddressForm {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

const FREE_SHIPPING_THRESHOLD = 150000;
const SHIPPING_COST = 8000;

const STEPS = ['Carrito', 'Dirección', 'Pago', 'Confirmación'];

const CART_SESSION_KEY = 'esz_cart_session';
function getCartSession() {
  let s = localStorage.getItem(CART_SESSION_KEY);
  if (!s) { s = crypto.randomUUID(); localStorage.setItem(CART_SESSION_KEY, s); }
  return s;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, refresh: refreshCart } = useCart();
  const { token } = useAuth();

  const [step, setStep] = useState(1);
  const [loadingCart, setLoadingCart] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const [address, setAddress] = useState<AddressForm>({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Colombia',
  });

  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'wompi'>('wompi');
  const [placing, setPlacing] = useState(false);
  const [orderResult, setOrderResult] = useState<{ orderId: string; orderNumber: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Card form for Stripe (simplified; real app would use Stripe Elements)
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const cartItems = cart.items;
  const subtotal = cart.subtotal;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST;
  const discountAmount = Math.round((subtotal * couponDiscount) / 100);
  const total = subtotal - discountAmount + shipping;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    setCouponMsg('');
    try {
      const res = await fetch(`${API}/orders/validate-coupon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ code: couponCode }),
      });
      const data = await res.json();
      if (res.ok) {
        setCouponDiscount(data.discount_percent || 0);
        setCouponMsg(`Cupón aplicado: ${data.discount_percent}% de descuento`);
      } else {
        setCouponMsg(data.error || 'Cupón inválido');
        setCouponDiscount(0);
      }
    } catch {
      setCouponMsg('Error al validar cupón');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const validateAddress = () => {
    const required: (keyof AddressForm)[] = ['full_name', 'phone', 'address_line1', 'city', 'state', 'country'];
    return required.every((f) => address[f].trim().length > 0);
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setErrorMsg('');
    try {
      // 1. Create order
      const orderRes = await fetch(`${API}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-cart-session': getCartSession(),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          shipping_address: address,
          coupon_code: couponCode || undefined,
          payment_method: paymentMethod,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || 'Error al crear la orden');

      // 2. Process payment
      if (paymentMethod === 'stripe') {
        const payRes = await fetch(`${API}/payment/stripe/intent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ order_id: orderData.id }),
        });
        const payData = await payRes.json();
        if (!payRes.ok) throw new Error(payData.error || 'Error en el pago');
        // In production: confirm with Stripe.js
      } else {
        // Wompi: redirect to payment link or show Wompi widget
        const payRes = await fetch(`${API}/payment/wompi/transaction`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ order_id: orderData.id }),
        });
        const payData = await payRes.json();
        if (!payRes.ok) throw new Error(payData.error || 'Error en el pago');
        if (payData.redirect_url) {
          window.location.href = payData.redirect_url;
          return;
        }
      }

      setOrderResult({ orderId: orderData.id, orderNumber: orderData.order_number });
      localStorage.removeItem(CART_SESSION_KEY);
      refreshCart();
      setStep(3);
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Ocurrió un error');
    } finally {
      setPlacing(false);
    }
  };

  if (loadingCart || !cart) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Step indicator */}
        <div className="flex items-center justify-center mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${ i <= step ? 'bg-action text-action-on' : 'bg-line text-ink-muted' }`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`ml-2 text-sm font-medium hidden sm:inline ${ i <= step ? 'text-ink' : 'text-ink-muted' }`}>{s}</span>
              {i < STEPS.length - 1 && <div className={`w-8 sm:w-16 h-0.5 mx-2 transition-colors ${ i < step ? 'bg-action' : 'bg-line' }`} />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left / Main */}
          <div className="lg:col-span-2">
            {/* Step 0: Cart review */}
            {step === 0 && (
              <div className="bg-surface rounded-2xl border border-line p-6">
                <h2 className="text-xl font-medium text-ink mb-5">Tu carrito</h2>
                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-ink-muted mb-4">Tu carrito está vacío</p>
                    <button onClick={() => navigate('/tienda')} className="text-accent underline">Ir a la tienda</button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {cartItems.map((item) => (
                        <div key={item.variantId} className="flex items-center gap-4 py-4 border-b border-line last:border-0">
                          <div className="w-16 h-16 bg-surface-alt rounded-lg flex-shrink-0 overflow-hidden">
                            {item.image
                              ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center text-accent text-xs font-medium text-center p-1 leading-tight">{item.name.slice(0, 6)}</div>
                            }
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-ink text-sm">{item.name}</p>
                            <p className="text-accent text-xs">{item.slug}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-ink">${(item.price * item.quantity).toLocaleString('es-CO')}</p>
                            <p className="text-xs text-ink-muted">x{item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Coupon */}
                    <div className="flex gap-2 mb-4">
                      <input
                        className="flex-1 border border-line rounded-lg px-3 py-2 text-sm focus:border-accent"
                        placeholder="Cupón de descuento"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      />
                      <button onClick={handleApplyCoupon} disabled={applyingCoupon} className="bg-action text-action-on font-medium px-4 py-2 rounded-lg text-sm hover:bg-action-hover disabled:opacity-60">
                        {applyingCoupon ? '...' : 'Aplicar'}
                      </button>
                    </div>
                    {couponMsg && <p className={`text-sm mb-3 ${couponDiscount > 0 ? 'text-green-600' : 'text-danger'}`}>{couponMsg}</p>}

                    <button onClick={() => setStep(1)} className="w-full bg-action hover:bg-action-hover text-action-on font-medium py-3 rounded-xl transition-all">
                      Continuar con la dirección →
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Step 1: Address */}
            {step === 1 && (
              <div className="bg-surface rounded-2xl border border-line p-6">
                <h2 className="text-xl font-medium text-ink mb-5">Dirección de envío</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {([
                    { name: 'full_name', label: 'Nombre completo', span: 2 },
                    { name: 'phone', label: 'Teléfono / Celular', span: 1 },
                    { name: 'address_line1', label: 'Dirección', span: 2, placeholder: 'Calle 123 # 45-67' },
                    { name: 'address_line2', label: 'Apartamento / Oficina (opcional)', span: 2 },
                    { name: 'city', label: 'Ciudad', span: 1 },
                    { name: 'state', label: 'Departamento', span: 1 },
                    { name: 'postal_code', label: 'Código postal', span: 1 },
                    { name: 'country', label: 'País', span: 1 },
                  ] as Array<{ name: keyof AddressForm; label: string; span: number; placeholder?: string }>).map((field) => (
                    <div key={field.name} className={field.span === 2 ? 'sm:col-span-2' : ''}>
                      <label className="block text-sm font-medium text-ink-soft mb-1">{field.label}</label>
                      <input
                        className="w-full border border-line rounded-lg px-3 py-2.5 text-sm focus:border-accent"
                        placeholder={field.placeholder || field.label}
                        value={address[field.name]}
                        onChange={(e) => setAddress({ ...address, [field.name]: e.target.value })}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(0)} className="flex-1 border-2 border-line text-ink-soft font-medium py-3 rounded-xl hover:border-accent transition-all">
                    ← Carrito
                  </button>
                  <button
                    onClick={() => { if (validateAddress()) setStep(2); }}
                    disabled={!validateAddress()}
                    className="flex-2 flex-1 bg-action hover:bg-action-hover disabled:bg-line text-action-on font-medium py-3 rounded-xl transition-all"
                  >
                    Continuar al pago →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="bg-surface rounded-2xl border border-line p-6">
                <h2 className="text-xl font-medium text-ink mb-5">Método de pago</h2>

                <div className="grid sm:grid-cols-2 gap-3 mb-6">
                  {([
                    { id: 'wompi', label: 'Wompi', sub: 'PSE, tarjeta, efectivo (Colombia)', flag: 'CO' },
                    { id: 'stripe', label: 'Stripe', sub: 'Tarjeta internacional (Visa, MC)', flag: 'INT' },
                  ] as const).map((pm) => (
                    <button
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`text-left p-4 rounded-xl border-2 transition-all ${ paymentMethod === pm.id ? 'border-accent bg-surface-alt' : 'border-line hover:border-accent' }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="badge-neutral">{pm.flag}</span>
                        <span className="font-medium text-ink">{pm.label}</span>
                        {paymentMethod === pm.id && <span className="ml-auto text-accent">✓</span>}
                      </div>
                      <p className="text-xs text-ink-muted">{pm.sub}</p>
                    </button>
                  ))}
                </div>

                {paymentMethod === 'stripe' && (
                  <div className="space-y-3 p-4 bg-surface-alt rounded-xl mb-5">
                    <p className="text-sm text-ink-muted mb-3">Datos de tarjeta (encriptados por Stripe)</p>
                    <input
                      className="w-full border border-line rounded-lg px-3 py-2.5 text-sm focus:border-accent bg-surface"
                      placeholder="Número de tarjeta"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                      maxLength={16}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        className="border border-line rounded-lg px-3 py-2.5 text-sm focus:border-accent bg-surface"
                        placeholder="MM/AA"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        maxLength={5}
                      />
                      <input
                        className="border border-line rounded-lg px-3 py-2.5 text-sm focus:border-accent bg-surface"
                        placeholder="CVV"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        maxLength={4}
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'wompi' && (
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl mb-5 text-sm text-blue-700">
                    Al confirmar serás redirigido a la plataforma de Wompi para completar tu pago de forma segura.
                  </div>
                )}

                {errorMsg && (
                  <div className="p-3 bg-surface-alt border border-danger rounded-xl mb-4 text-sm text-danger">
                    {errorMsg}
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 border-2 border-line text-ink-soft font-medium py-3 rounded-xl hover:border-accent transition-all">
                    ← Dirección
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={placing}
                    className="flex-1 bg-action hover:bg-action-hover disabled:bg-line text-action-on font-medium py-3 rounded-xl transition-all"
                  >
                    {placing ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" /></svg>
                        Procesando...
                      </span>
                    ) : `Confirmar • $${total.toLocaleString('es-CO')} COP`}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && orderResult && (
              <div className="bg-surface rounded-2xl border border-line p-10 text-center">
                <div className="flex justify-center mb-6"><Isotipo size={64} /></div>
                <h2 className="text-2xl font-medium text-ink mb-2">Pedido confirmado</h2>
                <p className="text-ink-muted mb-2">Orden <span className="font-medium text-ink">#{orderResult.orderNumber}</span></p>
                <p className="text-ink-muted mb-8">Recibirás un correo con los detalles de tu pedido.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button onClick={() => navigate('/')} className="bg-action text-action-on font-medium px-8 py-3 rounded-xl hover:bg-action-hover transition-all">
                    Volver al inicio
                  </button>
                  <button onClick={() => navigate('/cuenta')} className="border-2 border-accent text-accent font-medium px-8 py-3 rounded-xl hover:bg-action hover:text-action-on transition-all">
                    Mis pedidos
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Order summary */}
          {step < 3 && (
            <div className="lg:col-span-1">
              <div className="bg-surface rounded-2xl border border-line p-5 sticky top-24">
                <h3 className="font-medium text-ink mb-4">Resumen del pedido</h3>
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item.variantId} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-surface-alt rounded-lg flex-shrink-0 overflow-hidden">
                        {item.image
                          ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-accent text-xs font-medium text-center p-0.5 leading-tight">{item.name.slice(0,3)}</div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-ink truncate">{item.name}</p>
                        <p className="text-xs text-ink-muted">{}{item.quantity}</p>
                      </div>
                      <p className="text-xs font-medium text-ink flex-shrink-0">${(item.price * item.quantity).toLocaleString('es-CO')}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-line pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-ink-soft">
                    <span>Subtotal</span>
                    <span>${subtotal.toLocaleString('es-CO')}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento ({couponDiscount}%)</span>
                      <span>-${discountAmount.toLocaleString('es-CO')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-ink-soft">
                    <span>Envío</span>
                    <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                      {shipping === 0 ? 'GRATIS' : `$${shipping.toLocaleString('es-CO')}`}
                    </span>
                  </div>
                  {subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD && (
                    <p className="text-xs text-accent">
                      Agrega ${(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString('es-CO')} más para envío gratis
                    </p>
                  )}
                  <div className="flex justify-between font-medium text-base text-ink border-t border-line pt-2 mt-2">
                    <span>Total</span>
                    <span>${total.toLocaleString('es-CO')} COP</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
