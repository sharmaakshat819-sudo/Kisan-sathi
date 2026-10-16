import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { Bell, Volume2, PhoneCall, Radio, Sparkles } from 'lucide-react';
import { speakText } from '../utils/speech';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  unreadAlertsCount: number;
  onOpenAlerts: () => void;
  onOpenAi: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  unreadAlertsCount,
  onOpenAlerts,
  onOpenAi,
}) => {
  const t = (key: string) => TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS.en[key] || key;

  const languages: { code: Language; label: string; sub: string }[] = [
    { code: 'en', label: 'EN', sub: 'English' },
    { code: 'hi', label: 'हिंदी', sub: 'Hindi' },
    { code: 'mr', label: 'मराठी', sub: 'Marathi' },
    { code: 'pa', label: 'PA ਪੰਜਾਬੀ', sub: 'Punjabi' },
    { code: 'gu', label: 'GU ગુજરાતી', sub: 'Gujarati' },
    { code: 'te', label: 'TE తెలుగు', sub: 'Telugu' },
  ];

  const handleSpeakWelcome = () => {
    const text = currentLang === 'hi'
      ? 'किसान साथी में आपका स्वागत है। आज के लाइव मंडी भाव, फसल बिक्री और मौसम जानकारी उपलब्ध है।'
      : currentLang === 'mr'
      ? 'किसान साथी मध्ये आपले स्वागत आहे. आजचे थेट बाजारभाव आणि पीक विक्री सेवा उपलब्ध आहे.'
      : 'Welcome to Kisan Saathi. Real-time crop prices, selling platform and weather warnings are active.';
    speakText(text, currentLang);
  };

  return (
    <header className="sticky top-0 z-40 bg-emerald-900 text-white shadow-md border-b border-emerald-800">
      {/* Top Banner: Real-time Live Mandi Pulse & Helpline */}
      <div className="bg-emerald-950/80 px-4 py-1.5 text-xs flex flex-wrap justify-between items-center border-b border-emerald-800/60 gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-medium text-emerald-200 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            148 Mandis Connected · Real-time Ticker
          </span>
        </div>

        <div className="flex items-center gap-4 text-emerald-200">
          <a
            href="tel:18001801551"
            className="flex items-center gap-1.5 hover:text-white transition-colors bg-emerald-900/90 px-2 py-0.5 rounded-full border border-emerald-700/50"
            title="Kisan Call Centre Toll-Free"
          >
            <PhoneCall className="w-3 h-3 text-amber-400" />
            <span className="font-semibold text-amber-300">1800-180-1551</span>
            <span className="text-[10px] text-emerald-300 hidden sm:inline">(Free Helpline)</span>
          </a>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-emerald-500 flex items-center justify-center text-2xl shadow-inner border border-emerald-300/30">
            🌾
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight font-serif text-white flex items-center gap-1.5">
                {t('app_title')}
              </h1>
              <span className="bg-amber-400 text-stone-900 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs">
                Mandi 2.0
              </span>
            </div>
            <p className="text-xs text-emerald-200/90 font-medium hidden sm:block">
              {t('app_tagline')}
            </p>
          </div>
        </div>

        {/* Action Controls: Audio Assistant, Kisan AI, Alerts, Language */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Welcome voice readout */}
          <button
            onClick={handleSpeakWelcome}
            aria-label="Listen to audio overview"
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-emerald-100 flex items-center gap-1.5 text-xs font-semibold border border-emerald-700 transition-all shadow-xs"
            title="Listen in your language"
          >
            <Volume2 className="w-4 h-4 text-amber-300" />
            <span className="hidden md:inline">{t('listen')}</span>
          </button>

          {/* Quick AI button */}
          <button
            onClick={onOpenAi}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold flex items-center gap-1.5 text-xs shadow-md transition-transform active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-stone-950 fill-stone-950" />
            <span className="hidden sm:inline">Kisan AI</span>
          </button>

          {/* Price Notifications Bell */}
          <button
            onClick={onOpenAlerts}
            aria-label="View price alerts and notifications"
            className="relative p-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white border border-emerald-700 transition-all"
            title="Price Alerts & Warnings"
          >
            <Bell className="w-4 h-4 text-emerald-200" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-pulse border-2 border-emerald-900">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* Multilingual Selector */}
          <div className="flex items-center bg-emerald-950/90 rounded-xl p-1 border border-emerald-700/80">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => onLanguageChange(l.code)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentLang === l.code
                    ? 'bg-amber-400 text-stone-950 shadow-sm'
                    : 'text-emerald-200 hover:text-white hover:bg-emerald-900/60'
                }`}
                title={l.sub}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
