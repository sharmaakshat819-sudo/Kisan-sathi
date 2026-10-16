import React, { useState } from 'react';
import { TransportPoolItem, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { calculateTransportPoolSavings } from '../utils/agriMath';
import {
  Truck,
  MapPin,
  Clock,
  PhoneCall,
  CheckCircle,
  PlusCircle,
  ShieldCheck,
  Coins,
  ArrowRight,
  Users,
} from 'lucide-react';

interface TransportPoolProps {
  pools: TransportPoolItem[];
  currentLang: Language;
  onBookSpace: (poolId: string, kg: number, pickupVillage: string) => void;
  onAddVehicle: (item: Omit<TransportPoolItem, 'id' | 'bookedKgTotal'>) => void;
}

export const TransportPool: React.FC<TransportPoolProps> = ({
  pools,
  currentLang,
  onBookSpace,
  onAddVehicle,
}) => {
  const t = (key: string) => TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS.en[key] || key;

  const [activeTab, setActiveTab] = useState<'pools' | 'offer_ride'>('pools');
  const [selectedPool, setSelectedPool] = useState<TransportPoolItem | null>(null);
  const [bookKg, setBookKg] = useState<number>(400);
  const [farmerPickupVillage, setFarmerPickupVillage] = useState<string>('Dindori Village Main Road');
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  // New ride offer state
  const [driverName, setDriverName] = useState<string>('');
  const [driverPhone, setDriverPhone] = useState<string>('');
  const [vehicleType, setVehicleType] = useState<string>('Mahindra Bolero Maxi Truck');
  const [vehicleNumber, setVehicleNumber] = useState<string>('');
  const [origin, setOrigin] = useState<string>('');
  const [destinationMandi, setDestinationMandi] = useState<string>('');
  const [departureDate, setDepartureDate] = useState<string>('Tonight');
  const [departureTime, setDepartureTime] = useState<string>('09:00 PM');
  const [totalCapacityKg, setTotalCapacityKg] = useState<number>(2000);
  const [availableCapacityKg, setAvailableCapacityKg] = useState<number>(1200);
  const [sharedRatePerKg, setSharedRatePerKg] = useState<number>(1.2);
  const [offerSuccess, setOfferSuccess] = useState<boolean>(false);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPool) {
      onBookSpace(selectedPool.id, bookKg, farmerPickupVillage);
      setBookingSuccess(true);
      setTimeout(() => {
        setBookingSuccess(false);
        setSelectedPool(null);
      }, 2200);
    }
  };

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddVehicle({
      driverName,
      driverPhone,
      vehicleType,
      vehicleNumber,
      origin,
      destinationMandi,
      departureDate,
      departureTime,
      totalCapacityKg,
      availableCapacityKg,
      soloCostEstimate: Math.round(totalCapacityKg * 2.8),
      sharedRatePerKg,
      driverRating: 4.8,
      stops: [origin, destinationMandi],
    });
    setOfferSuccess(true);
    setTimeout(() => {
      setOfferSuccess(false);
      setActiveTab('pools');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-stone-900 rounded-2xl p-4 sm:p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-950/60 rounded-lg">
                <Truck className="w-5 h-5 text-amber-300" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                {t('pool_header')}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1">
              {t('pool_desc')}
            </p>
          </div>

          <div className="flex bg-emerald-950/80 p-1 rounded-xl border border-emerald-700/60 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('pools')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'pools'
                  ? 'bg-amber-400 text-stone-950 shadow-sm'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              Available Trucks ({pools.length})
            </button>
            <button
              onClick={() => setActiveTab('offer_ride')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'offer_ride'
                  ? 'bg-amber-400 text-stone-950 shadow-sm'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              + {t('list_vehicle')}
            </button>
          </div>
        </div>
      </div>

      {/* Available Pools List */}
      {activeTab === 'pools' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-stone-900 text-base sm:text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <span>Departing Trucks with Empty Space</span>
            </h3>
            <span className="text-xs text-stone-500 font-medium">Real-time GPS trackable vehicles</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pools.map((item) => {
              const savings = calculateTransportPoolSavings({
                soloFreightCostTotal: item.soloCostEstimate,
                sharedFreightRatePerKg: item.sharedRatePerKg,
                cropWeightKg: 500, // sample benchmark 500 kg
              });

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-stone-200 hover:border-emerald-500 p-4 shadow-sm flex flex-col justify-between space-y-3 transition-all"
                >
                  <div>
                    {/* Route Header */}
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 mb-1">
                          {item.vehicleType}
                        </span>
                        <h4 className="font-bold text-stone-900 text-sm">
                          {item.origin} → {item.destinationMandi}
                        </h4>
                        <p className="text-xs text-stone-500">
                          Driver: {item.driverName} · ⭐ {item.driverRating}
                        </p>
                      </div>

                      <span className="text-xs font-extrabold text-stone-700 bg-stone-100 px-2 py-1 rounded-lg">
                        {item.vehicleNumber}
                      </span>
                    </div>

                    {/* Timing & Capacity */}
                    <div className="bg-stone-50 rounded-xl p-3 my-3 border border-stone-100 space-y-2">
                      <div className="flex justify-between text-xs text-stone-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          <span>{t('departure')}:</span>
                        </span>
                        <span className="font-bold text-stone-900">
                          {item.departureDate}, {item.departureTime}
                        </span>
                      </div>

                      <div className="flex justify-between text-xs text-stone-600">
                        <span>{t('space_left')}:</span>
                        <span className="font-extrabold text-emerald-800">
                          {item.availableCapacityKg} kg free / {item.totalCapacityKg} kg
                        </span>
                      </div>

                      {/* Route Stops */}
                      <div className="pt-2 border-t border-stone-200/60 text-[11px] text-stone-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                        <span className="truncate">Stops: {item.stops.join(' → ')}</span>
                      </div>
                    </div>

                    {/* Cost Split & Direct Savings */}
                    <div className="bg-emerald-50/70 rounded-xl p-3 border border-emerald-200/80 space-y-1 text-xs">
                      <div className="flex justify-between text-stone-600">
                        <span>{t('shared_freight')}:</span>
                        <span className="font-black text-emerald-900 text-sm">
                          ₹{item.sharedRatePerKg}/kg
                        </span>
                      </div>
                      <div className="flex justify-between text-stone-500 text-[11px]">
                        <span>Full truck solo hire:</span>
                        <span className="line-through">₹{item.soloCostEstimate}</span>
                      </div>
                      <div className="pt-1 border-t border-emerald-200 flex justify-between font-bold text-emerald-800 text-[11px]">
                        <span>Saving for 500 kg:</span>
                        <span className="bg-emerald-200/80 px-1.5 py-0.2 rounded text-emerald-950">
                          Save ₹{savings.totalSaved} ({savings.savingsPercent}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Booking Action */}
                  <div className="pt-2 border-t border-stone-100 flex gap-2">
                    <button
                      onClick={() => setSelectedPool(item)}
                      className="flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Truck className="w-4 h-4 text-amber-300" />
                      <span>{t('book_space')}</span>
                    </button>

                    <a
                      href={`tel:${item.driverPhone}`}
                      className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center"
                      title="Call Driver"
                    >
                      <PhoneCall className="w-4 h-4 text-emerald-700" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Offer Ride / Share Vehicle Tab */}
      {activeTab === 'offer_ride' && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-5">
          <div className="border-b pb-3">
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-emerald-600" />
              <span>{t('list_vehicle')}</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Going to mandi with empty truck or tractor trolley space? Pick up neighboring farmers' bags and earn freight!
            </p>
          </div>

          {offerSuccess ? (
            <div className="py-8 text-center space-y-2">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="text-base font-bold text-stone-900">Vehicle Listed in Transport Pool!</h4>
              <p className="text-xs text-stone-600">
                Farmers on your route will now receive instant push alerts to pool their produce.
              </p>
            </div>
          ) : (
            <form onSubmit={handleOfferSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Your Name (Driver / Owner)
                  </label>
                  <input
                    type="text"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    placeholder="e.g. Baldev Singh"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    placeholder="+91 98XXX XXXXX"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Vehicle Type
                  </label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm bg-white"
                  >
                    <option value="Mahindra Bolero Maxi Truck">Mahindra Bolero Maxi Truck (1.5 MT)</option>
                    <option value="Tata 407 / Eicher 14ft">Tata 407 / Eicher 14ft (3 MT)</option>
                    <option value="Tractor Trolley">Tractor Trolley (4 MT)</option>
                    <option value="Heavy 6-Wheeler Truck">Heavy 6-Wheeler Truck (9 MT)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Vehicle Plate Number
                  </label>
                  <input
                    type="text"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    placeholder="e.g. MH 15 AB 1234"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Origin (Village / Start Point)
                  </label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="e.g. Pimpalgaon Chowk"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Destination Mandi Yard
                  </label>
                  <input
                    type="text"
                    value={destinationMandi}
                    onChange={(e) => setDestinationMandi(e.target.value)}
                    placeholder="e.g. Vashi APMC, Navi Mumbai"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Total Capacity (kg)
                  </label>
                  <input
                    type="number"
                    value={totalCapacityKg}
                    onChange={(e) => setTotalCapacityKg(Number(e.target.value) || 0)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Empty Space (kg)
                  </label>
                  <input
                    type="number"
                    value={availableCapacityKg}
                    onChange={(e) => setAvailableCapacityKg(Number(e.target.value) || 0)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Freight Rate (₹/kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={sharedRatePerKg}
                    onChange={(e) => setSharedRatePerKg(Number(e.target.value) || 0)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-colors"
              >
                Publish Vehicle to Transport Pool
              </button>
            </form>
          )}
        </div>
      )}

      {/* Booking Space Modal */}
      {selectedPool && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-600" />
              <span>Book Space in Truck</span>
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Route: <b>{selectedPool.origin} → {selectedPool.destinationMandi}</b>
            </p>

            {bookingSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-stone-900">Transport Space Booked!</h4>
                <p className="text-xs text-stone-600">
                  Driver {selectedPool.driverName} has been notified and will call you before departure.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Your Crop Weight to Transport (kg)
                  </label>
                  <input
                    type="number"
                    step="50"
                    min="50"
                    max={selectedPool.availableCapacityKg}
                    value={bookKg}
                    onChange={(e) => setBookKg(Number(e.target.value) || 0)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-bold"
                  />
                  <span className="text-[11px] text-stone-400 mt-1 block">
                    Available in this truck: {selectedPool.availableCapacityKg} kg
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Pickup Spot (Farm / Village Gate)
                  </label>
                  <input
                    type="text"
                    value={farmerPickupVillage}
                    onChange={(e) => setFarmerPickupVillage(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                  />
                </div>

                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Total Shared Freight:</span>
                    <span>₹{Math.round(bookKg * selectedPool.sharedRatePerKg)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-emerald-800">
                    <span>Rate:</span>
                    <span>₹{selectedPool.sharedRatePerKg} per kg</span>
                  </div>
                  <p className="text-[10px] text-emerald-700 pt-1 border-t border-emerald-200/80">
                    Pay driver directly upon loading at your farm.
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPool(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                  >
                    Confirm Booking
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
