const { Pool } = require('pg');
const logger = require('../utils/logger');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => logger.error('PostgreSQL pool error', { error: err.message }));

async function connectPostgres() {
  const client = await pool.connect();
  await client.query('SELECT 1');
  client.release();
  logger.info('PostgreSQL connected');
}

async function query(text, params) {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;
  if (duration > 1000) logger.warn('Slow query', { text: text.substring(0, 80), duration });
  return result;
}

async function getClient() {
  return pool.connect();
}

module.exports = { pool, query, getClient, connectPostgres };
