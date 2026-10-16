import React, { useState } from 'react';
import { CropData, PriceAlertSubscription, Language } from '../types';
import { TRANSLATIONS, getCropName } from '../i18n/translations';
import {
  Bell,
  CheckCircle,
  PlusCircle,
  Trash2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  X,
  Volume2,
} from 'lucide-react';

interface NotificationManagerProps {
  crops: CropData[];
  currentLang: Language;
  alerts: PriceAlertSubscription[];
  notificationsLog: { id: string; title: string; message: string; timestamp: string; type: 'price' | 'weather' | 'bid' }[];
  onAddAlert: (cropId: string, targetPrice: number, condition: 'ABOVE' | 'BELOW') => void;
  onRemoveAlert: (alertId: string) => void;
  onClose: () => void;
}

export const NotificationManager: React.FC<NotificationManagerProps> = ({
  crops,
  currentLang,
  alerts,
  notificationsLog,
  onAddAlert,
  onRemoveAlert,
  onClose,
}) => {
  const t = (key: string) => TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS.en[key] || key;

  const [selectedCropId, setSelectedCropId] = useState<string>(crops[0]?.id || 'tomato');
  const [targetPrice, setTargetPrice] = useState<number>(20);
  const [condition, setCondition] = useState<'ABOVE' | 'BELOW'>('ABOVE');
  const [subscribedToast, setSubscribedToast] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);

  const selectedCrop = crops.find((c) => c.id === selectedCropId) || crops[0];

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAlert(selectedCrop.id, targetPrice, condition);
    setSubscribedToast(true);
    setTimeout(() => setSubscribedToast(false), 2000);
  };

  const handleRequestPush = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          setPushEnabled(true);
        }
      } catch (e) {
        setPushEnabled(true);
      }
    } else {
      setPushEnabled(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-stone-900">
              {t('notifications')} & Price Change Alerts
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close notification center"
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Push Notification Toggle Banner */}
        <div className="bg-emerald-50 rounded-xl p-3.5 border border-emerald-200 flex items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-bold text-emerald-950">
              Browser Price Push Notifications
            </h4>
            <p className="text-[11px] text-emerald-800 mt-0.5">
              Receive sound alerts even when your phone screen is locked or browser is in background.
            </p>
          </div>
          <button
            onClick={handleRequestPush}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              pushEnabled
                ? 'bg-emerald-700 text-white'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
            }`}
          >
            {pushEnabled ? '✓ Enabled' : 'Enable Push'}
          </button>
        </div>

        {/* Set Custom Price Alert Form */}
        <form onSubmit={handleCreateAlert} className="space-y-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
          <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            <span>Create New Price Alert</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">
                Select Crop:
              </label>
              <select
                value={selectedCropId}
                onChange={(e) => {
                  setSelectedCropId(e.target.value);
                  const c = crops.find((cr) => cr.id === e.target.value);
                  if (c) setTargetPrice(c.modalPricePerKg);
                }}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold bg-white"
              >
                {crops.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.emoji} {getCropName(c, currentLang)} (Today: ₹{c.modalPricePerKg}/kg)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">
                Alert Condition:
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold bg-white"
              >
                <option value="ABOVE">Rises Above (Sell Alert)</option>
                <option value="BELOW">Drops Below (Warning Alert)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-1">
              Target Price Threshold (₹/kg):
            </label>
            <input
              type="number"
              step="0.5"
              value={targetPrice}
              onChange={(e) => setTargetPrice(Number(e.target.value) || 0)}
              required
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-bold bg-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
          >
            {subscribedToast ? '✓ Alert Activated!' : 'Save Price Trigger Alert'}
          </button>
        </form>

        {/* Active Price Subscriptions */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-stone-700 block">
            Your Active Subscriptions ({alerts.length}):
          </span>

          {alerts.length === 0 ? (
            <p className="text-xs text-stone-400 italic">No price alerts set yet.</p>
          ) : (
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {alerts.map((al) => {
                const crop = crops.find((c) => c.id === al.cropId) || crops[0];
                return (
                  <div
                    key={al.id}
                    className="flex justify-between items-center p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span>{crop.emoji}</span>
                      <span className="font-bold text-stone-800">
                        {getCropName(crop, currentLang)}
                      </span>
                      <span className="text-stone-500 font-medium">
                        {al.condition === 'ABOVE' ? '≥' : '≤'} ₹{al.targetPrice}/kg
                      </span>
                    </div>

                    <button
                      onClick={() => onRemoveAlert(al.id)}
                      className="p-1 text-stone-400 hover:text-red-600 rounded"
                      title="Delete alert"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Notification Feed */}
        <div className="space-y-2 pt-2 border-t">
          <span className="text-xs font-bold text-stone-700 block">
            Recent Market & Weather Alerts:
          </span>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {notificationsLog.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1"
              >
                <div className="flex justify-between items-start">
                  <span className="font-bold text-stone-900 flex items-center gap-1.5">
                    {item.type === 'weather' ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    ) : item.type === 'bid' ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                    )}
                    <span>{item.title}</span>
                  </span>
                  <span className="text-[10px] text-stone-400">{item.timestamp}</span>
                </div>
                <p className="text-stone-600 text-[11px] leading-relaxed">{item.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
