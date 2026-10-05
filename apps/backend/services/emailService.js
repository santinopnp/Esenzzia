const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

let _transport = null;

function getTransport() {
  if (!_transport) {
    _transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return _transport;
}

async function send({ to, subject, html, text }) {
  if (!process.env.SMTP_USER) {
    logger.warn('Email skipped — SMTP not configured', { to, subject });
    return;
  }
  try {
    await getTransport().sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'Esenzzia'}" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
      to, subject, html, text,
    });
    logger.info('Email sent', { to, subject });
  } catch (err) {
    logger.error('Email failed', { to, subject, error: err.message });
  }
}

async function sendOrderConfirmation(order, user) {
  const itemRows = order.items.map(i =>
    `<tr><td>${i.name}</td><td>${i.quantity}</td><td>${Number(i.unit_price).toLocaleString('es-CO')} COP</td></tr>`
  ).join('');

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:auto">
      <h2 style="color:#1a1a1a">Confirmación de pedido — Esenzzia</h2>
      <p>Hola ${user?.first_name || 'Cliente'}, ¡gracias por tu compra!</p>
      <p><strong>Pedido:</strong> ${order.order_number}</p>
      <table width="100%" border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse">
        <thead><tr><th>Producto</th><th>Cantidad</th><th>Precio</th></tr></thead>
        <tbody>${itemRows}</tbody>
      </table>
      <p><strong>Total: ${Number(order.total).toLocaleString('es-CO')} ${order.currency}</strong></p>
      <p>Tu pedido será despachado en 1-2 días hábiles.</p>
      <br/><p style="color:#666">El equipo de Esenzzia</p>
    </div>`;

  await send({
    to: user?.email || order.guest_email,
    subject: `Tu pedido ${order.order_number} está confirmado — Esenzzia`,
    html,
  });
}

async function sendWelcome(user) {
  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:auto">
      <h2>Bienvenid@ a Esenzzia, ${user.first_name}!</h2>
      <p>Estamos felices de tenerte en nuestra comunidad de fragancias.</p>
      <p>Explora nuestro catálogo y encuentra tu perfume perfecto.</p>
      <br/><p style="color:#666">Valentina y el equipo de Esenzzia</p>
    </div>`;
  await send({ to: user.email, subject: 'Bienvenid@ a Esenzzia', html });
}

module.exports = { send, sendOrderConfirmation, sendWelcome };
