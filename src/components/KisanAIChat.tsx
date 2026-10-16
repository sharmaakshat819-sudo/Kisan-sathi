import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { speakText } from '../utils/speech';
import {
  Bot,
  Send,
  Volume2,
  Sparkles,
  RefreshCw,
  HelpCircle,
  CheckCircle,
  Lightbulb,
} from 'lucide-react';

interface KisanAIChatProps {
  currentLang: Language;
}

interface Message {
  role: 'user' | 'assistant';
  text: string;
  source?: string;
}

export const KisanAIChat: React.FC<KisanAIChatProps> = ({ currentLang }) => {
  const t = (key: string) => TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS.en[key] || key;

  const defaultGreeting = currentLang === 'hi'
    ? 'राम राम किसान भाई! मैं आपका डिजिटल कृषि विशेषज्ञ हूँ। फसल में रोग, कीटनाशक, खाद की सही मात्रा, मौसम का असर या मंडी में बेचने का सही समय—कुछ भी पूछें।'
    : currentLang === 'mr'
    ? 'नमस्कार शेतकरी मित्र! मी तुमचा डिजिटल कृषी तज्ज्ञ आहे. पिकावरील रोग, औषध फवारणी, हवामानाचा अंदाज किंवा बाजारभाव याबद्दल काहीही विचारा.'
    : 'Namaste Farmer Friend! I am your 24/7 Kisan AI advisor. Ask me anything about crop diseases, pest control, weather precautions, market timing, or government schemes.';

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: defaultGreeting,
      source: 'expert-system',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestedPrompts = [
    {
      title: '🍅 Tomato Blight Treatment',
      prompt: 'My tomato plants have black spots on leaf edges. What organic and chemical spray should I use?',
    },
    {
      title: '🧅 Onion Storage vs Selling',
      prompt: 'Should I sell my red onion in the mandi today or store in ventilated storage for 20 days?',
    },
    {
      title: '🌧️ Heavy Rain Precautions',
      prompt: 'Heavy rain is forecast for tomorrow. What immediate action should I take for standing crops and harvest?',
    },
    {
      title: '🏦 PM-KISAN & KCC Loan',
      prompt: 'How to apply for Kisan Credit Card (KCC) at low interest and check PM-KISAN installment status?',
    },
  ];

  const handleSend = async (customPrompt?: string) => {
    const promptToSend = customPrompt || inputPrompt;
    if (!promptToSend.trim() || loading) return;

    const userMessage: Message = { role: 'user', text: promptToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    setLoading(true);

    try {
      const response = await fetch('/api/kisan-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToSend,
          language: currentLang,
        }),
      });

      if (!response.ok) {
        throw new Error('Network error');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        text: data.reply || 'No response generated.',
        source: data.source,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      // Local expert fallback
      const fallbackText =
        '🌾 **कृषि सलाह (Agri Advisory)**:\n- For standing crops during rain, ensure furrows are clear to prevent water stagnation.\n- To protect against fungal infections, spray Mancozeb 75 WP @ 2g/L or Trichoderma viride organically.\n- Check our Today Prices & Cold Storage tabs to maximize your harvest value!';
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: fallbackText, source: 'offline-knowledge-base' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleListen = (text: string) => {
    // Strip markdown formatting characters for clean speech synthesis
    const clean = text.replace(/[*#_`]/g, '');
    speakText(clean, currentLang);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-indigo-950 rounded-2xl p-4 sm:p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-950/60 rounded-lg">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                {t('kisan_ai_header')}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1">
              {t('kisan_ai_sub')}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-950/80 px-3.5 py-1.5 rounded-xl border border-emerald-700/60 text-xs font-semibold text-emerald-200">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI Model & Agronomy Engine Active</span>
          </div>
        </div>
      </div>

      {/* Suggested Quick Questions */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200">
        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-2">
          💡 Common Farmer Queries (Tap to Ask):
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {suggestedPrompts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(item.prompt)}
              className="p-3 rounded-xl border border-stone-200 hover:border-emerald-500 bg-stone-50/60 hover:bg-emerald-50/50 text-left transition-all text-xs font-semibold text-stone-800 flex flex-col justify-between"
            >
              <span className="font-bold text-stone-900">{item.title}</span>
              <span className="text-[11px] text-stone-500 mt-1 line-clamp-2">
                {item.prompt}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Conversation Box */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col h-[520px]">
        {/* Chat Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/50">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <Bot className="w-4 h-4 text-amber-300" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-emerald-700 text-white rounded-br-xs shadow-xs'
                      : 'bg-white border border-stone-200 text-stone-900 rounded-bl-xs shadow-xs'
                  }`}
                >
                  <p>{msg.text}</p>

                  {!isUser && (
                    <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                      <span>Source: {msg.source || 'Gemini 3.8 Flash'}</span>
                      <button
                        onClick={() => handleListen(msg.text)}
                        aria-label="Listen to advice audio"
                        className="flex items-center gap-1 text-emerald-700 font-bold hover:underline"
                        title="Listen to advice"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{t('listen')}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-stone-500">
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-amber-300 animate-spin" />
              </div>
              <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                <span>Kisan AI is analyzing crop agronomy and mandi intelligence...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Field */}
        <div className="p-3 bg-white border-t border-stone-200 flex items-center gap-2">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('ask_ai_placeholder')}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!inputPrompt.trim() || loading}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm disabled:opacity-40 transition-colors flex items-center gap-1.5"
          >
            <span>{t('send_question')}</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
