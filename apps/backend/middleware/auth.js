const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'Token requerido' });
  try {
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch {
    res.status(401).json({ error: 'Token invalido' });
  }
}

function optionalAuth(req, _res, next) {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    try {
      const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET);
      req.userId = payload.sub;
    } catch {}
  }
  next();
}

async function requireAdmin(req, res, next) {
  if (!req.userId) return res.status(401).json({ error: 'No autenticado' });
  const { query } = require('../config/postgres');
  const r = await query('SELECT role FROM users WHERE id = $1', [req.userId]);
  if (!['admin', 'staff'].includes(r.rows[0]?.role)) return res.status(403).json({ error: 'Acceso denegado' });
  req.userRole = r.rows[0].role;
  next();
}

module.exports = { requireAuth, optionalAuth, requireAdmin };
