/**
 * Zoho OAuth base — token refresh and low-level HTTP helpers.
 *
 * Env:
 *   ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN
 *   ZOHO_ACCOUNTS_URL  (default https://accounts.zoho.com)
 *   ZOHO_API_DOMAIN    (default https://www.zohoapis.com)
 */
const axios = require('axios');
const logger = require('../utils/logger');

const ACCOUNTS = process.env.ZOHO_ACCOUNTS_URL || 'https://accounts.zoho.com';
const API      = process.env.ZOHO_API_DOMAIN    || 'https://www.zohoapis.com';

let cachedToken  = null;
let cachedExpiry = 0;
let refreshPromise = null;

function isConfigured() {
  return !!(process.env.ZOHO_CLIENT_ID && process.env.ZOHO_CLIENT_SECRET && process.env.ZOHO_REFRESH_TOKEN);
}

async function getAccessToken() {
  if (!isConfigured()) throw new Error('Zoho not configured');
  if (cachedToken && Date.now() < cachedExpiry - 60_000) return cachedToken;
  if (!refreshPromise) {
    refreshPromise = _refreshToken().finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
}

async function _refreshToken() {
  const resp = await axios.post(`${ACCOUNTS}/oauth/v2/token`, null, {
    params: {
      grant_type:    'refresh_token',
      client_id:     process.env.ZOHO_CLIENT_ID,
      client_secret: process.env.ZOHO_CLIENT_SECRET,
      refresh_token: process.env.ZOHO_REFRESH_TOKEN,
    },
    timeout: 15000,
  });
  if (!resp.data?.access_token) throw new Error(`Zoho refresh failed: ${JSON.stringify(resp.data)}`);
  cachedToken  = resp.data.access_token;
  cachedExpiry = Date.now() + (resp.data.expires_in || 3600) * 1000;
  return cachedToken;
}

function escapeCriteria(value) {
  return String(value).replace(/([\\(),])/g, '\\$1');
}

async function crmGet(path, params = {}) {
  const token = await getAccessToken();
  const resp  = await axios.get(`${API}/crm/v3/${path}`, {
    params,
    headers: { Authorization: `Zoho-oauthtoken ${token}` },
    timeout: 15000,
  });
  return resp.data;
}

async function crmPost(path, body) {
  const token = await getAccessToken();
  const resp  = await axios.post(`${API}/crm/v3/${path}`, body, {
    headers: { Authorization: `Zoho-oauthtoken ${token}`, 'Content-Type': 'application/json' },
    timeout: 15000,
  });
  return resp.data;
}

async function crmPut(path, body) {
  const token = await getAccessToken();
  const resp  = await axios.put(`${API}/crm/v3/${path}`, body, {
    headers: { Authorization: `Zoho-oauthtoken ${token}`, 'Content-Type': 'application/json' },
    timeout: 15000,
  });
  return resp.data;
}

async function searchOne(module, criteria) {
  try {
    const data = await crmGet(`${module}/search`, { criteria });
    return data?.data?.[0] || null;
  } catch (err) {
    if (err.response?.status === 204) return null;
    throw err;
  }
}

module.exports = { isConfigured, getAccessToken, escapeCriteria, crmGet, crmPost, crmPut, searchOne, API, ACCOUNTS };
