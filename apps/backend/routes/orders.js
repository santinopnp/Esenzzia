const express = require('express');
const router = express.Router();
const orderService = require('../../services/orderService');
const { requireAuth, optionalAuth } = require('../middleware/auth');

router.post('/', optionalAuth, async (req, res) => {
  try {
    const cartSession = req.headers['x-cart-session'];
    if (!cartSession) return res.status(400).json({ error: 'Sesión de carrito requerida' });
    const order = await orderService.createOrder({
      cartSession,
      userId: req.user?.id,
      shippingAddress: req.body.shipping_address,
      couponCode: req.body.coupon_code,
      paymentMethod: req.body.payment_method || 'wompi',
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/validate-coupon', optionalAuth, async (req, res) => {
  const { query } = require('../../config/postgres');
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'Código requerido' });
    const result = await query(
      `SELECT * FROM coupons WHERE code = $1 AND is_active = true AND (expires_at IS NULL OR expires_at > NOW()) AND (usage_limit IS NULL OR usage_count < usage_limit)`,
      [code.toUpperCase()]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Cupón inválido o expirado' });
    res.json({ valid: true, discount_percent: result.rows[0].discount_percent, code: result.rows[0].code });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/my-orders', requireAuth, async (req, res) => {
  try {
    const { query } = require('../../config/postgres');
    const result = await query(
      `SELECT o.*, json_agg(json_build_object(
         'product_name', oi.product_name, 'brand', oi.brand,
         'size_ml', oi.size_ml, 'quantity', oi.quantity, 'unit_price', oi.unit_price
       )) as items
       FROM orders o
       JOIN order_items oi ON oi.order_id = o.id
       WHERE o.user_id = $1
       GROUP BY o.id ORDER BY o.created_at DESC LIMIT 20`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { query } = require('../../config/postgres');
    const result = await query(
      `SELECT o.*, json_agg(json_build_object(
         'product_name', oi.product_name, 'brand', oi.brand,
         'size_ml', oi.size_ml, 'quantity', oi.quantity, 'unit_price', oi.unit_price
       )) as items
       FROM orders o
       JOIN order_items oi ON oi.order_id = o.id
       WHERE o.id = $1 AND o.user_id = $2
       GROUP BY o.id`,
      [req.params.id, req.user.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Orden no encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
