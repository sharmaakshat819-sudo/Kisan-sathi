import React, { useState } from 'react';
import { ColdStorageFacility, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { calculateColdStorageROI } from '../utils/agriMath';
import {
  Warehouse,
  MapPin,
  Thermometer,
  ShieldCheck,
  Calendar,
  CheckCircle,
  PhoneCall,
  ExternalLink,
  Calculator,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface ColdStorageLocatorProps {
  facilities: ColdStorageFacility[];
  currentLang: Language;
}

export const ColdStorageLocator: React.FC<ColdStorageLocatorProps> = ({
  facilities,
  currentLang,
}) => {
  const t = (key: string) => TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS.en[key] || key;

  // Distress-Sale ROI Calculator State
  const [calcQuantity, setCalcQuantity] = useState<number>(2000);
  const [calcCurrentPrice, setCalcCurrentPrice] = useState<number>(14);
  const [calcFuturePrice, setCalcFuturePrice] = useState<number>(22);
  const [calcDays, setCalcDays] = useState<number>(30);
  const [calcRatePerDay, setCalcRatePerDay] = useState<number>(0.04);

  // Reservation Modal State
  const [selectedFacility, setSelectedFacility] = useState<ColdStorageFacility | null>(null);
  const [bookingKg, setBookingKg] = useState<number>(1000);
  const [bookingCrop, setBookingCrop] = useState<string>('Potato');
  const [bookingFarmerName, setBookingFarmerName] = useState<string>('Ramesh Patil');
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);

  const roiResult = calculateColdStorageROI({
    quantityKg: calcQuantity,
    currentPricePerKg: calcCurrentPrice,
    expectedFuturePricePerKg: calcFuturePrice,
    storageDays: calcDays,
    dailyRatePerKg: calcRatePerDay,
  });

  const handleBookSlot = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingConfirmed(true);
    setTimeout(() => {
      setBookingConfirmed(false);
      setSelectedFacility(null);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-emerald-900 rounded-2xl p-4 sm:p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-950/60 rounded-lg">
                <Warehouse className="w-5 h-5 text-cyan-300" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                {t('storage_header')}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-cyan-100 mt-1">
              {t('storage_desc')}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-blue-950/80 px-3.5 py-1.5 rounded-xl border border-cyan-500/40 text-xs font-semibold text-cyan-200">
            <Thermometer className="w-4 h-4 text-cyan-400" />
            <span>Real-time Chamber Monitoring Active</span>
          </div>
        </div>
      </div>

      {/* Two Columns: Facility Cards & Interactive Distress Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Real-time Facility List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-stone-900 text-base sm:text-lg">
              Verified Cold Stores with Live Vacancy
            </h3>
            <span className="text-xs text-stone-500 font-medium">Sorted by nearest proximity</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {facilities.map((fac) => {
              const freePercent = Math.round((fac.availableCapacityMT / fac.totalCapacityMT) * 100);
              const isUrgent = freePercent < 20;

              return (
                <div
                  key={fac.id}
                  className="bg-white rounded-2xl border border-stone-200 hover:border-blue-400 p-4 shadow-sm flex flex-col justify-between space-y-3 transition-all"
                >
                  <div>
                    {/* Header: Name, Distance, Verified */}
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                            {fac.type}
                          </span>
                          {fac.verified && (
                            <span className="flex items-center gap-0.5 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-bold">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              Govt Certified
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-stone-900 text-sm mt-1">{fac.name}</h4>
                        <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                          <span>{fac.address}</span>
                        </p>
                      </div>

                      <span className="text-xs font-extrabold text-blue-800 bg-blue-50 px-2 py-1 rounded-lg shrink-0">
                        {fac.distanceKm} km
                      </span>
                    </div>

                    {/* Capacity Progress Bar */}
                    <div className="bg-stone-50 rounded-xl p-3 my-3 border border-stone-100 space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-stone-500 font-medium">Available Space:</span>
                        <span className="font-bold text-stone-900">
                          {fac.availableCapacityMT} MT / {fac.totalCapacityMT} MT ({freePercent}% free)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isUrgent ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${100 - freePercent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-stone-400">
                        <span>Chamber Temp: <b className="text-stone-700">{fac.temperatureRange}</b></span>
                        <span>RH: <b className="text-stone-700">{fac.humidityRange}</b></span>
                      </div>
                    </div>

                    {/* Suitable crops & rates */}
                    <div className="text-xs space-y-1 text-stone-600 px-1">
                      <div className="flex justify-between">
                        <span className="text-stone-500">Rental Rate:</span>
                        <span className="font-bold text-stone-900">
                          ₹{fac.dailyRatePerKg}/kg/day (or ₹{fac.monthlyRatePerBag}/bag/mo)
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {fac.suitableCrops.map((c) => (
                          <span
                            key={c}
                            className="bg-stone-100 text-stone-700 text-[10px] px-2 py-0.5 rounded-md"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions: Direct Book & Google Maps */}
                  <div className="pt-2 border-t border-stone-100 flex gap-2">
                    <button
                      onClick={() => setSelectedFacility(fac)}
                      className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{t('book_chamber')}</span>
                    </button>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        fac.name + ' ' + fac.address
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors flex items-center gap-1"
                      title="Open in Maps"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Maps</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Distress-Sale Avoidance Calculator */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b pb-3">
              <Calculator className="w-5 h-5 text-blue-700" />
              <div>
                <h4 className="font-bold text-stone-900 text-sm">
                  {t('calc_storage_roi')}
                </h4>
                <p className="text-[11px] text-stone-500">
                  Calculate net profit gained by avoiding distress sales
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-600 font-semibold mb-1">
                  Crop Quantity to Store (kg):
                </label>
                <input
                  type="number"
                  step="100"
                  value={calcQuantity}
                  onChange={(e) => setCalcQuantity(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">
                    Today's Distress Price (₹/kg):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={calcCurrentPrice}
                    onChange={(e) => setCalcCurrentPrice(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 font-semibold mb-1">
                    Expected Future Rate (₹/kg):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={calcFuturePrice}
                    onChange={(e) => setCalcFuturePrice(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-bold text-emerald-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">
                    Storage Duration (Days):
                  </label>
                  <input
                    type="number"
                    value={calcDays}
                    onChange={(e) => setCalcDays(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 font-semibold mb-1">
                    Rent Rate (₹/kg/day):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={calcRatePerDay}
                    onChange={(e) => setCalcRatePerDay(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Result Box */}
            <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl p-4 border border-blue-200 space-y-2">
              <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block">
                Financial Evaluation:
              </span>

              <div className="flex justify-between text-xs text-stone-600">
                <span>Revenue if Sold Today:</span>
                <span className="font-semibold text-stone-800">
                  ₹{roiResult.currentGrossRevenue.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between text-xs text-stone-600">
                <span>Total Storage + Handling Fee:</span>
                <span className="font-semibold text-stone-800">
                  -₹{roiResult.totalStorageCost.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between text-xs text-stone-600">
                <span>Net Future Revenue:</span>
                <span className="font-semibold text-emerald-800">
                  ₹{roiResult.netFutureRevenue.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="pt-2 border-t border-blue-200/80 flex items-baseline justify-between">
                <span className="text-xs font-bold text-stone-800">Extra Net Gain:</span>
                <span className="text-xl font-black text-emerald-700">
                  +₹{roiResult.netGainOverSellingToday.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="mt-2 text-[11px] text-emerald-800 font-bold bg-emerald-100/70 p-2 rounded-lg flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  {roiResult.recommendStorage
                    ? `Highly Recommended! Storing generates ${roiResult.roiPercent}% net return on storage fees.`
                    : 'Selling today is better due to tight future spread.'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Slot Modal */}
      {selectedFacility && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Warehouse className="w-5 h-5 text-blue-700" />
              <span>Reserve Cold Chamber Slot</span>
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Facility: <b className="text-stone-800">{selectedFacility.name}</b>
            </p>

            {bookingConfirmed ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-stone-900">Chamber Slot Reserved!</h4>
                <p className="text-xs text-stone-600">
                  Booking Reference #CS-89241. The manager will call you at your number to guide truck arrival.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookSlot} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={bookingFarmerName}
                    onChange={(e) => setBookingFarmerName(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Crop Type
                    </label>
                    <select
                      value={bookingCrop}
                      onChange={(e) => setBookingCrop(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                    >
                      {selectedFacility.suitableCrops.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Quantity (kg)
                    </label>
                    <input
                      type="number"
                      step="50"
                      min="100"
                      value={bookingKg}
                      onChange={(e) => setBookingKg(Number(e.target.value) || 0)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 text-xs text-blue-900 space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span>Estimated Daily Rent:</span>
                    <span>₹{(bookingKg * selectedFacility.dailyRatePerKg).toFixed(1)}/day</span>
                  </div>
                  <p className="text-[11px] text-blue-700">
                    Pay upon unloading at facility. No advance deposit required for registered farmers.
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedFacility(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-xs"
                  >
                    Confirm Chamber Booking
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
