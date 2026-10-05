/**
 * Payment service — Stripe (international) + Wompi (Colombia).
 */
const Stripe = require('stripe');
const axios  = require('axios');
const crypto = require('crypto');
const { query }          = require('../config/postgres');
const { updateOrderStatus } = require('./orderService');
const { markInvoicePaid }   = require('./zohoBooksService');
const logger = require('../utils/logger');

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY not set');
  return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });
}

// ── Stripe ────────────────────────────────────────────────────────────────────
async function createStripePaymentIntent({ orderId, amount, currency, metadata = {} }) {
  const stripe  = getStripe();
  const amountCents = Math.round(amount * 100);

  const intent = await stripe.paymentIntents.create({
    amount:   amountCents,
    currency: (currency || 'cop').toLowerCase(),
    metadata: { orderId, ...metadata },
  });

  await query(
    `INSERT INTO payments (order_id, provider, provider_ref, amount, currency, status, metadata)
     VALUES ($1, 'stripe', $2, $3, $4, 'pending', $5)`,
    [orderId, intent.id, amount, currency, JSON.stringify({ clientSecret: intent.client_secret })]
  );

  return { clientSecret: intent.client_secret, intentId: intent.id };
}

async function handleStripeWebhook(rawBody, sig) {
  const stripe = getStripe();
  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    throw Object.assign(new Error(`Stripe webhook sig invalid: ${err.message}`), { status: 400 });
  }

  if (event.type === 'payment_intent.succeeded') {
    const intent  = event.data.object;
    const orderId = intent.metadata?.orderId;
    if (orderId) {
      await query(
        `UPDATE payments SET status = 'completed', completed_at = NOW()
         WHERE provider = 'stripe' AND provider_ref = $1`,
        [intent.id]
      );
      await updateOrderStatus(orderId, 'confirmed');

      // Sync Zoho Books invoice payment
      const orderRes = await query('SELECT zoho_invoice_id, total FROM orders WHERE id = $1', [orderId]);
      const order    = orderRes.rows[0];
      if (order?.zoho_invoice_id) {
        markInvoicePaid(order.zoho_invoice_id, order.total).catch(() => {});
      }
      logger.info('Stripe: payment succeeded', { orderId, intentId: intent.id });
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    const intent  = event.data.object;
    const orderId = intent.metadata?.orderId;
    if (orderId) {
      await query(
        `UPDATE payments SET status = 'failed' WHERE provider = 'stripe' AND provider_ref = $1`,
        [intent.id]
      );
      await updateOrderStatus(orderId, 'cancelled');
    }
  }
}

// ── Wompi (Colombia) ──────────────────────────────────────────────────────────
async function createWompiTransaction({ orderId, orderNumber, amountCents, customerEmail, redirectUrl }) {
  if (!process.env.WOMPI_PUBLIC_KEY) throw new Error('WOMPI_PUBLIC_KEY not set');

  const reference = orderNumber;
  const signature = crypto
    .createHash('sha256')
    .update(`${reference}${amountCents}COP${process.env.WOMPI_INTEGRITY_SECRET}`)
    .digest('hex');

  await query(
    `INSERT INTO payments (order_id, provider, provider_ref, amount, currency, status)
     VALUES ($1, 'wompi', $2, $3, 'COP', 'pending')`,
    [orderId, reference, amountCents / 100]
  );

  return {
    publicKey:   process.env.WOMPI_PUBLIC_KEY,
    currency:    'COP',
    amountInCents: amountCents,
    reference,
    signature,
    customerEmail,
    redirectUrl,
  };
}

async function handleWompiWebhook(event, signature) {
  // Verify Wompi event signature
  const checksum = crypto
    .createHash('sha256')
    .update(JSON.stringify(event.data) + process.env.WOMPI_EVENTS_SECRET)
    .digest('hex');
  if (checksum !== signature) {
    throw Object.assign(new Error('Wompi signature invalid'), { status: 400 });
  }

  if (event.event === 'transaction.updated') {
    const tx = event.data.transaction;
    if (tx.status === 'APPROVED') {
      const res = await query(
        `UPDATE payments SET status = 'completed', completed_at = NOW()
         WHERE provider = 'wompi' AND provider_ref = $1 RETURNING order_id`,
        [tx.reference]
      );
      const orderId = res.rows[0]?.order_id;
      if (orderId) {
        await updateOrderStatus(orderId, 'confirmed');
        const orderRes = await query('SELECT zoho_invoice_id, total FROM orders WHERE id = $1', [orderId]);
        const order    = orderRes.rows[0];
        if (order?.zoho_invoice_id) markInvoicePaid(order.zoho_invoice_id, order.total).catch(() => {});
      }
    } else if (['DECLINED', 'VOIDED', 'ERROR'].includes(tx.status)) {
      await query(
        `UPDATE payments SET status = 'failed' WHERE provider = 'wompi' AND provider_ref = $1`,
        [tx.reference]
      );
    }
  }
}

module.exports = { createStripePaymentIntent, handleStripeWebhook, createWompiTransaction, handleWompiWebhook };
