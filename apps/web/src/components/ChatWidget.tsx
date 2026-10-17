import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Isotipo } from './brand/Logo';

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
    content: 'Hola, soy Valentina, tu asesora de fragancias en Esenzzia. ¿Cómo puedo ayudarte hoy?',
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
      setMessages(prev => [...prev, { role: 'assistant', content: 'Hubo un error. Intenta de nuevo.', ts: Date.now() }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, token]);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 bg-action text-action-on w-14 h-14 rounded-full shadow-hairline flex items-center justify-center hover:bg-action-hover transition-colors"
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
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-surface rounded-xl border border-line flex flex-col overflow-hidden" style={{ maxHeight: '70vh' }}>
          {/* Header */}
          <div data-theme="noir" className="px-4 py-3 flex items-center gap-3 border-b border-line">
            <Isotipo size={32} />
            <div>
              <p className="perfume-name text-perfume-sm">Valentina</p>
              <p className="legal">Asesora de fragancias</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-surface">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-action text-action-on rounded-br-none'
                    : 'bg-surface-alt text-ink border border-line rounded-bl-none'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-surface-alt px-4 py-3 rounded-xl border border-line">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-accent-decor rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-accent-decor rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-accent-decor rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-line p-3 flex gap-2 bg-surface">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Escribe aquí…"
              className="flex-1 text-sm border border-line rounded-lg px-3 py-2 focus:border-accent"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-action text-action-on rounded-lg px-3 py-2 disabled:opacity-50 hover:bg-action-hover transition-colors"
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
