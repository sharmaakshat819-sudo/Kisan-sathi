import React, { useState } from 'react';
import { CropData, CropListing, BuyerOffer, Language } from '../types';
import { TRANSLATIONS, getCropName } from '../i18n/translations';
import {
  TrendingUp,
  PlusCircle,
  ShieldCheck,
  CheckCircle,
  MessageSquare,
  Sparkles,
  ArrowRight,
  MapPin,
  Clock,
  Coins,
  Store,
} from 'lucide-react';

interface SellMyCropProps {
  crops: CropData[];
  currentLang: Language;
  listings: CropListing[];
  buyerOffers: BuyerOffer[];
  preSelectedCropId?: string;
  onAddListing: (listing: Omit<CropListing, 'id' | 'createdAt' | 'activeBidsCount'>) => void;
  onAcceptOffer: (offer: BuyerOffer) => void;
  onOpenChatWithBuyer: (offer: BuyerOffer) => void;
}

export const SellMyCrop: React.FC<SellMyCropProps> = ({
  crops,
  currentLang,
  listings,
  buyerOffers,
  preSelectedCropId,
  onAddListing,
  onAcceptOffer,
  onOpenChatWithBuyer,
}) => {
  const t = (key: string) => TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS.en[key] || key;

  const [selectedCropId, setSelectedCropId] = useState<string>(
    preSelectedCropId || crops[0]?.id || 'tomato'
  );
  const [variety, setVariety] = useState('Desi Local Special');
  const [grade, setGrade] = useState<'Grade A' | 'Grade B' | 'Commercial'>('Grade A');
  const [quantityKg, setQuantityKg] = useState<number>(500);
  const [askingPrice, setAskingPrice] = useState<number>(18);
  const [farmerName, setFarmerName] = useState('Ramesh Patil');
  const [farmerPhone, setFarmerPhone] = useState('+91 98220 12345');
  const [pickupAddress, setPickupAddress] = useState('Dindori Village, Nashik, Maharashtra');
  const [activeSubTab, setActiveSubTab] = useState<'sell_form' | 'bids' | 'my_listings'>('sell_form');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const selectedCrop = crops.find((c) => c.id === selectedCropId) || crops[0];

  // Update asking price when crop changes
  const handleSelectCrop = (id: string) => {
    setSelectedCropId(id);
    const crop = crops.find((c) => c.id === id);
    if (crop) {
      setAskingPrice(crop.modalPricePerKg);
    }
  };

  const handleQuantityAdjust = (delta: number) => {
    setQuantityKg((prev) => Math.max(50, prev + delta));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddListing({
      farmerName,
      farmerPhone,
      cropId: selectedCrop.id,
      cropName: selectedCrop.name,
      variety,
      grade,
      quantityKg,
      askingPricePerKg: askingPrice,
      location: pickupAddress,
      status: 'Active',
      pickupAddress,
    });
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setActiveSubTab('bids');
    }, 1200);
  };

  const totalExpectedValue = quantityKg * askingPrice;
  // Estimated middleman price
  const middlemanTotal = quantityKg * (selectedCrop.modalPricePerKg * 0.8);
  const extraGain = Math.max(0, totalExpectedValue - middlemanTotal);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-900 rounded-2xl p-4 sm:p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-950/60 rounded-lg">
                <TrendingUp className="w-5 h-5 text-amber-300" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                {t('nav_sell')} – Direct Buyer Marketplace
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1">
              Zero middlemen commission. Get guaranteed payment via Bank Escrow upon delivery.
            </p>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex bg-emerald-950/80 p-1 rounded-xl border border-emerald-700/60">
            <button
              onClick={() => setActiveSubTab('sell_form')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeSubTab === 'sell_form'
                  ? 'bg-amber-400 text-stone-950 shadow-sm'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              + {t('list_new_crop')}
            </button>
            <button
              onClick={() => setActiveSubTab('bids')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeSubTab === 'bids'
                  ? 'bg-amber-400 text-stone-950 shadow-sm'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              <span>{t('active_bids')}</span>
              <span className="bg-emerald-600 text-white px-1.5 py-0.2 rounded-full text-[10px]">
                {buyerOffers.length}
              </span>
            </button>
            <button
              onClick={() => setActiveSubTab('my_listings')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeSubTab === 'my_listings'
                  ? 'bg-amber-400 text-stone-950 shadow-sm'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              {t('my_listings')} ({listings.length})
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: Sell Form */}
      {activeSubTab === 'sell_form' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-sm space-y-5"
          >
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-emerald-600" />
              <span>{t('list_new_crop')}</span>
            </h3>

            {/* Crop Selector Grid */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2">
                1. {t('crop_name')} (Select your crop)
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {crops.map((crop) => {
                  const isSelected = crop.id === selectedCropId;
                  return (
                    <button
                      type="button"
                      key={crop.id}
                      onClick={() => handleSelectCrop(crop.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500 font-bold'
                          : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <span className="text-2xl">{crop.emoji}</span>
                      <span className="text-xs truncate w-full">
                        {getCropName(crop, currentLang)}
                      </span>
                      <span className="text-[10px] text-stone-500 font-semibold">
                        ₹{crop.modalPricePerKg}/kg
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Variety & Grade */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  2. {t('variety')}
                </label>
                <input
                  type="text"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  placeholder="e.g. Desi, Hybrid F1, Sharbati..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  3. {t('grade')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Grade A', 'Grade B', 'Commercial'] as const).map((g) => (
                    <button
                      type="button"
                      key={g}
                      onClick={() => setGrade(g)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-colors ${
                        grade === g
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quantity Stepper (kg) */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-stone-700">
                  4. {t('quantity_kg')}
                </label>
                <span className="text-xs text-stone-500 font-semibold">
                  Equivalent to {(quantityKg / 100).toFixed(1)} Quintals
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleQuantityAdjust(-100)}
                  className="w-12 h-12 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-black text-xl flex items-center justify-center border border-stone-300"
                >
                  −
                </button>
                <input
                  type="number"
                  min="10"
                  step="10"
                  value={quantityKg}
                  onChange={(e) => setQuantityKg(Math.max(10, parseInt(e.target.value) || 0))}
                  className="flex-1 h-12 text-center text-xl font-black rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-stone-50"
                />
                <button
                  type="button"
                  onClick={() => handleQuantityAdjust(100)}
                  className="w-12 h-12 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-black text-xl flex items-center justify-center border border-stone-300"
                >
                  +
                </button>
              </div>
              <div className="flex gap-2 mt-2">
                {[100, 250, 500, 1000, 2500].map((quickKg) => (
                  <button
                    key={quickKg}
                    type="button"
                    onClick={() => setQuantityKg(quickKg)}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700"
                  >
                    {quickKg} kg
                  </button>
                ))}
              </div>
            </div>

            {/* Expected Price Input & Mandi Benchmark */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-stone-700">
                  5. {t('expected_price')}
                </label>
                <span className="text-xs text-emerald-700 font-bold">
                  Today's Mandi Benchmark: ₹{selectedCrop.modalPricePerKg}/kg
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold text-stone-500">
                  ₹
                </span>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  value={askingPrice}
                  onChange={(e) => setAskingPrice(parseFloat(e.target.value) || 0)}
                  required
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-stone-300 text-base font-bold text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Location & Farmer Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  6. Your Name & Phone
                </label>
                <input
                  type="text"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  placeholder="Farmer Full Name"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm mb-2"
                />
                <input
                  type="tel"
                  value={farmerPhone}
                  onChange={(e) => setFarmerPhone(e.target.value)}
                  placeholder="Mobile Number"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  7. {t('pickup_address')}
                </label>
                <textarea
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="Village, Tehsil/Taluka, District, Landmark..."
                  rows={3}
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={formSubmitted}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-extrabold text-sm sm:text-base shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {formSubmitted ? (
                <>
                  <CheckCircle className="w-5 h-5 text-amber-300" />
                  <span>Crop Listed Successfully! Broadcasting to Buyers...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>{t('post_listing')}</span>
                </>
              )}
            </button>
          </form>

          {/* Right Summary Card & Profit Estimator */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-4">
              <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2 border-b pb-3">
                <Coins className="w-4 h-4 text-amber-600" />
                <span>Earnings & Revenue Preview</span>
              </h4>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Selected Crop:</span>
                  <span className="font-bold text-stone-900">
                    {selectedCrop.emoji} {getCropName(selectedCrop, currentLang)}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Total Quantity:</span>
                  <span className="font-bold text-stone-900">
                    {quantityKg} kg ({(quantityKg / 100).toFixed(1)} q)
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Asking Rate:</span>
                  <span className="font-bold text-stone-900">₹{askingPrice}/kg</span>
                </div>
                <div className="pt-2 border-t flex justify-between text-sm">
                  <span className="font-bold text-stone-800">Gross Sale Value:</span>
                  <span className="font-extrabold text-emerald-700 text-base">
                    ₹{totalExpectedValue.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Extra vs Middleman Highlight */}
              <div className="bg-gradient-to-br from-amber-50 to-emerald-50 rounded-xl p-3.5 border border-amber-200">
                <span className="text-[11px] font-bold text-amber-900 uppercase block tracking-wider">
                  {t('extra_profit_vs_middleman')}
                </span>
                <div className="text-xl font-black text-emerald-800 mt-1">
                  +₹{Math.round(extraGain).toLocaleString('en-IN')} Extra
                </div>
                <p className="text-[11px] text-stone-600 mt-1">
                  Local middleman gives only ₹{(selectedCrop.modalPricePerKg * 0.8).toFixed(1)}/kg. Selling directly through Kisan Saathi protects your hard work!
                </p>
              </div>

              <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 text-xs text-stone-600 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-stone-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Escrow Protection Promise:</span>
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  Buyers deposit 100% of the funds in bank escrow before truck dispatch. You receive payment instantly upon APMC weighment.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Active Bids Feed */}
      {activeSubTab === 'bids' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-stone-900 text-base sm:text-lg flex items-center gap-2">
              <Store className="w-5 h-5 text-emerald-600" />
              <span>Verified Buyer Bids for Your Crops</span>
            </h3>
            <span className="text-xs text-stone-500 font-medium">
              Real-time bids matched via e-NAM & APMC network
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {buyerOffers.map((offer) => {
              const crop = crops.find((c) => c.id === offer.cropId) || crops[0];
              const extraGainTotal = Math.round(
                (offer.offeredPricePerKg - offer.middlemanComparisonPerKg) * (quantityKg || 500)
              );

              return (
                <div
                  key={offer.id}
                  className="bg-white rounded-2xl border border-stone-200 hover:border-emerald-500 p-4 shadow-sm flex flex-col justify-between space-y-3"
                >
                  <div>
                    {/* Buyer Header */}
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 mb-1">
                          ⭐ {offer.buyerBadge}
                        </span>
                        <h4 className="font-bold text-stone-900 text-sm">
                          {offer.buyerCompany}
                        </h4>
                        <p className="text-xs text-stone-500">
                          Buyer: {offer.buyerName} · ⭐ {offer.buyerRating} / 5
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] text-stone-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {offer.distanceKm} km away
                        </span>
                        <span className="text-[10px] text-stone-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {offer.date}
                        </span>
                      </div>
                    </div>

                    {/* Price & Gain */}
                    <div className="bg-stone-50 rounded-xl p-3 my-3 border border-stone-100">
                      <span className="text-[11px] text-stone-500 font-medium block">
                        Offered Buying Rate:
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-stone-950">
                          ₹{offer.offeredPricePerKg}
                        </span>
                        <span className="text-xs font-semibold text-stone-500">/kg</span>
                      </div>

                      <div className="mt-2 text-xs text-stone-600 flex justify-between items-center">
                        <span>Middleman rate: ₹{offer.middlemanComparisonPerKg}/kg</span>
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          +₹{(offer.offeredPricePerKg - offer.middlemanComparisonPerKg).toFixed(1)}/kg extra
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-stone-500 flex items-center justify-between px-1">
                      <span>Crop: {crop.emoji} {getCropName(crop, currentLang)}</span>
                      <span>Verified APMC Escrow</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
                    <button
                      onClick={() => onAcceptOffer(offer)}
                      className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-300" />
                      <span>{t('accept_offer')}</span>
                    </button>

                    <button
                      onClick={() => onOpenChatWithBuyer(offer)}
                      className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-stone-600" />
                      <span>{t('chat_buyer')}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: My Listings */}
      {activeSubTab === 'my_listings' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-stone-900 text-lg">
              {t('my_listings')}
            </h3>
            <button
              onClick={() => setActiveSubTab('sell_form')}
              className="px-3 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold flex items-center gap-1"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Another Crop</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">{item.cropName}</h4>
                    <p className="text-xs text-stone-500">
                      {item.variety} · {item.grade}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    {item.status}
                  </span>
                </div>

                <div className="text-xs space-y-1 bg-stone-50 p-2.5 rounded-xl">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Quantity:</span>
                    <span className="font-bold text-stone-800">{item.quantityKg} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Asking Price:</span>
                    <span className="font-bold text-emerald-700">₹{item.askingPricePerKg}/kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Location:</span>
                    <span className="text-stone-700 truncate max-w-[160px]">{item.pickupAddress}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t text-xs">
                  <span className="text-stone-400">Listed: {item.createdAt}</span>
                  <button
                    onClick={() => setActiveSubTab('bids')}
                    className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>View Bids ({item.activeBidsCount})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
