const router = require('express').Router();
const { chat, recommendProducts } = require('../services/valentinAIService');
const { getOrCreateConversation, appendMessage, getMessages } = require('../services/chatConversationService');
const { escalateFromChat } = require('../services/zohoDeskService');
const { chat: chatLimiter } = require('../middleware/rateLimiter');
const { optionalAuth } = require('../middleware/auth');
const { query } = require('../config/postgres');

router.use(optionalAuth);
router.use(chatLimiter);

router.post('/message', async (req, res, next) => {
  try {
    const { message, sessionId, context } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: 'Mensaje vacio' });
    if (!sessionId) return res.status(400).json({ error: 'sessionId requerido' });

    const conv = await getOrCreateConversation(sessionId, req.userId);
    const history = await getMessages(conv.id);

    const messages = [...history, { role: 'user', content: message.trim() }];
    const result   = await chat({ messages, context: context || {} });

    await appendMessage(conv.id, { role: 'user', content: message.trim() });
    await appendMessage(conv.id, { role: 'assistant', content: result.reply });

    // Auto-escalate to Zoho Desk if needed
    if (result.shouldEscalate) {
      let userInfo = null;
      if (req.userId) {
        const r = await query('SELECT email, first_name, last_name FROM users WHERE id = $1', [req.userId]);
        userInfo = r.rows[0];
      }
      escalateFromChat({
        userId:  req.userId,
        email:   userInfo?.email || context?.email || 'chat@esenzzia.com',
        name:    userInfo ? `${userInfo.first_name} ${userInfo.last_name}`.trim() : 'Cliente web',
        summary: result.escalateSummary,
        chatHistory: messages.slice(-6),
      }).catch(() => {});
    }

    res.json({ reply: result.reply, conversationId: conv.id, escalated: result.shouldEscalate });
  } catch (err) { next(err); }
});

router.post('/recommend', async (req, res, next) => {
  try {
    const { preferences } = req.body;
    if (!preferences) return res.status(400).json({ error: 'preferences requerido' });
    const { searchProducts } = require('../services/productService');
    const catalog = await searchProducts(preferences, 20);
    const result  = await recommendProducts({ preferences, availableProducts: catalog });
    res.json(result);
  } catch (err) { next(err); }
});

module.exports = router;
