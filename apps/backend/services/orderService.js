const { query, getClient } = require('../config/postgres');
const { clearCart }         = require('./cartService');
const { upsertCustomer: booksUpsert, createInvoice, markInvoicePaid } = require('./zohoBooksService');
const { logPurchase }       = require('./zohoCrmService');
const logger = require('../utils/logger');

function generateOrderNumber() {
  const date = new Date().toISOString().slice(0,10).replace(/-/g,'');
  const rand = Math.random().toString(36).substring(2,7).toUpperCase();
  return `ESZ-${date}-${rand}`;
}

async function createOrder({ userId, guestEmail, cartItems, shippingAddress, billingAddress, couponCode, sessionId }) {
  const client = await getClient();
  try {
    await client.query('BEGIN');

    // Validate & lock inventory
    for (const item of cartItems) {
      if (item.variantId) {
        const res = await client.query(
          'SELECT stock FROM product_variants WHERE id = $1 FOR UPDATE',
          [item.variantId]
        );
        if (!res.rows[0] || res.rows[0].stock < item.quantity) {
          throw Object.assign(new Error(`Sin stock suficiente: ${item.name}`), { status: 400 });
        }
      }
    }

    const subtotal = cartItems.reduce((s, i) => s + i.lineTotal, 0);
    const currency = cartItems[0]?.currency || 'COP';
    let discount = 0;

    if (couponCode) {
      const cpRes = await client.query(
        `SELECT * FROM coupons WHERE code = $1 AND is_active = TRUE
         AND (expires_at IS NULL OR expires_at > NOW())
         AND (max_uses IS NULL OR uses < max_uses)`,
        [couponCode.toUpperCase()]
      );
      const coupon = cpRes.rows[0];
      if (coupon) {
        discount = coupon.type === 'percent'
          ? subtotal * (coupon.value / 100)
          : Math.min(coupon.value, subtotal);
        await client.query('UPDATE coupons SET uses = uses + 1 WHERE id = $1', [coupon.id]);
      }
    }

    const shipping = subtotal - discount >= 150000 ? 0 : 12000; // free shipping above 150k COP
    const total    = subtotal - discount + shipping;
    const orderNumber = generateOrderNumber();

    const orderRes = await client.query(
      `INSERT INTO orders (order_number, user_id, guest_email, subtotal, discount, shipping, total, currency,
                           shipping_address, billing_address)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`,
      [orderNumber, userId || null, guestEmail || null, subtotal, discount, shipping, total, currency,
       JSON.stringify(shippingAddress), JSON.stringify(billingAddress || shippingAddress)]
    );
    const orderId = orderRes.rows[0].id;

    // Insert line items + decrement inventory
    for (const item of cartItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, variant_id, name, sku, quantity, unit_price, total, image_url)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [orderId, item.productId, item.variantId || null, item.name, item.sku || item.slug, item.quantity,
         item.price, item.lineTotal, item.image || null]
      );
      if (item.variantId) {
        await client.query(
          'UPDATE product_variants SET stock = stock - $1 WHERE id = $2',
          [item.quantity, item.variantId]
        );
        await client.query(
          `INSERT INTO inventory_movements (variant_id, delta, reason, ref_id)
           VALUES ($1, $2, 'sale', $3)`,
          [item.variantId, -item.quantity, orderId]
        );
      }
    }

    await client.query('COMMIT');

    // Clear cart and sync to Zoho (async, non-blocking)
    if (sessionId) clearCart(sessionId).catch(() => {});
    _syncOrderToZoho({ orderId, orderNumber, userId, guestEmail, total, currency, cartItems, shippingAddress })
      .catch(e => logger.warn('Zoho order sync failed', { error: e.message }));

    return { orderId, orderNumber, total, currency };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function _syncOrderToZoho({ orderId, orderNumber, userId, guestEmail, total, currency, cartItems, shippingAddress }) {
  let booksCustomer = null;
  if (userId || guestEmail) {
    const userRes = userId
      ? await query('SELECT email, first_name, last_name FROM users WHERE id = $1', [userId])
      : null;
    const user = userRes?.rows[0];
    const email = user?.email || guestEmail;
    const name  = user ? `${user.first_name} ${user.last_name}`.trim() : email;
    booksCustomer = await booksUpsert({ email, name, address: shippingAddress });
  }

  if (booksCustomer?.contact_id) {
    const invoice = await createInvoice({
      customerId: booksCustomer.contact_id,
      orderNumber,
      items: cartItems.map(i => ({ name: i.name, sku: i.sku || i.slug, quantity: i.quantity, unit_price: i.price })),
      currency,
      shippingTotal: 0,
    });
    if (invoice?.invoice_id) {
      await query('UPDATE orders SET zoho_invoice_id = $1 WHERE id = $2', [invoice.invoice_id, orderId]);
    }
    if (userId) {
      logPurchase(booksCustomer.contact_id, orderNumber, total, currency).catch(() => {});
    }
  }
}

async function getOrder(orderId, userId) {
  const res = await query(
    `SELECT o.*, json_agg(oi.*) AS items
     FROM orders o
     JOIN order_items oi ON oi.order_id = o.id
     WHERE o.id = $1 AND (o.user_id = $2 OR $2 IS NULL)
     GROUP BY o.id`,
    [orderId, userId || null]
  );
  return res.rows[0] || null;
}

async function getUserOrders(userId, { page = 1, limit = 10 } = {}) {
  const offset = (page - 1) * limit;
  const res    = await query(
    `SELECT id, order_number, status, total, currency, created_at
     FROM orders WHERE user_id = $1
     ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  return res.rows;
}

async function updateOrderStatus(orderId, status) {
  await query(
    'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2',
    [status, orderId]
  );
}

module.exports = { createOrder, getOrder, getUserOrders, updateOrderStatus };
