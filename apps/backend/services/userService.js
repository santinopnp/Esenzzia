const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../config/postgres');
const logger = require('../utils/logger');
const { upsertCustomer: zohoCrmUpsert } = require('./zohoCrmService');
const { subscribeContact }              = require('./zohoCampaignsService');

const SALT_ROUNDS = 12;

async function register({ email, password, firstName, lastName, phone, subscribeNewsletter = true }) {
  const existing = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
  if (existing.rows.length) throw Object.assign(new Error('Email ya registrado'), { status: 409 });

  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  const id   = uuidv4();

  await query(
    `INSERT INTO users (id, email, password_hash, first_name, last_name, phone)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [id, email.toLowerCase(), hash, firstName, lastName, phone]
  );

  // Async Zoho sync — non-blocking
  Promise.all([
    zohoCrmUpsert(id, { Email: email, First_Name: firstName, Last_Name: lastName, Phone: phone }).catch(e =>
      logger.warn('Zoho CRM sync on register failed', { error: e.message })),
    subscribeNewsletter
      ? subscribeContact({ email, firstName, lastName, phone }).catch(e =>
          logger.warn('Zoho Campaigns subscribe failed', { error: e.message }))
      : Promise.resolve(),
  ]);

  return generateTokens(id);
}

async function login({ email, password }) {
  const res = await query(
    'SELECT id, password_hash, is_active, role FROM users WHERE email = $1',
    [email.toLowerCase()]
  );
  const user = res.rows[0];
  if (!user) throw Object.assign(new Error('Credenciales inválidas'), { status: 401 });
  if (!user.is_active) throw Object.assign(new Error('Cuenta suspendida'), { status: 403 });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw Object.assign(new Error('Credenciales inválidas'), { status: 401 });

  await query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);
  return { ...generateTokens(user.id), role: user.role };
}

async function getProfile(userId) {
  const res = await query(
    `SELECT id, email, first_name, last_name, phone, role, created_at
     FROM users WHERE id = $1`,
    [userId]
  );
  return res.rows[0] || null;
}

async function updateProfile(userId, { firstName, lastName, phone }) {
  await query(
    `UPDATE users SET first_name = $2, last_name = $3, phone = $4, updated_at = NOW()
     WHERE id = $1`,
    [userId, firstName, lastName, phone]
  );
  // Async Zoho sync
  zohoCrmUpsert(userId, { First_Name: firstName, Last_Name: lastName, Phone: phone })
    .catch(e => logger.warn('Zoho CRM update profile failed', { error: e.message }));
}

function generateTokens(userId) {
  const token = jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
  return { token, userId };
}

module.exports = { register, login, getProfile, updateProfile };
