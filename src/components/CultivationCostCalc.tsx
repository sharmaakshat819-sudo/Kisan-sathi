import React, { useState } from 'react';
import { CropData, Language } from '../types';
import { TRANSLATIONS, getCropName } from '../i18n/translations';
import { calculateBreakEven } from '../utils/agriMath';
import {
  Calculator,
  Coins,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface CultivationCostCalcProps {
  crops: CropData[];
  currentLang: Language;
}

export const CultivationCostCalc: React.FC<CultivationCostCalcProps> = ({
  crops,
  currentLang,
}) => {
  const t = (key: string) => TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS.en[key] || key;

  // Presets based on typical 1-acre Indian farming data
  const PRESETS: Record<string, { costs: any; yieldKg: number; defaultPrice: number }> = {
    tomato: {
      costs: { seeds: 3500, fertilizers: 6500, pesticides: 4500, labor: 8000, irrigation: 2500, machinery: 4000, other: 1500 },
      yieldKg: 3500,
      defaultPrice: 16.5,
    },
    onion: {
      costs: { seeds: 4000, fertilizers: 5500, pesticides: 3500, labor: 9000, irrigation: 3000, machinery: 4500, other: 2000 },
      yieldKg: 3200,
      defaultPrice: 24.0,
    },
    wheat: {
      costs: { seeds: 2200, fertilizers: 4800, pesticides: 1200, labor: 4500, irrigation: 2800, machinery: 3800, other: 1200 },
      yieldKg: 2000,
      defaultPrice: 29.5,
    },
    potato: {
      costs: { seeds: 8000, fertilizers: 6000, pesticides: 3000, labor: 6500, irrigation: 2500, machinery: 5000, other: 2000 },
      yieldKg: 4000,
      defaultPrice: 18.2,
    },
  };

  const [activeCropPreset, setActiveCropPreset] = useState<string>('tomato');
  const [seedsCost, setSeedsCost] = useState<number>(PRESETS.tomato.costs.seeds);
  const [fertilizerCost, setFertilizerCost] = useState<number>(PRESETS.tomato.costs.fertilizers);
  const [pesticideCost, setPesticideCost] = useState<number>(PRESETS.tomato.costs.pesticides);
  const [laborCost, setLaborCost] = useState<number>(PRESETS.tomato.costs.labor);
  const [irrigationCost, setIrrigationCost] = useState<number>(PRESETS.tomato.costs.irrigation);
  const [machineryCost, setMachineryCost] = useState<number>(PRESETS.tomato.costs.machinery);
  const [otherCost, setOtherCost] = useState<number>(PRESETS.tomato.costs.other);

  const [expectedYieldKg, setExpectedYieldKg] = useState<number>(PRESETS.tomato.yieldKg);
  const [marketPricePerKg, setMarketPricePerKg] = useState<number>(PRESETS.tomato.defaultPrice);

  const handleApplyPreset = (key: string) => {
    setActiveCropPreset(key);
    const p = PRESETS[key];
    if (p) {
      setSeedsCost(p.costs.seeds);
      setFertilizerCost(p.costs.fertilizers);
      setPesticideCost(p.costs.pesticides);
      setLaborCost(p.costs.labor);
      setIrrigationCost(p.costs.irrigation);
      setMachineryCost(p.costs.machinery);
      setOtherCost(p.costs.other);
      setExpectedYieldKg(p.yieldKg);
      setMarketPricePerKg(p.defaultPrice);
    }
  };

  const result = calculateBreakEven(
    {
      seeds: seedsCost,
      fertilizers: fertilizerCost,
      pesticides: pesticideCost,
      labor: laborCost,
      irrigation: irrigationCost,
      machinery: machineryCost,
      other: otherCost,
    },
    expectedYieldKg,
    marketPricePerKg
  );

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-stone-800 to-green-950 rounded-2xl p-4 sm:p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-950/60 rounded-lg">
                <Calculator className="w-5 h-5 text-amber-300" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                {t('calc_header')}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1">
              {t('calc_sub')}
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-700 text-xs font-bold text-amber-300">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>Guaranteed Margin Protection</span>
          </div>
        </div>
      </div>

      {/* 1-Click ICAR Benchmark Presets */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
            ⚡ 1-Click Standard Cost Presets (1 Acre Benchmark):
          </span>
          <span className="text-[11px] text-stone-400 hidden sm:inline">
            Editable for your local conditions
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {Object.keys(PRESETS).map((key) => {
            const crop = crops.find((c) => c.id === key);
            const isSelected = activeCropPreset === key;
            return (
              <button
                key={key}
                onClick={() => handleApplyPreset(key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <span>{crop?.emoji || '🌱'}</span>
                <span>{crop ? getCropName(crop, currentLang) : key}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Cost Item Inputs */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-stone-900 text-base border-b pb-2">
            1. Production & Operational Expenses (₹ per Acre)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {t('seeds_cost')}
              </label>
              <input
                type="number"
                step="100"
                value={seedsCost}
                onChange={(e) => setSeedsCost(Number(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {t('fertilizer_cost')}
              </label>
              <input
                type="number"
                step="100"
                value={fertilizerCost}
                onChange={(e) => setFertilizerCost(Number(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {t('pesticide_cost')}
              </label>
              <input
                type="number"
                step="100"
                value={pesticideCost}
                onChange={(e) => setPesticideCost(Number(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {t('labor_cost')}
              </label>
              <input
                type="number"
                step="100"
                value={laborCost}
                onChange={(e) => setLaborCost(Number(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {t('irrigation_cost')}
              </label>
              <input
                type="number"
                step="100"
                value={irrigationCost}
                onChange={(e) => setIrrigationCost(Number(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {t('machinery_cost')}
              </label>
              <input
                type="number"
                step="100"
                value={machineryCost}
                onChange={(e) => setMachineryCost(Number(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {t('other_cost')}
              </label>
              <input
                type="number"
                step="100"
                value={otherCost}
                onChange={(e) => setOtherCost(Number(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-bold"
              />
            </div>
          </div>

          <h3 className="font-bold text-stone-900 text-base border-b pb-2 pt-2">
            2. Harvest Yield & Mandi Price Comparison
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {t('expected_yield')}
              </label>
              <input
                type="number"
                step="100"
                value={expectedYieldKg}
                onChange={(e) => setExpectedYieldKg(Number(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-base font-black text-stone-900"
              />
              <span className="text-[11px] text-stone-500 mt-0.5 block">
                = {(expectedYieldKg / 100).toFixed(1)} Quintals
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {t('current_selling_price')}
              </label>
              <input
                type="number"
                step="0.5"
                value={marketPricePerKg}
                onChange={(e) => setMarketPricePerKg(Number(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-base font-black text-emerald-800"
              />
              <span className="text-[11px] text-stone-500 mt-0.5 block">
                = ₹{(marketPricePerKg * 100).toFixed(0)} per Quintal
              </span>
            </div>
          </div>
        </div>

        {/* Right Col: Break-Even & Profitability Summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-4">
            <h4 className="font-bold text-stone-900 text-base border-b pb-3 flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-500" />
              <span>Break-Even & Profit Summary</span>
            </h4>

            {/* Total Cultivation Cost */}
            <div className="bg-stone-50 rounded-xl p-3 border border-stone-200/80 space-y-1">
              <span className="text-xs text-stone-500 font-semibold block">
                {t('total_cost')}:
              </span>
              <div className="text-2xl font-black text-stone-900">
                ₹{result.totalCost.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Break-Even Price Highlight (Minimum Selling Price!) */}
            <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-300 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 uppercase">
                  ⭐ Your Break-Even Threshold:
                </span>
                <span className="text-[10px] bg-amber-200 text-amber-950 font-bold px-1.5 py-0.2 rounded">
                  Do not sell below this!
                </span>
              </div>
              <div className="text-3xl font-black text-amber-950 mt-1">
                ₹{result.costPerKg} <span className="text-xs font-normal">/kg</span>
              </div>
              <p className="text-[11px] text-amber-800 mt-1">
                Equal to <b>₹{result.costPerQuintal.toLocaleString('en-IN')} per quintal</b>. Any bid higher than this guarantees pure profit!
              </p>
            </div>

            {/* Market Profit Calculation */}
            <div
              className={`rounded-xl p-4 border space-y-2 ${
                result.isProfitable
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-red-50 border-red-300 text-red-950'
              }`}
            >
              <div className="flex items-center gap-2">
                {result.isProfitable ? (
                  <CheckCircle className="w-5 h-5 text-emerald-700" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-700" />
                )}
                <span className="text-xs font-bold uppercase tracking-wider">
                  {result.isProfitable ? 'Profitable Harvest' : 'At Risk of Loss'}
                </span>
              </div>

              <div className="flex justify-between text-xs">
                <span>Estimated Market Revenue:</span>
                <span className="font-bold">₹{result.revenueAtMarketPrice.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-xs">
                <span>Total Investment:</span>
                <span className="font-bold">-₹{result.totalCost.toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-2 border-t border-emerald-200/80 flex justify-between items-baseline">
                <span className="text-xs font-bold">{t('net_profit_est')}:</span>
                <span className="text-2xl font-black">
                  {result.netProfit >= 0 ? '+' : ''}₹{result.netProfit.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="text-right text-xs font-bold">
                Margin: {result.profitMarginPercent}%
              </div>
            </div>

            <div className="text-[11px] text-stone-500 leading-relaxed bg-stone-50 p-2.5 rounded-xl border">
              💡 <b>Tip:</b> If current mandi price is near or below your break-even of ₹{result.costPerKg}/kg, do not sell in distress. Check our <b>Cold Storage Locator</b> to hold produce for 2-3 weeks until market recovers!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
