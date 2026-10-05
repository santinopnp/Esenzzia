/**
 * Persists and retrieves Valentina AI chat conversations.
 */
const { query } = require('../config/postgres');
const { v4: uuidv4 } = require('uuid');

async function getOrCreateConversation(sessionId, userId = null) {
  const res = await query(
    'SELECT * FROM chat_conversations WHERE session_id = $1 ORDER BY created_at DESC LIMIT 1',
    [sessionId]
  );
  if (res.rows[0]) return res.rows[0];

  const id = uuidv4();
  const ins = await query(
    `INSERT INTO chat_conversations (id, session_id, user_id, messages)
     VALUES ($1, $2, $3, '[]') RETURNING *`,
    [id, sessionId, userId]
  );
  return ins.rows[0];
}

async function appendMessage(conversationId, { role, content }) {
  await query(
    `UPDATE chat_conversations
     SET messages = messages || $2::jsonb, updated_at = NOW()
     WHERE id = $1`,
    [conversationId, JSON.stringify([{ role, content, ts: Date.now() }])]
  );
}

async function getMessages(conversationId) {
  const res = await query(
    'SELECT messages FROM chat_conversations WHERE id = $1',
    [conversationId]
  );
  return res.rows[0]?.messages || [];
}

module.exports = { getOrCreateConversation, appendMessage, getMessages };
