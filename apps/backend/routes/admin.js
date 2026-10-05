const router = require('express').Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { query } = require('../config/postgres');
const { updateOrderStatus } = require('../services/orderService');
const { getRevenueSummary } = require('../services/zohoBooksService');

router.use(requireAuth, requireAdmin);

router.get('/dashboard', async (req, res, next) => {
  try {
    const [orders, revenue, customers, lowStock] = await Promise.all([
      query(`SELECT status, COUNT(*) as count FROM orders GROUP BY status`),
      query(`SELECT COALESCE(SUM(total),0) as total FROM orders WHERE status IN ('confirmed','processing','shipped','delivered') AND created_at > NOW() - INTERVAL '30 days'`),
      query(`SELECT COUNT(*) as count FROM users WHERE role = 'customer'`),
      query(`SELECT pv.id, pv.sku, pv.stock, p.name FROM product_variants pv JOIN products p ON p.id = pv.product_id WHERE pv.stock < 5 ORDER BY pv.stock`),
    ]);
    res.json({
      orders: orders.rows,
      monthlyRevenue: revenue.rows[0].total,
      totalCustomers: customers.rows[0].count,
      lowStockAlerts: lowStock.rows,
    });
  } catch (err) { next(err); }
});

router.get('/orders', async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const where  = status ? `WHERE status = $3` : '';
    const params = status ? [limit, offset, status] : [limit, offset];
    const res2   = await query(
      `SELECT o.id, o.order_number, o.status, o.total, o.currency, o.created_at,
              u.email AS user_email, u.first_name, u.last_name
       FROM orders o LEFT JOIN users u ON u.id = o.user_id
       ${where} ORDER BY o.created_at DESC LIMIT $1 OFFSET $2`,
      params
    );
    res.json(res2.rows);
  } catch (err) { next(err); }
});

router.put('/orders/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending','confirmed','processing','shipped','delivered','cancelled','refunded'];
    if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Estado invalido' });
    await updateOrderStatus(req.params.id, status);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

router.get('/revenue', async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const summary = await getRevenueSummary(
      from || new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0],
      to   || new Date().toISOString().split('T')[0]
    );
    res.json(summary || { message: 'Zoho Books no configurado' });
  } catch (err) { next(err); }
});

router.get('/products', async (req, res, next) => {
  try {
    const res2 = await query(`SELECT id, sku, name, price, currency, is_active, is_featured, created_at FROM products ORDER BY created_at DESC LIMIT 100`);
    res.json(res2.rows);
  } catch (err) { next(err); }
});

router.patch('/products/:id', async (req, res, next) => {
  try {
    const allowed = ['name','price','compare_price','is_active','is_featured','short_desc'];
    const updates = Object.entries(req.body).filter(([k]) => allowed.includes(k));
    if (!updates.length) return res.status(400).json({ error: 'Sin campos validos' });
    const sets   = updates.map(([k], i) => `${k} = $${i+2}`).join(', ');
    const values = updates.map(([,v]) => v);
    await query(`UPDATE products SET ${sets}, updated_at = NOW() WHERE id = $1`, [req.params.id, ...values]);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

module.exports = router;
