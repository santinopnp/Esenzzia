/**
 * Zoho CRM — customer contacts for Esenzzia.
 *
 * Syncs customers into Zoho Contacts with Esenzzia_ID as the unique key.
 */
const { crmPost, crmPut, searchOne, escapeCriteria, isConfigured } = require('./zohoService');
const logger = require('../utils/logger');

async function upsertCustomer(esenzziId, fields) {
  if (!isConfigured()) {
    logger.warn('Zoho CRM skipped — not configured', { esenzziId });
    return null;
  }

  const existing = await searchOne('Contacts', `(Esenzzia_ID:equals:${escapeCriteria(esenzziId)})`);
  const payload  = { data: [{ Esenzzia_ID: esenzziId, ...fields }] };

  if (existing?.id) {
    const resp = await crmPut(`Contacts/${existing.id}`, payload);
    const status = resp?.data?.[0]?.status;
    if (status !== 'success') throw new Error(`Zoho CRM update failed: ${JSON.stringify(resp)}`);
    logger.info('Zoho CRM: Contact updated', { esenzziId, contactId: existing.id });
    return { action: 'updated', id: existing.id };
  }

  const resp = await crmPost('Contacts/upsert', {
    data: [{ Esenzzia_ID: esenzziId, ...fields }],
    duplicate_check_fields: ['Esenzzia_ID'],
  });
  const record = resp?.data?.[0];
  if (!record?.details?.id) throw new Error(`Zoho CRM create failed: ${JSON.stringify(resp)}`);
  logger.info('Zoho CRM: Contact created', { esenzziId, contactId: record.details.id });
  return { action: 'created', id: record.details.id };
}

async function logPurchase(contactId, orderNumber, amount, currency) {
  if (!isConfigured()) return null;
  // Log purchase as a Zoho CRM Activity/Note
  const resp = await crmPost('Activities', {
    data: [{
      Activity_Type: 'Pedido',
      Subject: `Pedido ${orderNumber}`,
      Description: `Total: ${amount} ${currency}`,
      Who_Id: { id: contactId, module: 'Contacts' },
      Status: 'Completed',
    }],
  });
  return resp?.data?.[0] || null;
}

module.exports = { upsertCustomer, logPurchase };
