import React, { useState } from 'react';
import { CropData, CropCategory, Language } from '../types';
import { TRANSLATIONS, getCropName } from '../i18n/translations';
import { speakText } from '../utils/speech';
import {
  Search,
  Volume2,
  TrendingUp,
  TrendingDown,
  Bell,
  ArrowRight,
  Filter,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  BarChart3,
} from 'lucide-react';

interface TodayPricesProps {
  crops: CropData[];
  currentLang: Language;
  onSelectCropForSale: (cropId: string) => void;
  onSelectCropForTrend: (cropId: string) => void;
  onSetPriceAlert: (crop: CropData) => void;
  isRealTimeActive: boolean;
  onToggleRealTime: () => void;
  onManualRefresh: () => void;
}

export const TodayPrices: React.FC<TodayPricesProps> = ({
  crops,
  currentLang,
  onSelectCropForSale,
  onSelectCropForTrend,
  onSetPriceAlert,
  isRealTimeActive,
  onToggleRealTime,
  onManualRefresh,
}) => {
  const t = (key: string) => TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS.en[key] || key;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CropCategory>('All');
  const [unitMode, setUnitMode] = useState<'kg' | 'quintal'>('kg');
  const [sortBy, setSortBy] = useState<'price_desc' | 'price_asc' | 'gain' | 'arrivals'>('gain');

  const categories: CropCategory[] = [
    'All',
    'Vegetables',
    'Cereals',
    'Spices',
    'Fruits',
    'Pulses & Oilseeds',
  ];

  const filteredCrops = crops.filter((crop) => {
    const localizedName = getCropName(crop, currentLang).toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      localizedName.includes(query) ||
      crop.name.toLowerCase().includes(query) ||
      crop.mandi.toLowerCase().includes(query) ||
      crop.district.toLowerCase().includes(query);

    const matchesCategory = selectedCategory === 'All' || crop.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Sort crops
  const sortedCrops = [...filteredCrops].sort((a, b) => {
    if (sortBy === 'price_desc') return b.modalPricePerKg - a.modalPricePerKg;
    if (sortBy === 'price_asc') return a.modalPricePerKg - b.modalPricePerKg;
    if (sortBy === 'gain') return b.changePercent - a.changePercent;
    if (sortBy === 'arrivals') return b.arrivalQuintals - a.arrivalQuintals;
    return 0;
  });

  const handleSpeakCrop = (crop: CropData) => {
    const name = getCropName(crop, currentLang);
    const price = unitMode === 'kg' ? `₹${crop.modalPricePerKg} प्रति किलो` : `₹${crop.modalPricePerQuintal} प्रति क्विंटल`;
    const speechText = currentLang === 'hi'
      ? `${name} का भाव ${crop.mandi} में ${price} है। आज का उतार चढ़ाव ${crop.changePercent > 0 ? 'प्लस' : 'माइनस'} ${Math.abs(crop.changePercent)} प्रतिशत है।`
      : currentLang === 'mr'
      ? `${name} चा भाव ${crop.mandi} मध्ये ${price} आहे.`
      : `Today's modal price for ${crop.name} in ${crop.mandi} is ₹${crop.modalPricePerKg} per kg. Daily change is ${crop.changePercent}%.`;
    speakText(speechText, currentLang);
  };

  return (
    <div className="space-y-6">
      {/* Ticker & Real-Time Status Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-2xl p-4 sm:p-5 text-white shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-900/60 rounded-lg">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                {t('live_mandi_pulse')}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1">
              Direct APMC e-NAM synced feeds with 0s latency & instant verified buyer matching
            </p>
          </div>

          {/* Real-time streaming toggle & refresh */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleRealTime}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                isRealTimeActive
                  ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400'
                  : 'bg-stone-800/80 text-stone-300 border-stone-600'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isRealTimeActive ? 'bg-emerald-400 animate-pulse' : 'bg-stone-400'
                }`}
              />
              <span>{isRealTimeActive ? t('realtime_stream') : 'Live Paused'}</span>
            </button>

            <button
              onClick={onManualRefresh}
              aria-label="Refresh price feed"
              className="p-2 rounded-full bg-emerald-900/80 hover:bg-emerald-900 text-emerald-200 hover:text-white transition-colors"
              title="Refresh prices"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Unit toggle: kg vs quintal */}
            <div className="flex bg-emerald-950/80 p-0.5 rounded-lg border border-emerald-700">
              <button
                onClick={() => setUnitMode('kg')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                  unitMode === 'kg' ? 'bg-amber-400 text-stone-950 shadow-xs' : 'text-emerald-200'
                }`}
              >
                ₹/kg
              </button>
              <button
                onClick={() => setUnitMode('quintal')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                  unitMode === 'quintal' ? 'bg-amber-400 text-stone-950 shadow-xs' : 'text-emerald-200'
                }`}
              >
                ₹/q
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search, Filter Bar and Sorting */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search_crop')}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-stone-50/50"
            />
          </div>

          {/* Sort By selector */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-stone-500 hidden sm:block" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="gain">🚀 Highest Daily Gain (%)</option>
              <option value="price_desc">💰 Price: High to Low</option>
              <option value="price_asc">💵 Price: Low to High</option>
              <option value="arrivals">📦 High Mandi Arrivals</option>
            </select>
          </div>
        </div>

        {/* Categories Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat === 'All' ? t('all_categories') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Crop Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedCrops.map((crop) => {
          const isGain = crop.changePercent >= 0;
          const displayPrice = unitMode === 'kg' ? crop.modalPricePerKg : crop.modalPricePerQuintal;
          const displayMin = unitMode === 'kg' ? crop.minPricePerKg : crop.minPricePerKg * 100;
          const displayMax = unitMode === 'kg' ? crop.maxPricePerKg : crop.maxPricePerKg * 100;

          // Estimated middleman price (traditional arhtiya cut ~15-22%)
          const middlemanCutPerKg = Math.round(crop.modalPricePerKg * 0.8 * 10) / 10;
          const extraFarmerGainPerKg = (crop.modalPricePerKg - middlemanCutPerKg).toFixed(1);

          return (
            <div
              key={crop.id}
              className="bg-white rounded-2xl border border-stone-200 hover:border-emerald-400 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              {/* Card Top: Emoji, Title, Mandi, Audio button */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl p-1.5 bg-stone-100 rounded-xl">
                      {crop.emoji}
                    </span>
                    <div>
                      <h3 className="font-bold text-stone-900 text-base flex items-center gap-1.5">
                        {getCropName(crop, currentLang)}
                        <span className="text-xs text-stone-400 font-normal">
                          ({crop.name})
                        </span>
                      </h3>
                      <p className="text-xs text-stone-500 font-medium">
                        📍 {crop.mandi}, {crop.district}
                      </p>
                    </div>
                  </div>

                  {/* Audio listen button */}
                  <button
                    onClick={() => handleSpeakCrop(crop)}
                    aria-label={`Listen to price for ${crop.name}`}
                    className="p-2 rounded-lg text-stone-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                    title={t('listen')}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Main Price & % Change Row */}
                <div className="bg-stone-50/80 rounded-xl p-3 border border-stone-100 my-2">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-stone-500 font-medium block">
                        {t('modal_price')}
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-stone-950 font-sans tracking-tight">
                          ₹{displayPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs font-semibold text-stone-500">
                          /{unitMode === 'kg' ? 'kg' : 'quintal'}
                        </span>
                      </div>
                    </div>

                    {/* Change % badge */}
                    <div
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        isGain
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {isGain ? (
                        <TrendingUp className="w-3.5 h-3.5" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {isGain ? '+' : ''}
                        {crop.changePercent}%
                      </span>
                    </div>
                  </div>

                  {/* Min / Max Range Bar */}
                  <div className="mt-2.5 pt-2 border-t border-stone-200/60 text-[11px] text-stone-500 flex justify-between items-center">
                    <span>Min: ₹{displayMin}</span>
                    <div className="flex-1 mx-2 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(
                              15,
                              ((crop.modalPricePerKg - crop.minPricePerKg) /
                                (crop.maxPricePerKg - crop.minPricePerKg || 1)) *
                                100
                            )
                          )}%`,
                        }}
                      />
                    </div>
                    <span>Max: ₹{displayMax}</span>
                  </div>
                </div>

                {/* Extra Stats: Arrivals & Quality */}
                <div className="flex justify-between items-center text-xs text-stone-600 mb-3 px-1">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {crop.qualityGrade}
                  </span>
                  <span className="font-medium text-stone-500">
                    {t('arrivals')}: <b className="text-stone-800">{crop.arrivalQuintals} q</b>
                  </span>
                </div>

                {/* Direct Farmer Advantage Banner */}
                <div className="bg-amber-50 rounded-lg px-2.5 py-1.5 border border-amber-200/80 mb-3 flex items-center justify-between text-[11px]">
                  <span className="text-amber-800 font-semibold">
                    Direct buyer bonus vs middleman:
                  </span>
                  <span className="bg-amber-200/80 text-amber-950 font-black px-1.5 py-0.5 rounded">
                    +₹{extraFarmerGainPerKg}/kg
                  </span>
                </div>
              </div>

              {/* Action Buttons: Sell, Analyze Trend, Alert */}
              <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectCropForTrend(crop.id)}
                    className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-stone-600" />
                    <span>{t('view_trend')}</span>
                  </button>

                  <button
                    onClick={() => onSetPriceAlert(crop)}
                    className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 transition-colors"
                  >
                    <Bell className="w-3.5 h-3.5 text-amber-700" />
                    <span>Alert</span>
                  </button>
                </div>

                <button
                  onClick={() => onSelectCropForSale(crop.id)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all active:scale-[0.99]"
                >
                  <span>{t('sell_this')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {sortedCrops.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 p-6">
          <p className="text-base font-semibold text-stone-700">No crops found matching "{searchQuery}"</p>
          <p className="text-xs text-stone-500 mt-1">Try searching for Tomato, Onion, Wheat, or reset the category filter.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="mt-4 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
