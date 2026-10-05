const router = require('express').Router();
const { createOrder, getOrder, getUserOrders } = require('../services/orderService');
const { requireAuth, optionalAuth } = require('../middleware/auth');

router.post('/', optionalAuth, async (req, res, next) => {
  try {
    const { cartItems, shippingAddress, billingAddress, couponCode, guestEmail, sessionId } = req.body;
    if (!cartItems?.length) return res.status(400).json({ error: 'El carrito esta vacio' });
    if (!shippingAddress) return res.status(400).json({ error: 'Direccion de envio requerida' });
    if (!req.userId && !guestEmail) return res.status(400).json({ error: 'Email requerido para compra como invitado' });
    const result = await createOrder({
      userId: req.userId,
      guestEmail,
      cartItems,
      shippingAddress,
      billingAddress,
      couponCode,
      sessionId,
    });
    res.status(201).json(result);
  } catch (err) { next(err); }
});

router.get('/my', requireAuth, async (req, res, next) => {
  try {
    res.json(await getUserOrders(req.userId, { page: parseInt(req.query.page || '1') }));
  } catch (err) { next(err); }
});

router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const order = await getOrder(req.params.id, req.userId);
    if (!order) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json(order);
  } catch (err) { next(err); }
});

module.exports = router;
