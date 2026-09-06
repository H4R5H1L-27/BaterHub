'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Repeat, Plus, Check, AlertCircle, CheckCircle2, ArrowRight, DollarSign } from 'lucide-react';
import { ListingItem } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

interface BarterModalProps {
  targetListing: ListingItem;
  isOpen: boolean;
  onClose: () => void;
  onBarterSubmitted?: () => void;
}

export default function BarterModal({ targetListing, isOpen, onClose, onBarterSubmitted }: BarterModalProps) {
  const [userListings, setUserListings] = useState<ListingItem[]>([]);
  const [selectedListingIds, setSelectedListingIds] = useState<string[]>([]);
  const [cashTopUp, setCashTopUp] = useState<string>('0');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingListings, setFetchingListings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchMyListings = async () => {
      setFetchingListings(true);
      try {
        const res = await fetch('/api/listings/my');
        if (res.ok) {
          const data = await res.json();
          // Exclude target listing if owned by user
          const valid = (data.listings || []).filter((l: ListingItem) => l.id !== targetListing.id && l.status === 'ACTIVE');
          setUserListings(valid);
        }
      } catch (e) {
        console.error('Failed to fetch user listings for barter:', e);
      } finally {
        setFetchingListings(false);
      }
    };

    fetchMyListings();
  }, [isOpen, targetListing.id]);

  if (!isOpen) return null;

  const toggleItemSelection = (id: string) => {
    setSelectedListingIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (selectedListingIds.length === 0) {
      setError('Please select at least 1 item from your inventory to offer in trade.');
      return;
    }

    const topUpAmount = parseFloat(cashTopUp) || 0;

    setLoading(true);
    try {
      const res = await fetch('/api/barters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetListingId: targetListing.id,
          recipientId: targetListing.userId,
          offeredListingIds: selectedListingIds,
          cashTopUp: topUpAmount,
          notes: notes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit barter proposal.');
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        if (onBarterSubmitted) onBarterSubmitted();
      }, 1800);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/70 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Repeat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Propose Barter / Item Swap</h3>
              <p className="text-xs text-gray-700">Trade your items with {targetListing.user.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {success ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-gray-900 text-lg">Barter Proposal Sent!</h4>
            <p className="text-sm text-gray-600 max-w-sm mx-auto">
              Your trade offer has been delivered to {targetListing.user.name}. You can review it in your Offers hub and negotiate the exchange terms.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto p-6 space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Target Item card */}
            <div className="p-3.5 bg-purple-50/60 border border-purple-100 rounded-xl">
              <span className="text-[11px] font-bold text-purple-900 uppercase tracking-wider block mb-1">
                Item You Want
              </span>
              <div className="flex items-center gap-3">
                <img
                  src={targetListing.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200'}
                  alt={targetListing.title}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-gray-900 text-sm truncate">{targetListing.title}</h5>
                  <p className="text-xs text-purple-900 font-medium">
                    Condition: {targetListing.condition.replace('_', ' ')}
                  </p>
                </div>
              </div>
              {targetListing.barterWishlist && (
                <p className="mt-2 text-xs text-purple-800 bg-purple-100/60 px-2.5 py-1 rounded-md">
                  💡 <strong>Seller Wishlist:</strong> {targetListing.barterWishlist}
                </p>
              )}
            </div>

            {/* Select items from inventory */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Select Items to Offer ({selectedListingIds.length} selected)
                </label>
                <Link
                  href="/listings/new"
                  target="_blank"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> New Listing
                </Link>
              </div>

              {fetchingListings ? (
                <div className="p-6 text-center text-sm text-gray-700">Loading your active listings...</div>
              ) : userListings.length === 0 ? (
                <div className="p-6 border-2 border-dashed border-gray-200 rounded-xl text-center">
                  <p className="text-sm font-semibold text-gray-900 mb-1">No active listings in your inventory</p>
                  <p className="text-xs text-gray-700 mb-3">
                    To propose a trade, you need at least 1 book or product listed on your account.
                  </p>
                  <Link
                    href="/listings/new"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" /> List an Item Now
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto pr-1">
                  {userListings.map((item) => {
                    const isSelected = selectedListingIds.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleItemSelection(item.id)}
                        className={`cursor-pointer p-2.5 rounded-xl border flex items-center gap-3 transition-all ${
                          isSelected
                            ? 'border-purple-600 bg-purple-50/50 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <img
                          src={item.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100'}
                          alt={item.title}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate">{item.title}</p>
                          <p className="text-[11px] text-gray-700">{formatPrice(item.price)}</p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border ${
                            isSelected
                              ? 'bg-purple-600 border-purple-600 text-white'
                              : 'border-gray-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Cash Top-Up / Partial Cash */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Optional Cash Top-Up ($ USD)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-gray-400 font-semibold text-base">$</span>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={cashTopUp}
                  onChange={(e) => setCashTopUp(e.target.value)}
                  placeholder="0"
                  className="w-full pl-8 pr-4 py-2 bg-white border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none transition-all"
                />
              </div>
              <p className="text-xs text-gray-700 mt-1">
                Add cash to bridge any value difference between your items and the seller's item.
              </p>
            </div>

            {/* Note to recipient */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Barter Message / Proposal Terms
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Explain why this is a great swap, propose a public meetup location, etc."
                className="w-full px-3.5 py-2 bg-white border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl text-sm text-gray-900 focus:outline-none resize-none transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100 flex-shrink-0">
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
                disabled={loading || selectedListingIds.length === 0}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 active:bg-purple-800 disabled:opacity-50 rounded-xl shadow-sm transition-all"
              >
                <Repeat className="w-4 h-4" />
                <span>{loading ? 'Submitting...' : 'Send Barter Proposal'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
