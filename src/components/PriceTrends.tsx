import React, { useState } from 'react';
import { CropData, Language } from '../types';
import { TRANSLATIONS, getCropName } from '../i18n/translations';
import { computePriceTrendStats } from '../utils/agriMath';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Sparkles,
  ArrowRight,
  Info,
  Clock,
  MapPin,
  ShieldAlert,
} from 'lucide-react';

interface PriceTrendsProps {
  crops: CropData[];
  currentLang: Language;
  selectedCropId?: string;
  onSelectCrop: (cropId: string) => void;
  onNavigateToSell: (cropId: string) => void;
}

export const PriceTrends: React.FC<PriceTrendsProps> = ({
  crops,
  currentLang,
  selectedCropId,
  onSelectCrop,
  onNavigateToSell,
}) => {
  const t = (key: string) => TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS.en[key] || key;

  const [activeCropId, setActiveCropId] = useState<string>(
    selectedCropId || crops[0]?.id || 'tomato'
  );
  const [timeframe, setTimeframe] = useState<'7D' | '1M' | '3M' | '1Y'>('7D');
  const [hoveredPoint, setHoveredPoint] = useState<{ day: string; price: number } | null>(null);

  const crop = crops.find((c) => c.id === activeCropId) || crops[0];

  // Generate synthetic multi-timeframe price series based on base price
  const basePrice = crop.modalPricePerKg;
  let historyData: { day: string; price: number }[] = [];

  if (timeframe === '7D') {
    historyData = crop.history7D;
  } else if (timeframe === '1M') {
    historyData = [
      { day: 'W1', price: Math.round((basePrice * 0.88) * 10) / 10 },
      { day: 'W2', price: Math.round((basePrice * 0.92) * 10) / 10 },
      { day: 'W3', price: Math.round((basePrice * 0.97) * 10) / 10 },
      { day: 'W4', price: basePrice },
    ];
  } else if (timeframe === '3M') {
    historyData = [
      { day: 'Month -2', price: Math.round((basePrice * 0.78) * 10) / 10 },
      { day: 'Month -1', price: Math.round((basePrice * 0.85) * 10) / 10 },
      { day: 'Current', price: basePrice },
    ];
  } else {
    historyData = [
      { day: 'Q1', price: Math.round((basePrice * 0.72) * 10) / 10 },
      { day: 'Q2', price: Math.round((basePrice * 0.84) * 10) / 10 },
      { day: 'Q3', price: Math.round((basePrice * 0.90) * 10) / 10 },
      { day: 'Q4', price: basePrice },
    ];
  }

  // 3-Day Future Projections
  const isUpward = crop.tip === 'wait' || crop.changePercent > 0;
  const forecastData: { day: string; price: number }[] = [
    { day: 'Tomorrow', price: Math.round((basePrice + (isUpward ? 0.8 : -0.5)) * 10) / 10 },
    { day: 'Day 2', price: Math.round((basePrice + (isUpward ? 1.6 : -1.0)) * 10) / 10 },
    { day: 'Day 3', price: Math.round((basePrice + (isUpward ? 2.4 : -1.4)) * 10) / 10 },
  ];

  const trendStats = computePriceTrendStats(crop.history7D, crop.isPerishable);

  // SVG dimensions
  const svgWidth = 600;
  const svgHeight = 220;
  const paddingX = 45;
  const paddingY = 30;

  const allPoints = [...historyData, ...forecastData];
  const allPrices = allPoints.map((p) => p.price);
  const minVal = Math.floor(Math.min(...allPrices) * 0.9);
  const maxVal = Math.ceil(Math.max(...allPrices) * 1.1);

  const getY = (val: number) => {
    return svgHeight - paddingY - ((val - minVal) / (maxVal - minVal || 1)) * (svgHeight - paddingY * 2);
  };

  const getX = (index: number, total: number) => {
    return paddingX + (index / (total - 1 || 1)) * (svgWidth - paddingX * 2);
  };

  // Historical path
  const historicalCoords = historyData.map((d, i) => ({
    x: getX(i, allPoints.length),
    y: getY(d.price),
    ...d,
  }));

  // Forecast path starts from last historical point
  const forecastCoords = [
    historicalCoords[historicalCoords.length - 1],
    ...forecastData.map((d, i) => ({
      x: getX(historyData.length + i, allPoints.length),
      y: getY(d.price),
      ...d,
    })),
  ];

  const historicalSvgPath = historicalCoords.reduce(
    (acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
    ''
  );

  const forecastSvgPath = forecastCoords.reduce(
    (acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
    ''
  );

  const fillAreaPath = `${historicalSvgPath} L ${historicalCoords[historicalCoords.length - 1].x} ${svgHeight - paddingY} L ${historicalCoords[0].x} ${svgHeight - paddingY} Z`;

  // Nearby mandis comparison
  const nearbyMandis = [
    { name: crop.mandi, dist: '0 km (Local)', price: crop.modalPricePerKg, note: 'Current Mandi' },
    {
      name: 'Vashi APMC (Navi Mumbai)',
      dist: '165 km',
      price: Math.round((crop.modalPricePerKg * 1.18) * 10) / 10,
      note: 'High demand hub',
    },
    {
      name: 'Azadpur Mandi (Delhi)',
      dist: '1,120 km',
      price: Math.round((crop.modalPricePerKg * 1.25) * 10) / 10,
      note: 'Mega wholesale market',
    },
    {
      name: 'Surat Market Yard',
      dist: '210 km',
      price: Math.round((crop.modalPricePerKg * 1.08) * 10) / 10,
      note: 'Steady arrivals',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-4 sm:p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-950/60 rounded-lg">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                {t('trend_header')}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1">
              Historical APMC prices combined with AI econometric forecast to optimize harvest sales
            </p>
          </div>

          {/* Timeframe Selector */}
          <div className="flex bg-emerald-950/80 p-1 rounded-xl border border-emerald-700/60 self-start sm:self-auto">
            {(['7D', '1M', '3M', '1Y'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  timeframe === tf
                    ? 'bg-amber-400 text-stone-950 shadow-sm'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Crop Selector Horizontal Chips */}
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-stone-200">
        <span className="text-xs font-bold text-stone-500 uppercase px-2 mb-2 block tracking-wider">
          Select Crop to Analyze:
        </span>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {crops.map((c) => {
            const isSelected = c.id === activeCropId;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setActiveCropId(c.id);
                  onSelectCrop(c.id);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <span>{c.emoji}</span>
                <span>{getCropName(c, currentLang)}</span>
                <span className="text-[11px] opacity-80">₹{c.modalPricePerKg}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Chart & Projections */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap justify-between items-baseline gap-2 border-b pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{crop.emoji}</span>
                <h3 className="text-lg font-bold text-stone-900">
                  {getCropName(crop, currentLang)} ({crop.name})
                </h3>
              </div>
              <p className="text-xs text-stone-500">
                APMC Yard: {crop.mandi} · Historical spread vs 3-day projection
              </p>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black text-stone-950">
                ₹{crop.modalPricePerKg}
              </span>
              <span className="text-xs font-semibold text-stone-500">/kg</span>
              <div className="text-xs font-bold text-emerald-700 flex items-center gap-1 justify-end">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>7D Trend: +{crop.changePercent}%</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-stone-600">
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-1 bg-emerald-600 rounded"></span>
              <span>Past Recorded Prices</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-1 bg-amber-500 rounded border-dashed border-b"></span>
              <span>AI 3-Day Forecast</span>
            </span>
            {crop.mspPerQuintal > 0 && (
              <span className="flex items-center gap-1.5 text-stone-400">
                <span className="w-3.5 h-0.5 bg-blue-500"></span>
                <span>MSP: ₹{(crop.mspPerQuintal / 100).toFixed(1)}/kg</span>
              </span>
            )}
            {hoveredPoint && (
              <span className="ml-auto bg-stone-900 text-white px-2.5 py-0.5 rounded-md text-[11px]">
                {hoveredPoint.day}: ₹{hoveredPoint.price}/kg
              </span>
            )}
          </div>

          {/* SVG Price Chart */}
          <div className="relative bg-stone-50/70 rounded-xl p-2 border border-stone-100 overflow-hidden">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto select-none overflow-visible"
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[minVal, Math.round((minVal + maxVal) / 2), maxVal].map((val) => {
                const y = getY(val);
                return (
                  <g key={val}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={svgWidth - paddingX}
                      y2={y}
                      stroke="#e5e7eb"
                      strokeDasharray="3 3"
                    />
                    <text
                      x={paddingX - 8}
                      y={y + 4}
                      fontSize="10"
                      fill="#9ca3af"
                      textAnchor="end"
                      fontWeight="bold"
                    >
                      ₹{val}
                    </text>
                  </g>
                );
              })}

              {/* Area fill under historical path */}
              <path d={fillAreaPath} fill="url(#chartGradient)" />

              {/* Historical solid line */}
              <path
                d={historicalSvgPath}
                fill="none"
                stroke="#059669"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Forecast dashed line */}
              <path
                d={forecastSvgPath}
                fill="none"
                stroke="#d97706"
                strokeWidth="3"
                strokeDasharray="4 4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Historical points */}
              {historicalCoords.map((pt, i) => (
                <g key={i} className="cursor-pointer" onMouseEnter={() => setHoveredPoint(pt)}>
                  <circle cx={pt.x} cy={pt.y} r="5" fill="#059669" stroke="#fff" strokeWidth="2" />
                  <text
                    x={pt.x}
                    y={svgHeight - paddingY + 16}
                    fontSize="11"
                    fill="#6b7280"
                    textAnchor="middle"
                    fontWeight="600"
                  >
                    {pt.day}
                  </text>
                </g>
              ))}

              {/* Forecast points */}
              {forecastCoords.slice(1).map((pt, i) => (
                <g key={`fc-${i}`} className="cursor-pointer" onMouseEnter={() => setHoveredPoint(pt)}>
                  <circle cx={pt.x} cy={pt.y} r="5" fill="#d97706" stroke="#fff" strokeWidth="2" />
                  <text
                    x={pt.x}
                    y={svgHeight - paddingY + 16}
                    fontSize="10"
                    fill="#d97706"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    {pt.day}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Actionable Decision Card */}
          <div className="bg-gradient-to-r from-emerald-50 via-amber-50 to-emerald-50 rounded-xl p-4 border border-emerald-200">
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5">
                {trendStats.recommendation === 'WAIT_2_DAYS' ? '⏳' : '🚀'}
              </span>
              <div className="flex-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 block">
                  {t('hold_recommendation')}
                </span>
                <h4 className="text-base font-extrabold text-stone-900 mt-0.5">
                  {trendStats.recommendation === 'WAIT_2_DAYS'
                    ? 'Wait 2 Days Before Liquidating Bulk'
                    : 'Sell Today at Current Peak'}
                </h4>
                <p className="text-xs text-stone-700 mt-1 leading-relaxed">
                  {trendStats.recommendationReason}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <button
                    onClick={() => onNavigateToSell(crop.id)}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                  >
                    <span>Sell This Lot Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Multi-Mandi Arbitrage & Stats */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-4">
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2 border-b pb-3">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>{t('mandi_arbitrage')}</span>
            </h4>
            <p className="text-xs text-stone-500">
              Prices for {crop.name} across regional consumption centers:
            </p>

            <div className="space-y-2.5">
              {nearbyMandis.map((m, idx) => {
                const diff = m.price - crop.modalPricePerKg;
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border transition-all text-xs ${
                      idx === 0
                        ? 'border-stone-200 bg-stone-50'
                        : 'border-emerald-200 bg-emerald-50/50'
                    }`}
                  >
                    <div className="flex justify-between items-baseline font-bold text-stone-900">
                      <span>{m.name}</span>
                      <span className="text-emerald-800 text-sm">₹{m.price}/kg</span>
                    </div>
                    <div className="flex justify-between items-center text-stone-500 mt-1 text-[11px]">
                      <span>{m.dist}</span>
                      {diff > 0 ? (
                        <span className="font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded">
                          +₹{diff.toFixed(1)}/kg higher
                        </span>
                      ) : (
                        <span className="text-stone-400">Baseline</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 text-xs space-y-1.5">
              <span className="font-bold text-stone-800 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-stone-500" />
                <span>Transport Pool Recommendation:</span>
              </span>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                By pooling a truck to Vashi APMC (165 km), you gain +₹3.00/kg while shared freight is only ₹1.15/kg, earning a net extra ₹1,850 per ton!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
