/**
 * Shopping cart backed by Redis.
 * Cart key: cart:<sessionId>
 * TTL: 7 days
 */
const { getRedis } = require('../config/redis');
const { query }    = require('../config/postgres');

const CART_TTL = 60 * 60 * 24 * 7; // 7 days

function cartKey(sessionId) {
  return `cart:${sessionId}`;
}

async function getCart(sessionId) {
  const redis = getRedis();
  const raw   = await redis.get(cartKey(sessionId));
  const items = raw ? JSON.parse(raw) : [];
  return enrichCart(items);
}

async function enrichCart(items) {
  if (!items.length) return { items: [], subtotal: 0, currency: 'COP' };

  const variantIds = items.map(i => i.variantId).filter(Boolean);
  const productIds = items.filter(i => !i.variantId).map(i => i.productId);

  let prices = {};

  if (variantIds.length) {
    const res = await query(
      `SELECT pv.id, pv.price, pv.name AS variant_name, pv.stock,
              p.name, p.slug, p.images, p.currency
       FROM product_variants pv JOIN products p ON p.id = pv.product_id
       WHERE pv.id = ANY($1::uuid[]) AND pv.is_active = TRUE AND p.is_active = TRUE`,
      [variantIds]
    );
    res.rows.forEach(r => { prices[r.id] = r; });
  }

  if (productIds.length) {
    const res = await query(
      `SELECT id, name, slug, price, currency, images, NULL AS variant_name, 999 AS stock
       FROM products WHERE id = ANY($1::uuid[]) AND is_active = TRUE`,
      [productIds]
    );
    res.rows.forEach(r => { prices[r.id] = r; });
  }

  const enrichedItems = items.map(item => {
    const key  = item.variantId || item.productId;
    const data = prices[key];
    if (!data) return null;
    return {
      productId:   item.productId,
      variantId:   item.variantId || null,
      name:        data.name + (data.variant_name ? ` — ${data.variant_name}` : ''),
      slug:        data.slug,
      price:       parseFloat(data.price),
      currency:    data.currency || 'COP',
      quantity:    item.quantity,
      stock:       data.stock,
      image:       data.images?.[0] || null,
      lineTotal:   parseFloat(data.price) * item.quantity,
    };
  }).filter(Boolean);

  const subtotal = enrichedItems.reduce((s, i) => s + i.lineTotal, 0);
  const currency = enrichedItems[0]?.currency || 'COP';

  return { items: enrichedItems, subtotal, currency };
}

async function addItem(sessionId, { productId, variantId, quantity = 1 }) {
  const redis = getRedis();
  const raw   = await redis.get(cartKey(sessionId));
  const items = raw ? JSON.parse(raw) : [];

  const key = variantId || productId;
  const existing = items.find(i => (i.variantId || i.productId) === key);

  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({ productId, variantId: variantId || null, quantity });
  }

  await redis.set(cartKey(sessionId), JSON.stringify(items), 'EX', CART_TTL);
  return enrichCart(items);
}

async function updateItem(sessionId, { productId, variantId, quantity }) {
  const redis = getRedis();
  const raw   = await redis.get(cartKey(sessionId));
  let items   = raw ? JSON.parse(raw) : [];

  const key = variantId || productId;
  if (quantity <= 0) {
    items = items.filter(i => (i.variantId || i.productId) !== key);
  } else {
    const item = items.find(i => (i.variantId || i.productId) === key);
    if (item) item.quantity = quantity;
  }

  await redis.set(cartKey(sessionId), JSON.stringify(items), 'EX', CART_TTL);
  return enrichCart(items);
}

async function clearCart(sessionId) {
  await getRedis().del(cartKey(sessionId));
}

module.exports = { getCart, addItem, updateItem, clearCart };
