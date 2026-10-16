import React, { useState, useEffect } from 'react';
import {
  CropData,
  CropListing,
  BuyerOffer,
  ColdStorageFacility,
  TransportPoolItem,
  WeatherWarning as IWeatherWarning,
  PriceAlertSubscription,
  EscrowTransaction,
  Language,
} from './types';
import {
  INITIAL_CROPS,
  INITIAL_COLD_STORAGES,
  INITIAL_TRANSPORT_POOLS,
  INITIAL_BUYER_OFFERS,
  INITIAL_WEATHER_WARNINGS,
} from './data/agriData';
import { Header } from './components/Header';
import { Navigation, ActiveTab } from './components/Navigation';
import { TodayPrices } from './components/TodayPrices';
import { SellMyCrop } from './components/SellMyCrop';
import { PriceTrends } from './components/PriceTrends';
import { ColdStorageLocator } from './components/ColdStorageLocator';
import { TransportPool } from './components/TransportPool';
import { WeatherWarning } from './components/WeatherWarning';
import { CultivationCostCalc } from './components/CultivationCostCalc';
import { MessagingPortal } from './components/MessagingPortal';
import { KisanAIChat } from './components/KisanAIChat';
import { PaymentModal } from './components/PaymentModal';
import { NotificationManager } from './components/NotificationManager';
import { Bell, Sparkles, TrendingUp, CheckCircle, ShieldCheck } from 'lucide-react';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<ActiveTab>('prices');
  const [crops, setCrops] = useState<CropData[]>(INITIAL_CROPS);
  const [coldStorages] = useState<ColdStorageFacility[]>(INITIAL_COLD_STORAGES);
  const [transportPools, setTransportPools] = useState<TransportPoolItem[]>(INITIAL_TRANSPORT_POOLS);
  const [buyerOffers, setBuyerOffers] = useState<BuyerOffer[]>(INITIAL_BUYER_OFFERS);
  const [weatherWarnings] = useState<IWeatherWarning[]>(INITIAL_WEATHER_WARNINGS);

  // User Crop Listings
  const [listings, setListings] = useState<CropListing[]>([
    {
      id: 'sample-list-1',
      farmerName: 'Ramesh Patil',
      farmerPhone: '+91 98220 12345',
      cropId: 'tomato',
      cropName: 'Tomato (Hybrid)',
      variety: 'Desi Local Special',
      grade: 'Grade A',
      quantityKg: 500,
      askingPricePerKg: 18.0,
      location: 'Dindori Village, Nashik',
      status: 'Offer Received',
      createdAt: 'Today, 08:30 AM',
      pickupAddress: 'Dindori Village, Nashik, Maharashtra',
      activeBidsCount: 2,
    },
    {
      id: 'sample-list-2',
      farmerName: 'Ramesh Patil',
      farmerPhone: '+91 98220 12345',
      cropId: 'onion',
      cropName: 'Red Onion (Garva)',
      variety: 'Garva Red',
      grade: 'Grade A',
      quantityKg: 1000,
      askingPricePerKg: 25.0,
      location: 'Dindori Village, Nashik',
      status: 'Active',
      createdAt: 'Yesterday',
      pickupAddress: 'Dindori Village, Nashik, Maharashtra',
      activeBidsCount: 1,
    },
  ]);

  // Price Alert Subscriptions & Logs
  const [priceAlerts, setPriceAlerts] = useState<PriceAlertSubscription[]>([
    {
      id: 'pa-1',
      cropId: 'tomato',
      cropName: 'Tomato',
      targetPrice: 20.0,
      condition: 'ABOVE',
      notified: false,
      createdAt: 'Today',
    },
    {
      id: 'pa-2',
      cropId: 'onion',
      cropName: 'Onion',
      targetPrice: 22.0,
      condition: 'BELOW',
      notified: false,
      createdAt: 'Yesterday',
    },
  ]);

  const [notificationsLog, setNotificationsLog] = useState<
    { id: string; title: string; message: string; timestamp: string; type: 'price' | 'weather' | 'bid' }[]
  >([
    {
      id: 'nl-1',
      title: 'Thunderstorm Warning',
      message: 'Severe rain expected in Nashik belt within 36 hours. Cover harvested produce.',
      timestamp: '06:30 AM',
      type: 'weather',
    },
    {
      id: 'nl-2',
      title: 'New Buyer Bid Received',
      message: 'FreshCart Supermarkets placed a bid of ₹18.5/kg for your Tomato lot.',
      timestamp: '08:45 AM',
      type: 'bid',
    },
    {
      id: 'nl-3',
      title: 'Price Spike: Garlic',
      message: 'Garlic surged +8.5% at Mandsaur APMC to ₹145/kg due to export demand.',
      timestamp: '09:12 AM',
      type: 'price',
    },
  ]);

  // Selected contexts for transitions
  const [preSelectedCropForSale, setPreSelectedCropForSale] = useState<string>('tomato');
  const [preSelectedCropForTrend, setPreSelectedCropForTrend] = useState<string>('tomato');
  const [activeBuyerOfferForChat, setActiveBuyerOfferForChat] = useState<BuyerOffer | null>(null);
  const [paymentOffer, setPaymentOffer] = useState<BuyerOffer | null>(null);

  // Modals & Push Toast
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [liveToast, setLiveToast] = useState<{ title: string; body: string } | null>(null);
  const [isRealTimeActive, setIsRealTimeActive] = useState(true);

  // Real-time market pulse ticker simulation
  useEffect(() => {
    if (!isRealTimeActive) return;

    const interval = setInterval(() => {
      // Pick a random crop and oscillate its price slightly (e.g. +/- 0.50)
      setCrops((prev) => {
        const randomIndex = Math.floor(Math.random() * prev.length);
        const target = prev[randomIndex];
        const delta = Math.round((Math.random() * 0.8 - 0.35) * 10) / 10;
        const newPrice = Math.max(5, Math.round((target.modalPricePerKg + delta) * 10) / 10);
        const newPercent = Math.round((target.changePercent + delta * 1.5) * 10) / 10;

        const updated = [...prev];
        updated[randomIndex] = {
          ...target,
          modalPricePerKg: newPrice,
          modalPricePerQuintal: Math.round(newPrice * 100),
          changePercent: newPercent,
          lastUpdated: 'Just now',
        };
        return updated;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isRealTimeActive]);

  // Handlers
  const handleSelectCropForSale = (cropId: string) => {
    setPreSelectedCropForSale(cropId);
    setActiveTab('sell');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCropForTrend = (cropId: string) => {
    setPreSelectedCropForTrend(cropId);
    setActiveTab('trends');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSetPriceAlertQuick = (crop: CropData) => {
    setPriceAlerts((prev) => [
      ...prev,
      {
        id: `pa-${Date.now()}`,
        cropId: crop.id,
        cropName: crop.name,
        targetPrice: Math.round(crop.modalPricePerKg * 1.1),
        condition: 'ABOVE',
        notified: false,
        createdAt: 'Just now',
      },
    ]);
    setLiveToast({
      title: 'Price Alert Activated',
      body: `You will be notified when ${crop.name} reaches ₹${Math.round(crop.modalPricePerKg * 1.1)}/kg.`,
    });
    setTimeout(() => setLiveToast(null), 3500);
  };

  const handleAddListing = (listingData: Omit<CropListing, 'id' | 'createdAt' | 'activeBidsCount'>) => {
    const newListing: CropListing = {
      ...listingData,
      id: `list-${Date.now()}`,
      createdAt: 'Just now',
      activeBidsCount: 1,
    };
    setListings((prev) => [newListing, ...prev]);

    // Automatically simulate an eager buyer bid after 3 seconds!
    setTimeout(() => {
      const newOffer: BuyerOffer = {
        id: `bo-${Date.now()}`,
        listingId: newListing.id,
        cropId: newListing.cropId,
        buyerName: 'Sunil Agrotech',
        buyerCompany: 'Sunil Agro Foods & Mandi Traders',
        buyerRating: 4.8,
        buyerBadge: 'Corporate Buyer',
        phone: '+91 94220 88990',
        distanceKm: 6.8,
        offeredPricePerKg: newListing.askingPricePerKg,
        middlemanComparisonPerKg: Math.round(newListing.askingPricePerKg * 0.78),
        totalAmount: newListing.askingPricePerKg * newListing.quantityKg,
        status: 'PENDING',
        date: 'Just now',
      };
      setBuyerOffers((prev) => [newOffer, ...prev]);
      setLiveToast({
        title: 'New Buyer Bid!',
        body: `${newOffer.buyerCompany} offered ₹${newOffer.offeredPricePerKg}/kg for your ${newListing.cropName}!`,
      });
      setTimeout(() => setLiveToast(null), 4000);
    }, 3000);
  };

  const handleAcceptOffer = (offer: BuyerOffer) => {
    setPaymentOffer(offer);
  };

  const handleOpenChatWithBuyer = (offer: BuyerOffer) => {
    setActiveBuyerOfferForChat(offer);
    setActiveTab('messages');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddVehicleToPool = (item: Omit<TransportPoolItem, 'id' | 'bookedKgTotal'>) => {
    const newPool: TransportPoolItem = {
      ...item,
      id: `pool-${Date.now()}`,
      bookedKgTotal: 0,
    };
    setTransportPools((prev) => [newPool, ...prev]);
    setLiveToast({
      title: 'Vehicle Added to Pool',
      body: `Your ${item.vehicleType} has been broadcast to farmers on route ${item.origin} to ${item.destinationMandi}.`,
    });
    setTimeout(() => setLiveToast(null), 3500);
  };

  const handleBookSpace = (poolId: string, kg: number) => {
    setTransportPools((prev) =>
      prev.map((p) => {
        if (p.id === poolId) {
          return {
            ...p,
            availableCapacityKg: Math.max(0, p.availableCapacityKg - kg),
            bookedKgTotal: p.bookedKgTotal + kg,
          };
        }
        return p;
      })
    );
  };

  const handleAddPriceAlert = (cropId: string, targetPrice: number, condition: 'ABOVE' | 'BELOW') => {
    const crop = crops.find((c) => c.id === cropId);
    setPriceAlerts((prev) => [
      ...prev,
      {
        id: `pa-${Date.now()}`,
        cropId,
        cropName: crop?.name || cropId,
        targetPrice,
        condition,
        notified: false,
        createdAt: 'Just now',
      },
    ]);
  };

  const handleRemovePriceAlert = (alertId: string) => {
    setPriceAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* Toast Notification Popup */}
      {liveToast && (
        <div className="fixed top-20 right-4 z-50 bg-stone-900 text-white rounded-2xl p-4 shadow-2xl border border-emerald-500/50 flex items-start gap-3 max-w-sm animate-in slide-in-from-top-4 duration-200">
          <div className="p-2 bg-emerald-800 rounded-xl text-amber-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
              {liveToast.title}
            </h4>
            <p className="text-xs text-stone-200 mt-0.5 leading-relaxed">
              {liveToast.body}
            </p>
          </div>
        </div>
      )}

      {/* Main Header */}
      <Header
        currentLang={currentLang}
        onLanguageChange={(lang) => setCurrentLang(lang)}
        unreadAlertsCount={notificationsLog.length}
        onOpenAlerts={() => setIsAlertModalOpen(true)}
        onOpenAi={() => {
          setActiveTab('ai');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Sub-Header Navigation */}
      <Navigation
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentLang={currentLang}
        unreadMessagesCount={1}
        activeBidsCount={buyerOffers.length}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6">
        {activeTab === 'prices' && (
          <TodayPrices
            crops={crops}
            currentLang={currentLang}
            onSelectCropForSale={handleSelectCropForSale}
            onSelectCropForTrend={handleSelectCropForTrend}
            onSetPriceAlert={handleSetPriceAlertQuick}
            isRealTimeActive={isRealTimeActive}
            onToggleRealTime={() => setIsRealTimeActive(!isRealTimeActive)}
            onManualRefresh={() => {
              setCrops((prev) =>
                prev.map((c) => ({
                  ...c,
                  arrivalQuintals: c.arrivalQuintals + Math.floor(Math.random() * 50 - 20),
                  lastUpdated: 'Just refreshed',
                }))
              );
            }}
          />
        )}

        {activeTab === 'sell' && (
          <SellMyCrop
            crops={crops}
            currentLang={currentLang}
            listings={listings}
            buyerOffers={buyerOffers}
            preSelectedCropId={preSelectedCropForSale}
            onAddListing={handleAddListing}
            onAcceptOffer={handleAcceptOffer}
            onOpenChatWithBuyer={handleOpenChatWithBuyer}
          />
        )}

        {activeTab === 'trends' && (
          <PriceTrends
            crops={crops}
            currentLang={currentLang}
            selectedCropId={preSelectedCropForTrend}
            onSelectCrop={(id) => setPreSelectedCropForTrend(id)}
            onNavigateToSell={handleSelectCropForSale}
          />
        )}

        {activeTab === 'storage' && (
          <ColdStorageLocator
            facilities={coldStorages}
            currentLang={currentLang}
          />
        )}

        {activeTab === 'transport' && (
          <TransportPool
            pools={transportPools}
            currentLang={currentLang}
            onBookSpace={handleBookSpace}
            onAddVehicle={handleAddVehicleToPool}
          />
        )}

        {activeTab === 'weather' && (
          <WeatherWarning
            warnings={weatherWarnings}
            currentLang={currentLang}
          />
        )}

        {activeTab === 'calc' && (
          <CultivationCostCalc
            crops={crops}
            currentLang={currentLang}
          />
        )}

        {activeTab === 'messages' && (
          <MessagingPortal
            currentLang={currentLang}
            selectedBuyerOffer={activeBuyerOfferForChat}
            onInitiateEscrowPayment={handleAcceptOffer}
          />
        )}

        {activeTab === 'ai' && (
          <KisanAIChat currentLang={currentLang} />
        )}
      </main>

      {/* Escrow Payment Gateway Modal */}
      {paymentOffer && (
        <PaymentModal
          offer={paymentOffer}
          currentLang={currentLang}
          onClose={() => setPaymentOffer(null)}
          onPaymentSuccess={(txn) => {
            setNotificationsLog((prev) => [
              {
                id: `nl-${Date.now()}`,
                title: 'Escrow Locked',
                message: `₹${txn.totalAmount.toLocaleString('en-IN')} secured in bank escrow for your Tomato lot.`,
                timestamp: 'Just now',
                type: 'bid',
              },
              ...prev,
            ]);
          }}
        />
      )}

      {/* Notification Center Modal */}
      {isAlertModalOpen && (
        <NotificationManager
          crops={crops}
          currentLang={currentLang}
          alerts={priceAlerts}
          notificationsLog={notificationsLog}
          onAddAlert={handleAddPriceAlert}
          onRemoveAlert={handleRemovePriceAlert}
          onClose={() => setIsAlertModalOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 py-8 px-4 border-t border-stone-800 mt-12 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌾</span>
            <div>
              <span className="font-bold text-white text-sm">
                Kisan Saathi – Smart Mandi & Farmer Marketplace
              </span>
              <p className="text-stone-400 text-[11px] mt-0.5">
                Empowering India's farmers with real-time transparent market prices, zero middleman cuts, and weather resilience.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-stone-400">
            <span>Toll-Free Helpline: <b>1800-180-1551</b></span>
            <span>·</span>
            <span>e-NAM APMC Synced</span>
            <span>·</span>
            <span>Bank Escrow Verified</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
