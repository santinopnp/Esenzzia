const express = require('express');
const router = express.Router();
const paymentService = require('../../services/paymentService');
const { optionalAuth } = require('../middleware/auth');

// Stripe: create payment intent
router.post('/stripe/intent', optionalAuth, async (req, res) => {
  try {
    const { order_id } = req.body;
    if (!order_id) return res.status(400).json({ error: 'order_id requerido' });
    const intent = await paymentService.createStripePaymentIntent(order_id);
    res.json(intent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Wompi: create transaction
router.post('/wompi/transaction', optionalAuth, async (req, res) => {
  try {
    const { order_id } = req.body;
    if (!order_id) return res.status(400).json({ error: 'order_id requerido' });
    const result = await paymentService.createWompiTransaction(order_id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
