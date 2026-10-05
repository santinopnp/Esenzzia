/**
 * Valentina — Esenzzia AI customer service assistant.
 *
 * Powered by Claude (Anthropic API). Valentina helps customers discover
 * fragrances, answers product questions, tracks orders, and escalates
 * complex issues to human support via Zoho Desk.
 *
 * Env:
 *   ANTHROPIC_API_KEY
 *   VALENTINA_MODEL       (default: claude-sonnet-4-6)
 *   VALENTINA_MAX_TOKENS  (default: 1024)
 */
const Anthropic = require('@anthropic-ai/sdk');
const logger = require('../utils/logger');

let _client = null;

function getClient() {
  if (!_client) {
    if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not set');
    _client = new Anthropic.default({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _client;
}

function isAvailable() {
  return !!process.env.ANTHROPIC_API_KEY;
}

const SYSTEM_PROMPT = `Eres Valentina, la asesora de fragancias de Esenzzia Colombia.

Esenzzia es una tienda premium de perfumes y esencias naturales con sede en Colombia.
Nuestro catálogo incluye: perfumes de autor, esencias naturales, difusores, velas aromáticas
y kits de regalo.

Tu rol:
- Ayudar a los clientes a encontrar la fragancia perfecta según su personalidad, ocasión o preferencias
- Responder preguntas sobre productos, notas olfativas, duración, proyección e ingredientes
- Informar sobre envíos (Colombia: 2-5 días hábiles), política de cambios (15 días)
- Ayudar con el seguimiento de pedidos cuando el cliente provea su número de orden
- Recomendar productos complementarios o regalos
- Si el cliente tiene un problema que no puedes resolver, ofrecer escalarlo a servicio humano

Tono: cálido, experto en fragancias, elegante sin ser pretencioso. Usa vocabulario del mundo perfumero
cuando sea útil (notas de salida/corazón/fondo, familia olfativa, sillag, longevidad, etc.)
Comunica siempre en español. Respuestas concisas: máximo 3-4 oraciones salvo que el cliente pida detalle.

Si necesitas escalar:
- Responde con el texto exacto: [ESCALAR: <resumen breve del problema>]
- Solo escala cuando el cliente pida hablar con un humano o cuando sea un problema de pedido/pago urgente.`;

/**
 * Send a message to Valentina and get a response.
 *
 * @param {object} params
 * @param {Array<{role: 'user'|'assistant', content: string}>} params.messages - conversation history
 * @param {object} [params.context] - optional context (current cart, order number, etc.)
 * @returns {Promise<{reply: string, shouldEscalate: boolean, escalateSummary: string|null}>}
 */
async function chat({ messages, context = {} }) {
  if (!isAvailable()) throw new Error('Valentina AI not configured');

  const client = getClient();
  const model  = process.env.VALENTINA_MODEL || 'claude-sonnet-4-6';
  const maxTokens = Number(process.env.VALENTINA_MAX_TOKENS || 1024);

  // Inject context as a system note if present
  let systemPrompt = SYSTEM_PROMPT;
  if (context.orderNumber) {
    systemPrompt += `\n\n[CONTEXTO ACTUAL]\nNúmero de orden activo: ${context.orderNumber}`;
  }
  if (context.cartTotal) {
    systemPrompt += `\nCarrito actual: ${context.cartItems} productos, total ${context.cartTotal} COP`;
  }

  const response = await client.messages.create({
    model,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: messages.map(m => ({ role: m.role, content: m.content })),
  });

  const reply = response.content?.[0]?.text?.trim() || '';

  // Check for escalation signal
  const escalateMatch = reply.match(/\[ESCALAR:\s*(.+?)\]/);
  if (escalateMatch) {
    return {
      reply: reply.replace(escalateMatch[0], '').trim() ||
        'Entiendo, te voy a conectar con uno de nuestros asesores. Te contactarán pronto.',
      shouldEscalate:  true,
      escalateSummary: escalateMatch[1].trim(),
    };
  }

  return { reply, shouldEscalate: false, escalateSummary: null };
}

/**
 * Generate product recommendations based on a customer's preferences.
 *
 * @param {object} params
 * @param {string} params.preferences - free text description of what the customer wants
 * @param {Array}  params.availableProducts - product catalog snippet
 * @returns {Promise<{recommendations: Array, explanation: string}>}
 */
async function recommendProducts({ preferences, availableProducts }) {
  if (!isAvailable()) return { recommendations: [], explanation: '' };

  const client = getClient();
  const model  = process.env.VALENTINA_MODEL || 'claude-sonnet-4-6';

  const prompt = `Un cliente busca: "${preferences}"

Catálogo disponible (JSON):
${JSON.stringify(availableProducts.slice(0, 20), null, 2)}

Devuelve SOLO JSON válido (sin markdown) con este esquema:
{
  "recommendations": [<array de product slugs, máximo 4>],
  "explanation": "<1-2 oraciones explicando por qué estos perfumes>"
}`;

  const response = await client.messages.create({
    model,
    max_tokens: 512,
    system: 'Eres un experto en fragancias. Responde SOLO con JSON válido.',
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = response.content?.[0]?.text?.trim() || '{}';
  try {
    const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
    return JSON.parse(cleaned);
  } catch {
    logger.warn('Valentina: could not parse recommendations JSON', { raw: raw.substring(0, 200) });
    return { recommendations: [], explanation: '' };
  }
}

module.exports = { chat, recommendProducts, isAvailable };
