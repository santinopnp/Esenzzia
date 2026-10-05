import { useSearchParams, Link } from 'react-router-dom';

export default function OrderConfirmed() {
  const [params] = useSearchParams();
  const orderNumber = params.get('order');

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
      <div className="text-6xl mb-6">🎉</div>
      <h1 className="font-serif text-3xl font-bold mb-4">Pedido confirmado</h1>
      {orderNumber && (
        <p className="text-gray-500 mb-2">Numero de orden: <strong className="text-dark">{orderNumber}</strong></p>
      )}
      <p className="text-gray-500 mb-8">Recibiras un correo con los detalles de tu pedido. Tu fragancia llegara en 2-5 dias habiles.</p>
      <Link to="/shop" className="btn-primary">Seguir comprando</Link>
    </div>
  );
}
