'use client';

import React, { useState } from 'react';
import { X, DollarSign, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ListingItem } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

interface OfferModalProps {
  listing: ListingItem;
  isOpen: boolean;
  onClose: () => void;
  onOfferSubmitted?: () => void;
}

export default function OfferModal({ listing, isOpen, onClose, onOfferSubmitted }: OfferModalProps) {
  const [offerAmount, setOfferAmount] = useState<string>(
    listing.price ? Math.max(1, Math.round(listing.price * 0.85)).toString() : ''
  );
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const amount = parseFloat(offerAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid offer amount.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: listing.id,
          sellerId: listing.userId,
          offerAmount: amount,
          message: message.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit offer.');
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        if (onOfferSubmitted) onOfferSubmitted();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Make a Cash Offer</h3>
              <p className="text-xs text-gray-700">Submit a direct purchase offer to {listing.user.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        {success ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-gray-900 text-lg">Offer Submitted!</h4>
            <p className="text-sm text-gray-600">
              Your offer of <strong className="text-gray-900">{formatPrice(parseFloat(offerAmount))}</strong> has been sent to the seller. You can track it in your Offers hub and chat directly!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Target Item summary */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <img
                src={listing.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200'}
                alt={listing.title}
                className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h5 className="font-semibold text-gray-900 text-sm truncate">{listing.title}</h5>
                <p className="text-xs text-gray-700">
                  Listed Asking Price:{' '}
                  <strong className="text-gray-900 font-bold">
                    {formatPrice(listing.price, listing.currency)}
                  </strong>
                </p>
              </div>
            </div>

            {/* Offer Amount Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Your Offer Amount ($ USD)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-gray-400 font-semibold text-base">$</span>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  required
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  placeholder="Enter cash amount"
                  className="w-full pl-8 pr-4 py-2.5 bg-white border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-base font-semibold text-gray-900 focus:outline-none transition-all"
                />
              </div>
              <p className="text-xs text-gray-700 mt-1">
                The seller can accept, decline, or send you a counter-offer.
              </p>
            </div>

            {/* Optional Note */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Message to Seller (Optional)
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. Can meet in downtown tomorrow, or pay cash on pickup..."
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-sm text-gray-900 focus:outline-none resize-none transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 rounded-xl shadow-sm transition-all"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Sending...' : 'Send Cash Offer'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
