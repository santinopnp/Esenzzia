/**
 * Zoho Desk — support tickets for Esenzzia.
 *
 * Env: ZOHO_DESK_ORG_ID
 */
const axios = require('axios');
const { getAccessToken } = require('./zohoService');
const logger = require('../utils/logger');

const DESK_API = 'https://desk.zoho.com/api/v1';

function deskConfigured() {
  return !!(process.env.ZOHO_CLIENT_ID && process.env.ZOHO_REFRESH_TOKEN && process.env.ZOHO_DESK_ORG_ID);
}

async function deskPost(path, body) {
  const token = await getAccessToken();
  const resp  = await axios.post(`${DESK_API}/${path}`, body, {
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
      orgId: process.env.ZOHO_DESK_ORG_ID,
      'Content-Type': 'application/json',
    },
    timeout: 15000,
  });
  return resp.data;
}

/**
 * Create a support ticket from a customer inquiry or chat escalation.
 */
async function createTicket({ contactId, contactEmail, contactName, subject, description, priority = 'Medium', channel = 'Web', category }) {
  if (!deskConfigured()) {
    logger.warn('Zoho Desk not configured — skipping ticket creation');
    return null;
  }

  const body = {
    subject,
    description,
    priority,
    channel,
    category,
    contact: contactId ? { id: contactId } : { email: contactEmail, lastName: contactName },
  };

  const resp = await deskPost('tickets', body);
  logger.info('Zoho Desk: ticket created', { ticketId: resp?.id, subject });
  return resp;
}

/**
 * Create a ticket from a Valentina AI chat escalation.
 */
async function escalateFromChat({ userId, email, name, summary, chatHistory }) {
  const description = [
    `Escalación desde chat Valentina AI.`,
    `Resumen: ${summary}`,
    '',
    'Historial de chat:',
    chatHistory.map(m => `[${m.role}]: ${m.content}`).join('\n'),
  ].join('\n');

  return createTicket({
    contactEmail: email,
    contactName:  name,
    subject:      `Consulta web — ${summary.substring(0, 60)}`,
    description,
    channel:      'Chat',
    priority:     'High',
    category:     'Servicio al cliente',
  });
}

module.exports = { createTicket, escalateFromChat, deskConfigured };
