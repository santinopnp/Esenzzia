/**
 * Zoho Campaigns — email marketing for Esenzzia.
 *
 * Env: ZOHO_CAMPAIGNS_LIST_KEY
 */
const axios = require('axios');
const { getAccessToken } = require('./zohoService');
const logger = require('../utils/logger');

const CAMPAIGNS_API = 'https://campaigns.zoho.com/api/v1.1';

function campaignsConfigured() {
  return !!(process.env.ZOHO_CLIENT_ID && process.env.ZOHO_REFRESH_TOKEN && process.env.ZOHO_CAMPAIGNS_LIST_KEY);
}

async function campaignsPost(path, params) {
  const token = await getAccessToken();
  const resp  = await axios.post(`${CAMPAIGNS_API}/${path}`, null, {
    params: { resfmt: 'JSON', ...params },
    headers: { Authorization: `Zoho-oauthtoken ${token}` },
    timeout: 15000,
  });
  return resp.data;
}

/**
 * Subscribe a new customer/newsletter signup to the main list.
 */
async function subscribeContact({ email, firstName, lastName, phone }) {
  if (!campaignsConfigured()) {
    logger.warn('Zoho Campaigns not configured — skipping subscribe');
    return null;
  }

  const contactInfo = JSON.stringify([{
    Contact_Email: email,
    First_Name:    firstName || '',
    Last_Name:     lastName  || '',
    Phone:         phone     || '',
  }]);

  const resp = await campaignsPost('json/listsubscribe', {
    listkey:     process.env.ZOHO_CAMPAIGNS_LIST_KEY,
    contactinfo: contactInfo,
  });

  logger.info('Zoho Campaigns: contact subscribed', { email, status: resp?.status });
  return resp;
}

/**
 * Unsubscribe a contact (e.g. on account deletion).
 */
async function unsubscribeContact(email) {
  if (!campaignsConfigured()) return null;
  const resp = await campaignsPost('json/listunsubscribe', {
    listkey:     process.env.ZOHO_CAMPAIGNS_LIST_KEY,
    contactinfo: JSON.stringify([{ Contact_Email: email }]),
  });
  logger.info('Zoho Campaigns: contact unsubscribed', { email });
  return resp;
}

module.exports = { subscribeContact, unsubscribeContact, campaignsConfigured };
