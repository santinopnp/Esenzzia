const router = require('express').Router();
const { createStripePaymentIntent, handleStripeWebhook, createWompiTransaction } = require('../services/paymentService');
const { optionalAuth } = require('../middleware/auth');

router.post('/stripe/intent', optionalAuth, async (req, res, next) => {
  try {
    const { orderId, amount, currency } = req.body;
    if (!orderId || !amount) return res.status(400).json({ error: 'orderId y amount requeridos' });
    res.json(await createStripePaymentIntent({ orderId, amount, currency }));
  } catch (err) { next(err); }
});

router.post('/wompi/init', optionalAuth, async (req, res, next) => {
  try {
    const { orderId, orderNumber, amountCents, customerEmail } = req.body;
    if (!orderId || !amountCents) return res.status(400).json({ error: 'orderId y amountCents requeridos' });
    const redirectUrl = `${process.env.FRONTEND_URL}/order-confirmed?order=${orderNumber}`;
    res.json(await createWompiTransaction({ orderId, orderNumber, amountCents, customerEmail, redirectUrl }));
  } catch (err) { next(err); }
});

module.exports = router;
