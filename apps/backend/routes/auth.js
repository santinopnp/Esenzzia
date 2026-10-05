const router = require('express').Router();
const Joi    = require('joi');
const { register, login, getProfile, updateProfile } = require('../services/userService');
const { requireAuth } = require('../middleware/auth');
const { auth: authLimiter } = require('../middleware/rateLimiter');

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().max(80),
  lastName: Joi.string().max(80),
  phone: Joi.string().max(20),
  subscribeNewsletter: Joi.boolean(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

router.post('/register', authLimiter, async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const result = await register(value);
    res.status(201).json(result);
  } catch (err) { next(err); }
});

router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const result = await login(value);
    res.json(result);
  } catch (err) { next(err); }
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const profile = await getProfile(req.userId);
    if (!profile) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(profile);
  } catch (err) { next(err); }
});

router.put('/me', requireAuth, async (req, res, next) => {
  try {
    await updateProfile(req.userId, req.body);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

module.exports = router;
