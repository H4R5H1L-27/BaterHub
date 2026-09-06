'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Package, Repeat, MapPin, ShieldCheck, Heart, GitCompare, Zap, Crown } from 'lucide-react';
import { ListingItem } from '@/lib/types';
import { formatPrice, getConditionBadgeColor, getExchangeTypeBadge } from '@/lib/utils';
import { useMarketplace } from './marketplace-provider';

export default function ListingCard({ listing }: { listing: ListingItem }) {
  const { favorites, toggleFavorite, compareIds, toggleCompare } = useMarketplace();
  const isBook = listing.listingType === 'BOOK';
  const exchangeBadge = getExchangeTypeBadge(listing.exchangeType);
  const conditionClass = getConditionBadgeColor(listing.condition);
  const primaryImage = listing.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80';
  const saved = listing.isSaved || favorites.has(listing.id);
  const compared = compareIds.includes(listing.id);

  return (
    <article className="group bg-surface rounded-2xl border border-ink/10 overflow-hidden hover:shadow-lift hover:-translate-y-0.5 transition-all duration-200 flex flex-col h-full">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-paper">
        <Link href={`/listings/${listing.id}`} className="block h-full">
          <img
            src={primaryImage}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[220ms]"
          />
        </Link>

        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
          {listing.isTopAd && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded-full bg-ink text-surface">
              <Crown className="w-3 h-3" /> Top
            </span>
          )}
          {listing.isFeatured && (
            <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded-full bg-gold text-ink">
              Featured
            </span>
          )}
          {listing.isUrgent && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded-full bg-clay text-white">
              <Zap className="w-3 h-3" /> Urgent
            </span>
          )}
          <span className={`px-2 py-1 text-[10px] font-semibold rounded-full border ${exchangeBadge.classes}`}>
            {exchangeBadge.label}
          </span>
        </div>

        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => toggleFavorite(listing)}
            aria-label={saved ? 'Remove from favorites' : 'Save listing'}
            className={`p-2 rounded-full border shadow-sm transition-colors ${
              saved ? 'bg-clay text-white border-clay' : 'bg-surface/95 text-ink border-ink/10 hover:border-ink/30'
            }`}
          >
            <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => toggleCompare(listing.id)}
            aria-label="Compare listing"
            className={`p-2 rounded-full border shadow-sm transition-colors ${
              compared ? 'bg-sage text-white border-sage' : 'bg-surface/95 text-ink border-ink/10 hover:border-ink/30'
            }`}
          >
            <GitCompare className="w-4 h-4" />
          </button>
        </div>

        <div className="absolute bottom-2.5 right-2.5 bg-ink/75 text-surface p-1.5 rounded-lg">
          {isBook ? <BookOpen className="w-3.5 h-3.5" /> : <Package className="w-3.5 h-3.5" />}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <Link href={`/listings/${listing.id}`}>
          <h3 className="font-display font-semibold text-ink text-base leading-snug line-clamp-2 group-hover:text-sage transition-colors">
            {listing.title}
          </h3>
        </Link>
        {isBook && listing.bookDetails?.author && (
          <p className="text-xs text-mist mt-1">by {listing.bookDetails.author}</p>
        )}
        {!isBook && listing.productDetails?.brand && (
          <p className="text-xs text-mist mt-1">{listing.productDetails.brand}</p>
        )}

        {listing.exchangeType !== 'CASH_ONLY' && listing.barterWishlist && (
          <p className="mt-2 text-xs text-sage line-clamp-1 flex items-center gap-1.5">
            <Repeat className="w-3.5 h-3.5 flex-shrink-0" />
            Wants: {listing.barterWishlist}
          </p>
        )}

        <div className="mt-auto pt-3 flex items-end justify-between gap-2">
          <div>
            <p className="text-lg font-display font-semibold text-ink">
              {listing.exchangeType === 'BARTER_ONLY' ? 'Open to trade' : formatPrice(listing.price, listing.currency)}
            </p>
            {listing.previousPrice && listing.price && listing.previousPrice > listing.price && (
              <p className="text-[11px] text-mist line-through">{formatPrice(listing.previousPrice)}</p>
            )}
            <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] rounded-full border ${conditionClass}`}>
              {listing.condition.replace('_', ' ')}
            </span>
          </div>
          <p className="text-xs text-mist flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {listing.city}
          </p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-ink/5 flex items-center justify-between text-xs">
          <Link href={`/profile/${listing.userId}`} className="flex items-center gap-2 hover:text-sage">
            <span className="font-medium truncate max-w-[120px]">{listing.user.name}</span>
            {listing.user.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-sage" />}
          </Link>
          <span className="text-mist">{listing.viewsCount} views</span>
        </div>
      </div>
    </article>
  );
}
