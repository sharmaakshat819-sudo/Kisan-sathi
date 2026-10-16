/**
 * AgriMath - Pure calculation utilities for agricultural decision-making
 */

export interface CultivationCostInput {
  seeds: number;
  fertilizers: number;
  pesticides: number;
  labor: number;
  irrigation: number;
  machinery: number;
  other: number;
}

export interface BreakEvenResult {
  totalCost: number;
  costPerKg: number;
  costPerQuintal: number;
  revenueAtMarketPrice: number;
  netProfit: number;
  profitMarginPercent: number;
  isProfitable: boolean;
}

export function calculateBreakEven(
  costs: CultivationCostInput,
  yieldKg: number,
  currentMarketPricePerKg: number
): BreakEvenResult {
  const totalCost =
    (costs.seeds || 0) +
    (costs.fertilizers || 0) +
    (costs.pesticides || 0) +
    (costs.labor || 0) +
    (costs.irrigation || 0) +
    (costs.machinery || 0) +
    (costs.other || 0);

  const safeYield = Math.max(1, yieldKg || 1);
  const costPerKg = Number((totalCost / safeYield).toFixed(2));
  const costPerQuintal = Number((costPerKg * 100).toFixed(2));
  
  const revenueAtMarketPrice = safeYield * currentMarketPricePerKg;
  const netProfit = revenueAtMarketPrice - totalCost;
  const profitMarginPercent = totalCost > 0 
    ? Number(((netProfit / totalCost) * 100).toFixed(1))
    : 0;

  return {
    totalCost,
    costPerKg,
    costPerQuintal,
    revenueAtMarketPrice,
    netProfit,
    profitMarginPercent,
    isProfitable: netProfit >= 0,
  };
}

export interface ColdStorageROIInput {
  quantityKg: number;
  currentPricePerKg: number;
  expectedFuturePricePerKg: number;
  storageDays: number;
  dailyRatePerKg: number;
  handlingCostPerKg?: number;
}

export interface ColdStorageROIResult {
  currentGrossRevenue: number;
  futureGrossRevenue: number;
  totalStorageCost: number;
  netFutureRevenue: number;
  netGainOverSellingToday: number;
  recommendStorage: boolean;
  roiPercent: number;
}

export function calculateColdStorageROI(input: ColdStorageROIInput): ColdStorageROIResult {
  const {
    quantityKg,
    currentPricePerKg,
    expectedFuturePricePerKg,
    storageDays,
    dailyRatePerKg,
    handlingCostPerKg = 0.05,
  } = input;

  const currentGrossRevenue = quantityKg * currentPricePerKg;
  const futureGrossRevenue = quantityKg * expectedFuturePricePerKg;

  const storageFee = quantityKg * dailyRatePerKg * storageDays;
  const handlingFee = quantityKg * handlingCostPerKg;
  const totalStorageCost = storageFee + handlingFee;

  const netFutureRevenue = futureGrossRevenue - totalStorageCost;
  const netGainOverSellingToday = netFutureRevenue - currentGrossRevenue;
  const recommendStorage = netGainOverSellingToday > 0;
  
  const roiPercent = totalStorageCost > 0
    ? Number(((netGainOverSellingToday / totalStorageCost) * 100).toFixed(1))
    : 0;

  return {
    currentGrossRevenue: Math.round(currentGrossRevenue),
    futureGrossRevenue: Math.round(futureGrossRevenue),
    totalStorageCost: Math.round(totalStorageCost),
    netFutureRevenue: Math.round(netFutureRevenue),
    netGainOverSellingToday: Math.round(netGainOverSellingToday),
    recommendStorage,
    roiPercent,
  };
}

export interface TransportPoolSavingsInput {
  soloFreightCostTotal: number;
  sharedFreightRatePerKg: number;
  cropWeightKg: number;
}

export interface TransportPoolSavingsResult {
  soloCostForWeight: number;
  sharedCost: number;
  totalSaved: number;
  savingsPercent: number;
}

export function calculateTransportPoolSavings(
  input: TransportPoolSavingsInput
): TransportPoolSavingsResult {
  const { soloFreightCostTotal, sharedFreightRatePerKg, cropWeightKg } = input;
  
  const soloCost = soloFreightCostTotal;
  const sharedCost = Math.round(cropWeightKg * sharedFreightRatePerKg);
  const totalSaved = Math.max(0, soloCost - sharedCost);
  const savingsPercent = soloCost > 0 
    ? Math.round((totalSaved / soloCost) * 100) 
    : 0;

  return {
    soloCostForWeight: soloCost,
    sharedCost,
    totalSaved,
    savingsPercent,
  };
}

export interface TrendAnalysisResult {
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  percentChange7d: number;
  volatility: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendation: 'SELL_TODAY' | 'WAIT_2_DAYS' | 'STORE_COLD';
  recommendationReason: string;
}

export function computePriceTrendStats(
  history: { day: string; price: number }[],
  isPerishable: boolean = false
): TrendAnalysisResult {
  if (!history || history.length === 0) {
    return {
      minPrice: 0,
      maxPrice: 0,
      avgPrice: 0,
      percentChange7d: 0,
      volatility: 'LOW',
      recommendation: 'SELL_TODAY',
      recommendationReason: 'No data',
    };
  }

  const prices = history.map(h => h.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);

  const firstPrice = prices[0];
  const lastPrice = prices[prices.length - 1];
  const percentChange7d = firstPrice > 0 
    ? Number((((lastPrice - firstPrice) / firstPrice) * 100).toFixed(1))
    : 0;

  const spread = maxPrice - minPrice;
  const volatility: 'LOW' | 'MEDIUM' | 'HIGH' =
    spread / (avgPrice || 1) > 0.25 ? 'HIGH' : spread / (avgPrice || 1) > 0.1 ? 'MEDIUM' : 'LOW';

  let recommendation: 'SELL_TODAY' | 'WAIT_2_DAYS' | 'STORE_COLD';
  let recommendationReason = '';

  if (isPerishable) {
    if (percentChange7d >= 8) {
      recommendation = 'SELL_TODAY';
      recommendationReason = 'High perishability crop with peak price. Lock in profit today.';
    } else if (percentChange7d <= -5) {
      recommendation = 'STORE_COLD';
      recommendationReason = 'Price crashed. Move to cold storage if available to avoid distress loss.';
    } else {
      recommendation = 'SELL_TODAY';
      recommendationReason = 'Stable price. Prompt disposal recommended before moisture loss.';
    }
  } else {
    if (percentChange7d > 5) {
      recommendation = 'WAIT_2_DAYS';
      recommendationReason = 'Strong upward price momentum. High probability of higher bids in 48-72 hours.';
    } else if (percentChange7d < -4) {
      recommendation = 'STORE_COLD';
      recommendationReason = 'Market experiencing temporary arrival glut. Storing for 20 days advised.';
    } else {
      recommendation = 'SELL_TODAY';
      recommendationReason = 'Steady fair price above regional MSP. Good time for liquidation.';
    }
  }

  return {
    minPrice,
    maxPrice,
    avgPrice,
    percentChange7d,
    volatility,
    recommendation,
    recommendationReason,
  };
}
