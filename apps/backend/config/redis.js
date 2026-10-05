const Redis = require('ioredis');
const logger = require('../utils/logger');

let client;

function getRedis() {
  if (!client) {
    client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });
    client.on('error', (err) => logger.error('Redis error', { error: err.message }));
    client.on('connect', () => logger.info('Redis connected'));
  }
  return client;
}

async function connectRedis() {
  const redis = getRedis();
  await redis.connect().catch(() => {}); // lazyConnect — tolera si ya está conectado
  logger.info('Redis ready');
}

module.exports = { getRedis, connectRedis };
