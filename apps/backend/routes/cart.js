const router = require('express').Router();
const { getCart, addItem, updateItem, clearCart } = require('../services/cartService');
const { optionalAuth } = require('../middleware/auth');

function sessionId(req) {
  return req.headers['x-cart-session'] || req.userId || 'anon';
}

router.use(optionalAuth);

router.get('/', async (req, res, next) => {
  try { res.json(await getCart(sessionId(req))); } catch (err) { next(err); }
});

router.post('/items', async (req, res, next) => {
  try {
    const { productId, variantId, quantity } = req.body;
    if (!productId) return res.status(400).json({ error: 'productId requerido' });
    res.json(await addItem(sessionId(req), { productId, variantId, quantity }));
  } catch (err) { next(err); }
});

router.put('/items', async (req, res, next) => {
  try {
    const { productId, variantId, quantity } = req.body;
    res.json(await updateItem(sessionId(req), { productId, variantId, quantity }));
  } catch (err) { next(err); }
});

router.delete('/', async (req, res, next) => {
  try { await clearCart(sessionId(req)); res.json({ ok: true }); } catch (err) { next(err); }
});

module.exports = router;
