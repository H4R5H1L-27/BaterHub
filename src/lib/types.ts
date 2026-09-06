export type ListingType = 'BOOK' | 'PRODUCT';
export type ExchangeType = 'CASH_ONLY' | 'BARTER_ONLY' | 'HYBRID';
export type ItemCondition = 'BRAND_NEW' | 'LIKE_NEW' | 'VERY_GOOD' | 'GOOD' | 'ACCEPTABLE';
export type ListingStatus = 'ACTIVE' | 'RESERVED' | 'PENDING_EXCHANGE' | 'SOLD' | 'TRADED' | 'ARCHIVED';
export type BookFormat = 'HARDCOVER' | 'PAPERBACK' | 'MASS_MARKET' | 'SPIRAL' | 'OTHER';
export type OfferStatus = 'PENDING' | 'COUNTERED' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED' | 'CANCELLED' | 'COMPLETED';
export type BarterStatus = 'PROPOSED' | 'COUNTERED' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';
export type MessageType = 'TEXT' | 'CASH_OFFER_CARD' | 'BARTER_PROPOSAL_CARD' | 'SYSTEM_ALERT';

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  city: string;
  state: string;
  isVerified: boolean;
  reputationScore: number;
  totalReviews: number;
  totalTrades: number;
  responseRate?: number;
  avgResponseTime?: string;
  bio?: string | null;
}

export interface BookDetails {
  id: string;
  isbn?: string | null;
  isbn13?: string | null;
  author: string;
  publisher?: string | null;
  publicationYear?: number | null;
  edition?: string | null;
  genre: string;
  format: BookFormat;
  language: string;
  pageCount?: number | null;
  hasAnnotations: boolean;
  academicSubject?: string | null;
  courseCode?: string | null;
}

export interface ProductDetails {
  id: string;
  category: string;
  subCategory?: string | null;
  brand?: string | null;
  model?: string | null;
  includesOriginalBox: boolean;
  includesAccessories: boolean;
  warrantyStatus?: string | null;
}

export interface ListingItem {
  id: string;
  userId: string;
  user: UserSummary;
  title: string;
  description: string;
  listingType: ListingType;
  exchangeType: ExchangeType;
  price?: number | null;
  currency: string;
  isNegotiable: boolean;
  condition: ItemCondition;
  status: ListingStatus;
  images: string[];
  city: string;
  state: string;
  pickupAvailable: boolean;
  shippingAvailable: boolean;
  shippingCost?: number | null;
  barterWishlist?: string | null;
  viewsCount: number;
  sharesCount?: number;
  previousPrice?: number | null;
  isFeatured?: boolean;
  isUrgent?: boolean;
  isTopAd?: boolean;
  featuredUntil?: string | Date | null;
  urgentUntil?: string | Date | null;
  expiresAt?: string | Date | null;
  isSaved?: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  bookDetails?: BookDetails | null;
  productDetails?: ProductDetails | null;
  priceHistory?: { id: string; price: number; createdAt: string | Date }[];
  _count?: {
    cashOffers: number;
    barterProposalsAsTarget: number;
    savedByUsers: number;
  };
}

export interface CashOfferItem {
  id: string;
  listingId: string;
  listing: {
    id: string;
    title: string;
    price?: number | null;
    images: string[];
    status: ListingStatus;
  };
  buyerId: string;
  buyer: UserSummary;
  sellerId: string;
  seller: UserSummary;
  offerAmount: number;
  counterAmount?: number | null;
  status: OfferStatus;
  message?: string | null;
  expiresAt?: string | null;
  conversationId?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface BarterProposalItem {
  id: string;
  initiatorId: string;
  initiator: UserSummary;
  recipientId: string;
  recipient: UserSummary;
  targetListingId: string;
  targetListing: {
    id: string;
    title: string;
    images: string[];
    price?: number | null;
    status: ListingStatus;
    condition?: ItemCondition;
  };
  cashTopUp: number;
  status: BarterStatus;
  exchangeCode?: string | null;
  notes?: string | null;
  conversationId?: string | null;
  createdAt: string | Date;
  offeredItems: {
    id: string;
    listing: {
      id: string;
      title: string;
      images: string[];
      price?: number | null;
      condition: ItemCondition;
    };
  }[];
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  sender: {
    id: string;
    name: string;
    avatar?: string | null;
  };
  content: string;
  messageType: MessageType;
  metadata?: string | null;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string | Date;
}

export interface ConversationItem {
  id: string;
  participantA: UserSummary;
  participantB: UserSummary;
  listing?: {
    id: string;
    title: string;
    price?: number | null;
    images: string[];
    exchangeType: ExchangeType;
  } | null;
  lastMessageAt: string | Date;
  createdAt: string | Date;
  messages: ChatMessage[];
  _count?: {
    messages: number;
  };
}

export interface ReviewItem {
  id: string;
  reviewerId: string;
  reviewer: UserSummary;
  targetUserId: string;
  listingId?: string | null;
  listing?: {
    id: string;
    title: string;
  } | null;
  transactionType: 'CASH_SALE' | 'BARTER_EXCHANGE';
  overallRating: number;
  conditionRating: number;
  communicationRating: number;
  punctualityRating: number;
  comment: string;
  isVerified: boolean;
  createdAt: string | Date;
}
