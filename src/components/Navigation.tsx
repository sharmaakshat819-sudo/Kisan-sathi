import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import {
  TrendingUp,
  Tag,
  LineChart,
  CloudSunRain,
  Truck,
  Warehouse,
  Calculator,
  MessageSquare,
  Bot,
} from 'lucide-react';

export type ActiveTab =
  | 'prices'
  | 'sell'
  | 'trends'
  | 'weather'
  | 'transport'
  | 'storage'
  | 'calc'
  | 'messages'
  | 'ai';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  currentLang: Language;
  unreadMessagesCount: number;
  activeBidsCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  currentLang,
  unreadMessagesCount,
  activeBidsCount,
}) => {
  const t = (key: string) => TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS.en[key] || key;

  const tabs: { id: ActiveTab; labelKey: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'prices', labelKey: 'nav_prices', icon: <Tag className="w-4 h-4" /> },
    {
      id: 'sell',
      labelKey: 'nav_sell',
      icon: <TrendingUp className="w-4 h-4" />,
      badge: activeBidsCount > 0 ? activeBidsCount : undefined,
    },
    { id: 'trends', labelKey: 'nav_trends', icon: <LineChart className="w-4 h-4" /> },
    { id: 'weather', labelKey: 'nav_weather', icon: <CloudSunRain className="w-4 h-4" /> },
    { id: 'transport', labelKey: 'nav_transport', icon: <Truck className="w-4 h-4" /> },
    { id: 'storage', labelKey: 'nav_storage', icon: <Warehouse className="w-4 h-4" /> },
    { id: 'calc', labelKey: 'nav_calc', icon: <Calculator className="w-4 h-4" /> },
    {
      id: 'messages',
      labelKey: 'nav_messages',
      icon: <MessageSquare className="w-4 h-4" />,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
    },
    { id: 'ai', labelKey: 'nav_ai', icon: <Bot className="w-4 h-4" /> },
  ];

  return (
    <nav className="bg-stone-900 text-stone-200 border-b border-stone-800 shadow-sm sticky top-[80px] sm:top-[74px] z-30">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        {/* Horizontal scrollable tab strip */}
        <div className="flex space-x-1 overflow-x-auto py-2 scrollbar-none items-center">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                {tab.icon}
                <span>{t(tab.labelKey)}</span>
                {tab.badge && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-400 text-stone-950">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
