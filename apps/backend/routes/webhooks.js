const router  = require('express').Router();
const express = require('express');
const { handleStripeWebhook, handleWompiWebhook } = require('../services/paymentService');
const logger = require('../utils/logger');

// Stripe requires raw body
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    await handleStripeWebhook(req.body, sig);
    res.json({ received: true });
  } catch (err) {
    logger.error('Stripe webhook error', { error: err.message });
    res.status(err.status || 400).json({ error: err.message });
  }
});

router.post('/wompi', async (req, res) => {
  try {
    const sig = req.headers['x-event-checksum'];
    await handleWompiWebhook(req.body, sig);
    res.json({ received: true });
  } catch (err) {
    logger.error('Wompi webhook error', { error: err.message });
    res.status(err.status || 400).json({ error: err.message });
  }
});

module.exports = router;
