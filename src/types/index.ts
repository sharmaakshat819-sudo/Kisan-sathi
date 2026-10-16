export type Language = 'en' | 'hi' | 'mr' | 'pa' | 'gu' | 'te';

export type CropCategory = 'All' | 'Vegetables' | 'Cereals' | 'Spices' | 'Fruits' | 'Pulses & Oilseeds';

export interface CropData {
  id: string;
  name: string;
  hindiName: string;
  marathiName: string;
  punjabiName: string;
  gujaratiName: string;
  teluguName: string;
  emoji: string;
  category: CropCategory;
  state: string;
  district: string;
  mandi: string;
  modalPricePerKg: number;
  modalPricePerQuintal: number;
  minPricePerKg: number;
  maxPricePerKg: number;
  changePercent: number; // e.g. +3.2 or -1.5
  arrivalQuintals: number;
  qualityGrade: 'Grade A' | 'Grade B' | 'Fair Standard';
  isPerishable: boolean;
  tip: 'go' | 'wait' | 'fast' | 'store';
  mspPerQuintal: number;
  lastUpdated: string;
  history7D: { day: string; price: number }[];
}

export interface CropListing {
  id: string;
  farmerName: string;
  farmerPhone: string;
  cropId: string;
  cropName: string;
  variety: string;
  grade: 'Grade A' | 'Grade B' | 'Commercial';
  quantityKg: number;
  askingPricePerKg: number;
  location: string;
  status: 'Active' | 'Offer Received' | 'In Escrow' | 'Sold';
  createdAt: string;
  imageUrl?: string;
  pickupAddress: string;
  activeBidsCount: number;
}

export interface BuyerOffer {
  id: string;
  listingId: string;
  cropId: string;
  buyerName: string;
  buyerCompany: string;
  buyerRating: number;
  buyerBadge: 'Verified APMC' | 'Corporate Buyer' | 'Local Retailer';
  phone: string;
  distanceKm: number;
  offeredPricePerKg: number;
  middlemanComparisonPerKg: number;
  totalAmount: number;
  status: 'PENDING' | 'ACCEPTED' | 'COUNTERED' | 'REJECTED';
  date: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: 'farmer' | 'buyer' | 'system';
  text: string;
  timestamp: string;
  isVoiceNote?: boolean;
  offerAmount?: number;
  offerStatus?: 'accepted' | 'pending' | 'countered';
}

export interface ColdStorageFacility {
  id: string;
  name: string;
  address: string;
  district: string;
  state: string;
  type: 'Cold Storage' | 'Dry Warehouse' | 'Controlled Atmosphere';
  distanceKm: number;
  totalCapacityMT: number;
  availableCapacityMT: number;
  temperatureRange: string;
  humidityRange: string;
  dailyRatePerKg: number;
  monthlyRatePerBag: number;
  suitableCrops: string[];
  phone: string;
  rating: number;
  verified: boolean;
}

export interface TransportPoolItem {
  id: string;
  driverName: string;
  driverPhone: string;
  vehicleType: string;
  vehicleNumber: string;
  origin: string;
  destinationMandi: string;
  departureTime: string;
  departureDate: string;
  totalCapacityKg: number;
  availableCapacityKg: number;
  soloCostEstimate: number;
  sharedRatePerKg: number;
  driverRating: number;
  stops: string[];
  bookedKgTotal: number;
}

export interface WeatherWarning {
  id: string;
  title: string;
  severity: 'danger' | 'warning' | 'advisory';
  impactCrops: string[];
  summary: string;
  actionAdvice: string;
  timestamp: string;
}

export interface PriceAlertSubscription {
  id: string;
  cropId: string;
  cropName: string;
  targetPrice: number;
  condition: 'ABOVE' | 'BELOW';
  notified: boolean;
  createdAt: string;
}

export interface EscrowTransaction {
  id: string;
  listingId: string;
  cropName: string;
  farmerName: string;
  buyerName: string;
  quantityKg: number;
  pricePerKg: number;
  totalAmount: number;
  escrowStatus: 'SECURED_IN_ESCROW' | 'RELEASED_TO_FARMER' | 'WEIGHMENT_VERIFIED';
  paymentMethod: 'UPI' | 'NEFT_RTGS' | 'KISAN_CREDIT_CARD';
  upiRef: string;
  timestamp: string;
}
