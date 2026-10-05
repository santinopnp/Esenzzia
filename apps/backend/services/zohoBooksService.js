/**
 * Zoho Books — invoicing and accounting for Esenzzia.
 *
 * Env:
 *   ZOHO_BOOKS_ORG_ID
 */
const axios = require('axios');
const { getAccessToken, ACCOUNTS } = require('./zohoService');
const logger = require('../utils/logger');

const BOOKS_API = 'https://www.zohoapis.com/books/v3';

function booksConfigured() {
  return !!(process.env.ZOHO_CLIENT_ID && process.env.ZOHO_CLIENT_SECRET &&
            process.env.ZOHO_REFRESH_TOKEN && process.env.ZOHO_BOOKS_ORG_ID);
}

async function booksGet(path, params = {}) {
  const token = await getAccessToken();
  const resp  = await axios.get(`${BOOKS_API}/${path}`, {
    params: { organization_id: process.env.ZOHO_BOOKS_ORG_ID, ...params },
    headers: { Authorization: `Zoho-oauthtoken ${token}` },
    timeout: 15000,
  });
  return resp.data;
}

async function booksPost(path, body) {
  const token = await getAccessToken();
  const resp  = await axios.post(`${BOOKS_API}/${path}`, body, {
    params: { organization_id: process.env.ZOHO_BOOKS_ORG_ID },
    headers: { Authorization: `Zoho-oauthtoken ${token}`, 'Content-Type': 'application/json' },
    timeout: 15000,
  });
  return resp.data;
}

/**
 * Create or find a Zoho Books customer by email.
 */
async function upsertCustomer({ email, name, phone, address }) {
  if (!booksConfigured()) return null;

  // Search existing
  try {
    const data = await booksGet('contacts', { email, contact_type: 'customer' });
    const existing = data?.contacts?.[0];
    if (existing) return existing;
  } catch (_) {}

  const resp = await booksPost('contacts', {
    contact_name: name || email,
    contact_type: 'customer',
    email,
    phone: phone || '',
    billing_address: address ? {
      address: address.line1,
      city: address.city,
      state: address.state,
      country: address.country || 'CO',
      zip: address.zip || '',
    } : undefined,
  });
  return resp?.contact || null;
}

/**
 * Create a Zoho Books invoice for a confirmed order.
 */
async function createInvoice({ customerId, orderNumber, items, currency, shippingTotal, taxRate = 0 }) {
  if (!booksConfigured()) {
    logger.warn('Zoho Books not configured — skipping invoice creation');
    return null;
  }

  const lineItems = items.map(item => ({
    name:       item.name,
    quantity:   item.quantity,
    rate:       item.unit_price,
    tax_percentage: taxRate,
    description: item.sku,
  }));

  if (shippingTotal > 0) {
    lineItems.push({ name: 'Envío', quantity: 1, rate: shippingTotal });
  }

  const resp = await booksPost('invoices', {
    customer_id:    customerId,
    invoice_number: orderNumber,
    reference_number: orderNumber,
    currency_code:  currency || 'COP',
    line_items:     lineItems,
    payment_terms:  0,
    notes:          'Gracias por tu compra en Esenzzia.',
  });

  logger.info('Zoho Books: invoice created', { orderNumber, invoiceId: resp?.invoice?.invoice_id });
  return resp?.invoice || null;
}

/**
 * Mark invoice as paid.
 */
async function markInvoicePaid(invoiceId, amount, paymentDate) {
  if (!booksConfigured()) return null;
  const resp = await booksPost(`invoices/${invoiceId}/payments`, {
    payment_mode: 'online',
    amount,
    date: paymentDate || new Date().toISOString().split('T')[0],
  });
  return resp?.payment || null;
}

/**
 * Get revenue summary for a date range (for admin dashboard).
 */
async function getRevenueSummary(fromDate, toDate) {
  if (!booksConfigured()) return null;
  const data = await booksGet('reports/salesbycustomer', {
    from_date: fromDate,
    to_date:   toDate,
    export_type: 'json',
  });
  return data?.report || null;
}

module.exports = { upsertCustomer, createInvoice, markInvoicePaid, getRevenueSummary, booksConfigured };
