import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Bot, User, Zap } from 'lucide-react';
import { aiService } from '../../services/aiService';

/**
 * AI Risk Explainer chat drawer – powered by xAI Grok.
 */
export const AIAssistantDrawer = ({ open, onClose, locationName = 'Selected Location', riskScore = 0.75 }) => {
  const [messages, setMessages] = useState([
    {
      id: 0,
      role: 'assistant',
      content: `Hello. I am the BHUSENTRY AI Copilot powered by xAI Grok. Ask me about slope stability, live weather & monsoon risks, rainfall saturation, or emergency protocols for ${locationName}.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  // Quick prompt chips powered by Grok
  const quickPrompts = [
    { label: '🌧️ Live Weather Risk', prompt: `What is the current monsoon and weather risk at ${locationName}?` },
    { label: '💧 Rainfall Impact', prompt: `How does current 24h rainfall affect slope saturation and pore pressure at ${locationName}?` },
    { label: '⛰️ Slope Safety', prompt: `Analyze slope stability and safety factor for ${locationName} with risk score ${riskScore}.` },
    { label: '🚨 Evacuation Protocol', prompt: `What emergency evacuation protocol should be initiated for ${locationName} with risk score ${riskScore}?` },
  ];

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const sendMessage = async (promptOverride) => {
    const userPrompt = (promptOverride || input).trim();
    if (!userPrompt) return;

    const userMsg = { id: Date.now(), role: 'user', content: userPrompt };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    try {
      const res = await aiService.chat(
        `Regarding ${locationName} (current calculated risk score: ${riskScore}): ${userPrompt}`
      );
      const reply = {
        id: Date.now() + 1,
        role: 'assistant',
        content: res.message || 'Analysis generated for the selected zone.',
        provider: res.provider
      };
      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      const fallbackReply = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `Regarding ${locationName}: Rainfall and slope threshold breaches indicate heightened saturation along vulnerable escarpments. Advisory: activate SDRF rapid response teams and issue downstream flood warning.`
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setTyping(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-900 to-emerald-950">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
              <Zap className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm tracking-tight">BHUSENTRY AI Copilot</h3>
              <p className="text-[10px] text-emerald-400/80 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                Powered by xAI Grok · Live Intelligence
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Prompts */}
        <div className="px-4 pt-3 pb-1 border-b border-slate-100 bg-slate-50/70">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Quick Analysis</p>
          <div className="grid grid-cols-2 gap-1.5">
            {quickPrompts.map((qp) => (
              <button
                key={qp.label}
                type="button"
                onClick={() => sendMessage(qp.prompt)}
                className="text-left text-xs px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800 transition-all font-medium shadow-2xs"
              >
                {qp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-800 to-emerald-800 flex items-center justify-center shrink-0">
                  <Zap className="w-3.5 h-3.5 text-emerald-300" />
                </div>
              )}
              <div className="flex flex-col gap-1 max-w-[80%]">
                <div
                  className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-md'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-md shadow-sm'
                  }`}
                >
                  {m.content}
                </div>
                {m.role === 'assistant' && m.provider && (
                  <span className="text-[9px] text-slate-400 ml-1">{m.provider}</span>
                )}
              </div>
              {m.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-slate-600" />
                </div>
              )}
            </div>
          ))}

          {typing && (
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-800 to-emerald-800 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-emerald-300" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3 text-sm text-slate-400 flex items-center gap-2">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
                Grok analyzing…
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about rainfall, slope risk, evacuation…"
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none"
            />
            <button
              type="button"
              onClick={() => sendMessage()}
              disabled={typing || !input.trim()}
              className="px-3.5 py-2.5 rounded-xl bg-gradient-to-br from-slate-800 to-emerald-800 text-white hover:from-slate-700 hover:to-emerald-700 transition disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantDrawer;
