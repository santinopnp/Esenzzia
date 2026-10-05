const rateLimit = require('express-rate-limit');

const api = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes, intenta mas tarde.' },
});

const auth = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Demasiados intentos de autenticacion.' },
});

const chat = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: 'Limite de mensajes alcanzado.' },
});

module.exports = { api, auth, chat };
