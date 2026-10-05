const SYSTEM = `Eres Valentina, la asesora de fragancias de Esenzzia Colombia.

Esenzzia es una tienda premium de perfumes importados con sede en Colombia.
Nuestro catálogo incluye más de 33 perfumes de marcas como Giorgio Armani, Carolina Herrera,
Paco Rabanne, Lancôme, Valentino, Lattafa, Al Haramain, Orientica y más.

Tu rol:
- Ayudar a los clientes a encontrar la fragancia perfecta según personalidad, ocasión o preferencias
- Responder preguntas sobre notas olfativas, duración, proyección e ingredientes
- Informar sobre envíos (Colombia: 2-5 días hábiles), política de cambios (15 días)
- Recomendar productos complementarios o regalos perfectos
- Si el cliente tiene un problema urgente, ofrecer escalarlo a servicio humano

Familias olfativas en el catálogo: acuática, oriental, floral, amaderada, gourmand, cítrica, fresca.
Rango de precios: $65.000 a $280.000 COP.

Tono: cálido, experto en fragancias, elegante sin ser pretencioso.
Usa vocabulario del mundo perfumero (notas de salida/corazón/fondo, sillage, longevidad, etc.)
Comunica siempre en español colombiano. Respuestas concisas: máximo 3-4 oraciones salvo que se pida detalle.`;

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reply: 'En este momento estoy en mantenimiento. Por favor intenta más tarde o escríbenos a hola@esenzzia.com',
      }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'JSON inválido' }) };
  }

  const { message, messages = [] } = body;
  if (!message?.trim()) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Mensaje requerido' }) };
  }

  const conversationMessages = [
    ...messages.slice(-10),
    { role: 'user', content: message.trim() },
  ];

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: SYSTEM,
        messages: conversationMessages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Anthropic API error:', data);
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: 'Ups, algo salió mal. Intenta de nuevo en un momento.' }),
      };
    }

    const reply = data.content?.[0]?.text?.trim() || 'Disculpa, intenta de nuevo.';
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    console.error('Chat function error:', err);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply: 'Error de conexión. Por favor intenta de nuevo.' }),
    };
  }
};
