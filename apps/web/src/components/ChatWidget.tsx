import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

interface Message { role: 'user' | 'assistant'; content: string; ts: number; }

const SESSION_KEY = 'esz_chat_session';
function getChatSession() {
  let s = localStorage.getItem(SESSION_KEY);
  if (!s) { s = crypto.randomUUID(); localStorage.setItem(SESSION_KEY, s); }
  return s;
}

export default function ChatWidget() {
  const [open, setOpen]     = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: 'Hola, soy Valentina, tu asesora de fragancias en Esenzzia. Como puedo ayudarte hoy?',
    ts: Date.now(),
  }]);
  const [input, setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: 'user', content: text, ts: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const r = await fetch('/api/chat/message', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: text,
          sessionId: getChatSession(),
          messages: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await r.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'Disculpa, intenta de nuevo.', ts: Date.now() }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Ups, hubo un error. Intenta de nuevo.', ts: Date.now() }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, token]);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 bg-gold text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-gold-dark transition-colors"
        aria-label="Chat con Valentina"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden" style={{ maxHeight: '70vh' }}>
          {/* Header */}
          <div className="bg-dark px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-white font-serif font-bold text-sm">V</div>
            <div>
              <p className="text-white font-semibold text-sm">Valentina</p>
              <p className="text-gray-400 text-xs">Asesora de fragancias IA</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-cream">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-gold text-white rounded-br-none'
                    : 'bg-white text-dark shadow-sm rounded-bl-none'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-3 rounded-xl shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t p-3 flex gap-2 bg-white">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Escribe aqui..."
              className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gold"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-gold text-white rounded-lg px-3 py-2 disabled:opacity-50 hover:bg-gold-dark transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
