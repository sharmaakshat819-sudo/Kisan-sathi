import React, { useState } from 'react';
import { BuyerOffer, Language, EscrowTransaction } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle,
  QrCode,
  Building,
  Smartphone,
  X,
  FileCheck,
  Lock,
  ArrowRight,
} from 'lucide-react';

interface PaymentModalProps {
  offer: BuyerOffer;
  currentLang: Language;
  onClose: () => void;
  onPaymentSuccess: (txn: EscrowTransaction) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  offer,
  currentLang,
  onClose,
  onPaymentSuccess,
}) => {
  const t = (key: string) => TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS.en[key] || key;

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'NEFT_RTGS' | 'KISAN_CREDIT_CARD'>('UPI');
  const [upiId, setUpiId] = useState('farmer.ramesh@okaxis');
  const [step, setStep] = useState<'REVIEW' | 'PROCESSING' | 'SUCCESS'>('REVIEW');
  const [txnResult, setTxnResult] = useState<EscrowTransaction | null>(null);

  const totalAmount = offer.totalAmount || 92500;
  const quantity = 500;

  const handleProcessPayment = () => {
    setStep('PROCESSING');

    setTimeout(() => {
      const txn: EscrowTransaction = {
        id: `TXN-${Date.now().toString().slice(-6)}`,
        listingId: offer.listingId,
        cropName: 'Tomato Grade A',
        farmerName: 'Ramesh Patil',
        buyerName: offer.buyerCompany,
        quantityKg: quantity,
        pricePerKg: offer.offeredPricePerKg,
        totalAmount,
        escrowStatus: 'SECURED_IN_ESCROW',
        paymentMethod,
        upiRef: `UPI-RR-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        timestamp: new Date().toLocaleString(),
      };

      setTxnResult(txn);
      setStep('SUCCESS');
      onPaymentSuccess(txn);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <div>
              <h3 className="text-base font-bold text-stone-900">
                {t('payment_modal_title')}
              </h3>
              <p className="text-[11px] text-stone-500">
                100% Protected Escrow · e-NAM & APMC Verified
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close payment modal"
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: REVIEW & SELECT METHOD */}
        {step === 'REVIEW' && (
          <div className="space-y-4">
            {/* Amount Summary */}
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Buyer Organization:</span>
                <span className="font-bold text-stone-900">{offer.buyerCompany}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Agreed Rate:</span>
                <span className="font-bold text-emerald-800">₹{offer.offeredPricePerKg}/kg</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Crop Lot Quantity:</span>
                <span className="font-bold text-stone-900">{quantity} kg (5 Quintals)</span>
              </div>
              <div className="pt-2 border-t flex justify-between text-base font-black">
                <span className="text-stone-800">Total Escrow Amount:</span>
                <span className="text-emerald-700">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2">
                Select Escrow Funding Method:
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 text-xs font-bold ${
                    paymentMethod === 'UPI'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  <span>Instant UPI</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('NEFT_RTGS')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 text-xs font-bold ${
                    paymentMethod === 'NEFT_RTGS'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Building className="w-5 h-5 text-blue-600" />
                  <span>NEFT / RTGS</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('KISAN_CREDIT_CARD')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 text-xs font-bold ${
                    paymentMethod === 'KISAN_CREDIT_CARD'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-amber-600" />
                  <span>KCC Escrow</span>
                </button>
              </div>
            </div>

            {/* Simulated UPI QR / Details */}
            {paymentMethod === 'UPI' && (
              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 flex items-center gap-4">
                <div className="p-2 bg-white rounded-lg border border-stone-300">
                  <QrCode className="w-12 h-12 text-stone-800" />
                </div>
                <div className="text-xs space-y-1 flex-1">
                  <span className="font-bold text-stone-800 block">Scan via any UPI App:</span>
                  <p className="text-stone-500 text-[11px]">
                    Supports Google Pay, PhonePe, BHIM, Paytm, and Bank UPI apps.
                  </p>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-stone-300 rounded text-xs font-mono"
                  />
                </div>
              </div>
            )}

            {/* Escrow Guarantee Text */}
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-[11px] text-emerald-950 flex items-start gap-2">
              <Lock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <b>Bank Escrow Protection:</b> The funds are safely locked in an RBI-regulated escrow account. The farmer is notified that money is secured. Funds are disbursed to the farmer's registered bank account immediately upon digital APMC weighment.
              </p>
            </div>

            <button
              onClick={handleProcessPayment}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <span>{t('deposit_escrow')} (₹{totalAmount.toLocaleString('en-IN')})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: PROCESSING */}
        {step === 'PROCESSING' && (
          <div className="py-12 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <h4 className="font-bold text-stone-900 text-base">Securing Funds in Bank Escrow...</h4>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              Verifying APMC e-NAM credentials and locking deposit for delivery release.
            </p>
          </div>
        )}

        {/* STEP 3: SUCCESS & RECEIPT */}
        {step === 'SUCCESS' && txnResult && (
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-stone-900">Escrow Secured Successfully!</h4>
              <p className="text-xs text-stone-500 mt-0.5">
                Transaction ID: <b>{txnResult.id}</b> · UTR: {txnResult.upiRef}
              </p>
            </div>

            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 text-xs text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-stone-500">Amount Locked:</span>
                <span className="font-extrabold text-emerald-800 text-sm">
                  ₹{txnResult.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Status:</span>
                <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  LOCKED IN ESCROW
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Beneficiary Farmer:</span>
                <span className="font-bold text-stone-800">{txnResult.farmerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Buyer:</span>
                <span className="font-bold text-stone-800">{txnResult.buyerName}</span>
              </div>
              <div className="pt-2 border-t text-[11px] text-stone-400">
                Timestamp: {txnResult.timestamp}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs shadow-xs"
            >
              Done & Return to Marketplace
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
