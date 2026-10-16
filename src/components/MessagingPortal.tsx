import React, { useState } from 'react';
import { BuyerOffer, ChatMessage, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import {
  MessageSquare,
  Send,
  Mic,
  ShieldCheck,
  FileText,
  CreditCard,
  PhoneCall,
  CheckCheck,
  User,
  Sparkles,
  Download,
} from 'lucide-react';

interface MessagingPortalProps {
  currentLang: Language;
  selectedBuyerOffer?: BuyerOffer | null;
  onInitiateEscrowPayment: (offer: BuyerOffer) => void;
}

export const MessagingPortal: React.FC<MessagingPortalProps> = ({
  currentLang,
  selectedBuyerOffer,
  onInitiateEscrowPayment,
}) => {
  const t = (key: string) => TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS.en[key] || key;

  const defaultBuyer: BuyerOffer = selectedBuyerOffer || {
    id: 'bo-1',
    listingId: 'sample-list-1',
    cropId: 'tomato',
    buyerName: 'Vikram Shinde',
    buyerCompany: 'FreshCart Supermarkets Ltd.',
    buyerRating: 4.9,
    buyerBadge: 'Corporate Buyer',
    phone: '+91 98210 99881',
    distanceKm: 5.4,
    offeredPricePerKg: 18.5,
    middlemanComparisonPerKg: 13.0,
    totalAmount: 92500,
    status: 'PENDING',
    date: 'Just now',
  };

  const [activeOffer, setActiveOffer] = useState<BuyerOffer>(defaultBuyer);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      conversationId: 'c1',
      sender: 'buyer',
      text: `Namaste! We saw your listing for Grade A Tomato (500 kg). We are offering ₹${defaultBuyer.offeredPricePerKg}/kg with pickup from your farm. Can we finalize?`,
      timestamp: '10:15 AM',
    },
    {
      id: 'm2',
      conversationId: 'c1',
      sender: 'farmer',
      text: `Namaste Vikram ji. The crop was harvested this morning, zero pest damage and sorted in 25kg crates. If you can do ₹19.00/kg, I will confirm the full 500 kg immediately.`,
      timestamp: '10:18 AM',
    },
    {
      id: 'm3',
      conversationId: 'c1',
      sender: 'buyer',
      text: `Fair enough, our quality team verified your previous harvest. Deal agreed at ₹19.00/kg! We will deposit ₹95,000 into Bank Escrow right away.`,
      timestamp: '10:21 AM',
      offerAmount: 19.0,
      offerStatus: 'accepted',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      conversationId: 'c1',
      sender: 'farmer',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Simulate buyer response after 1.5s
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `m-${Date.now() + 1}`,
        conversationId: 'c1',
        sender: 'buyer',
        text: `Received your note! Our Bolero pickup is scheduled for 4 PM. We have locked the payment in Kisan Escrow.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 1500);
  };

  const handleVoiceNoteSimulation = () => {
    setIsRecordingVoice(true);
    setTimeout(() => {
      setIsRecordingVoice(false);
      const voiceMsg: ChatMessage = {
        id: `m-${Date.now()}`,
        conversationId: 'c1',
        sender: 'farmer',
        text: '🎙️ Voice Note (0:14) — "माल एकदम बढ़िया है, 4 बजे तक लोड कर देंगे।"',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isVoiceNote: true,
      };
      setMessages((prev) => [...prev, voiceMsg]);
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-stone-900 rounded-2xl p-4 sm:p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-950/60 rounded-lg">
                <MessageSquare className="w-5 h-5 text-amber-300" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                {t('buyer_chat_header')}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1">
              Encrypted, direct communication with verified APMC buyers. Negotiate, send voice notes, and sign digital contracts.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-950/80 px-3.5 py-1.5 rounded-xl border border-emerald-700/60 text-xs font-semibold text-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Escrow Protected Channel</span>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
        {/* Chat Header */}
        <div className="p-4 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                  {activeOffer.buyerCompany}
                </h3>
                <span className="px-2 py-0.2 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                  ⭐ {activeOffer.buyerBadge}
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Contact: {activeOffer.buyerName} · 📍 {activeOffer.distanceKm} km away
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowContractModal(true)}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1.5 border border-stone-300"
            >
              <FileText className="w-3.5 h-3.5 text-stone-600" />
              <span>Digital Sale Contract</span>
            </button>

            <button
              onClick={() => onInitiateEscrowPayment(activeOffer)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <CreditCard className="w-3.5 h-3.5 text-amber-300" />
              <span>Escrow Payment</span>
            </button>

            <a
              href={`tel:${activeOffer.phone}`}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-emerald-800"
              title="Call Buyer"
            >
              <PhoneCall className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50/40">
          <div className="text-center">
            <span className="bg-stone-200/80 text-stone-600 text-[11px] px-3 py-1 rounded-full font-medium">
              Today · Direct APMC e-NAM Negotiation
            </span>
          </div>

          {messages.map((msg) => {
            const isMe = msg.sender === 'farmer';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[70%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isMe
                      ? 'bg-emerald-700 text-white rounded-br-xs shadow-xs'
                      : 'bg-white border border-stone-200 text-stone-900 rounded-bl-xs shadow-xs'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* If accepted offer pill */}
                  {msg.offerStatus === 'accepted' && (
                    <div className="mt-2 p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 font-bold text-xs flex items-center justify-between">
                      <span>Deal Locked: ₹{msg.offerAmount}/kg</span>
                      <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded">
                        Contract Ready
                      </span>
                    </div>
                  )}

                  <div
                    className={`flex items-center gap-1 justify-end text-[10px] mt-1 ${
                      isMe ? 'text-emerald-200' : 'text-stone-400'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-emerald-200" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Negotiation Quick Buttons */}
        <div className="bg-stone-100/80 px-4 py-2 border-t border-stone-200 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
          <span className="text-stone-500 font-semibold shrink-0">Quick Action:</span>
          <button
            onClick={() => handleSendMessage('Can you increase the bid to ₹19.50/kg? Quality is premium Grade A.')}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 font-semibold shrink-0"
          >
            Counter at ₹19.50/kg
          </button>
          <button
            onClick={() => handleSendMessage('Please schedule pickup for tomorrow morning 7:00 AM.')}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 font-semibold shrink-0"
          >
            Schedule Pickup 7 AM
          </button>
          <button
            onClick={() => handleSendMessage('I accept the offer. Please deposit funds in escrow to confirm.')}
            className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 text-emerald-900 font-bold shrink-0"
          >
            Accept Deal & Request Escrow
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-stone-200 flex items-center gap-2">
          {/* Voice Memo Button */}
          <button
            type="button"
            onClick={handleVoiceNoteSimulation}
            className={`p-2.5 rounded-xl border transition-all ${
              isRecordingVoice
                ? 'bg-red-500 text-white animate-pulse border-red-600'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200 border-stone-200'
            }`}
            title="Record Voice Note"
          >
            <Mic className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={isRecordingVoice ? 'Recording voice note...' : t('type_message')}
            disabled={isRecordingVoice}
            className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Digital Sale Contract Modal */}
      {showContractModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-stone-900">
                  APMC Digital Sale Contract & Escrow Slip
                </h3>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Contract #KS-2026-9921
              </span>
            </div>

            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Seller (Farmer):</span>
                <span className="font-bold text-stone-900">Ramesh Patil (Dindori Village, Nashik)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Buyer:</span>
                <span className="font-bold text-stone-900">{activeOffer.buyerCompany}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Commodity:</span>
                <span className="font-bold text-stone-900">Tomato (Grade A)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Contracted Quantity:</span>
                <span className="font-bold text-stone-900">500 kg (20 Crates)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Agreed Price:</span>
                <span className="font-bold text-emerald-700">₹19.00 / kg</span>
              </div>
              <div className="pt-2 border-t flex justify-between text-sm font-black">
                <span className="text-stone-800">Total Contract Value:</span>
                <span className="text-emerald-700">₹95,000.00</span>
              </div>
            </div>

            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 space-y-1">
              <span className="font-bold block">Terms & Guarantee:</span>
              <p>
                1. 100% of amount is deposited into Scheduled Commercial Bank Escrow before loading.
              </p>
              <p>
                2. Final payment released to farmer's PM-KISAN bank account upon APMC electronic weighbridge slip.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowContractModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowContractModal(false);
                  onInitiateEscrowPayment(activeOffer);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Proceed to Escrow Deposit</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
