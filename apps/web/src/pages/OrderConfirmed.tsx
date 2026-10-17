import { useSearchParams, Link } from 'react-router-dom';
import { Isotipo, Filete } from '../components/brand/Logo';

export default function OrderConfirmed() {
  const [params] = useSearchParams();
  const orderNumber = params.get('order');

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
      <div className="flex justify-center mb-6"><Isotipo size={72} /></div>
      <h1 className="font-display text-4xl font-medium mb-4">Pedido confirmado</h1>
      <div className="mb-6"><Filete>Esencias que perduran</Filete></div>
      {orderNumber && (
        <p className="text-ink-muted mb-2">Número de orden: <strong className="text-ink">{orderNumber}</strong></p>
      )}
      <p className="text-ink-muted mb-8">Recibirás un correo con los detalles de tu pedido. Tu fragancia llegará en 2 a 5 días hábiles.</p>
      <Link to="/shop" className="btn-primary">Seguir comprando</Link>
    </div>
  );
}
