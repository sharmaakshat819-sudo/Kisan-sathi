import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBreakEven,
  calculateColdStorageROI,
  calculateTransportPoolSavings,
  computePriceTrendStats,
} from './agriMath.ts';

test('calculateBreakEven computes accurate cost per kg and profit', () => {
  const costs = {
    seeds: 2000,
    fertilizers: 4000,
    pesticides: 1500,
    labor: 5000,
    irrigation: 1500,
    machinery: 3000,
    other: 1000,
  }; // Total: 18,000

  const yieldKg = 1500; // 15 quintals
  const marketPrice = 20; // ₹20/kg -> ₹30,000 revenue

  const result = calculateBreakEven(costs, yieldKg, marketPrice);
  assert.equal(result.totalCost, 18000);
  assert.equal(result.costPerKg, 12);
  assert.equal(result.costPerQuintal, 1200);
  assert.equal(result.revenueAtMarketPrice, 30000);
  assert.equal(result.netProfit, 12000);
  assert.equal(result.isProfitable, true);
});

test('calculateColdStorageROI evaluates storage profitability correctly', () => {
  // Storing 1,000 kg for 30 days
  // Current: ₹15/kg = ₹15,000
  // Future: ₹22/kg = ₹22,000
  // Daily storage rate: ₹0.05/kg/day * 30 days = ₹1.50/kg -> ₹1,500 + ₹50 handling = ₹1,550
  // Net future: ₹20,450 -> Gain: ₹5,450
  const result = calculateColdStorageROI({
    quantityKg: 1000,
    currentPricePerKg: 15,
    expectedFuturePricePerKg: 22,
    storageDays: 30,
    dailyRatePerKg: 0.05,
    handlingCostPerKg: 0.05,
  });

  assert.equal(result.currentGrossRevenue, 15000);
  assert.equal(result.futureGrossRevenue, 22000);
  assert.equal(result.totalStorageCost, 1550);
  assert.equal(result.netGainOverSellingToday, 5450);
  assert.equal(result.recommendStorage, true);
});

test('calculateTransportPoolSavings gives positive savings for pooled vehicle', () => {
  // Solo cost: ₹2,400 to rent entire tempo
  // Farmer only has 400 kg at ₹1.5/kg shared rate = ₹600
  const result = calculateTransportPoolSavings({
    soloFreightCostTotal: 2400,
    sharedFreightRatePerKg: 1.5,
    cropWeightKg: 400,
  });

  assert.equal(result.soloCostForWeight, 2400);
  assert.equal(result.sharedCost, 600);
  assert.equal(result.totalSaved, 1800);
  assert.equal(result.savingsPercent, 75);
});

test('computePriceTrendStats flags upward momentum', () => {
  const history = [
    { day: 'Day 1', price: 20 },
    { day: 'Day 2', price: 21 },
    { day: 'Day 3', price: 22 },
    { day: 'Day 4', price: 22 },
    { day: 'Day 5', price: 23 },
    { day: 'Day 6', price: 24 },
    { day: 'Day 7', price: 25 },
  ];

  const stats = computePriceTrendStats(history, false);
  assert.equal(stats.minPrice, 20);
  assert.equal(stats.maxPrice, 25);
  assert.equal(stats.percentChange7d > 0, true);
  assert.equal(stats.recommendation, 'WAIT_2_DAYS');
});
