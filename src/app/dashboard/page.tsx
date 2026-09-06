'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Package, 
  Eye, 
  DollarSign, 
  Repeat, 
  Trash2, 
  ExternalLink, 
  TrendingDown, 
  Sparkles, 
  Zap, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Share2, 
  PlusCircle, 
  SlidersHorizontal,
  Tag,
  AlertCircle
} from 'lucide-react';
import { ListingItem } from '@/lib/types';

export default function MyListingsDashboard() {
  const [listings, setListings] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'RESERVED' | 'SOLD' | 'TRADED'>('ALL');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.user) {
          setUser(d.user);
          fetchMyListings();
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, []);

  const fetchMyListings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/listings/my');
      if (res.ok) {
        const data = await res.json();
        setListings(data.listings || []);
      }
    } catch (err) {
      console.error('Failed to load user listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/listings/${id}/promote`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        showSuccess('Status updated successfully');
        fetchMyListings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePromote = async (id: string, type: 'FEATURED' | 'URGENT' | 'TOP') => {
    try {
      const res = await fetch(`/api/listings/${id}/promote`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promote: type }),
      });
      if (res.ok) {
        showSuccess(`Promoted listing with ${type} boost!`);
        fetchMyListings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdatePrice = async (id: string) => {
    if (!newPrice || isNaN(parseFloat(newPrice))) return;
    try {
      const res = await fetch(`/api/listings/${id}/promote`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: parseFloat(newPrice) }),
      });
      if (res.ok) {
        showSuccess('Price updated successfully');
        setEditingPriceId(null);
        setNewPrice('');
        fetchMyListings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) return;
    try {
      const res = await fetch(`/api/listings/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showSuccess('Listing deleted');
        setListings((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyLink = (id: string) => {
    const url = `${window.location.origin}/listings/${id}`;
    navigator.clipboard.writeText(url);
    showSuccess('Listing link copied to clipboard!');
  };

  const showSuccess = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const filteredListings = listings.filter((item) => {
    if (activeTab === 'ALL') return true;
    return item.status === activeTab;
  });

  const totalViews = listings.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0);
  const totalOffers = listings.reduce((acc, curr) => acc + (curr._count?.cashOffers || 0) + (curr._count?.barterProposalsAsTarget || 0), 0);
  const activeCount = listings.filter((i) => i.status === 'ACTIVE').length;

  if (!loading && !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-14 h-14 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
          <SlidersHorizontal className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Sign in to manage your items</h2>
        <p className="text-xs text-gray-500">
          Only the owner of a listing can access its management controls, update prices, and boost visibility.
        </p>
        <Link
          href="/login"
          className="inline-block px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm"
        >
          Sign In / Switch Persona
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Notification */}
      {actionSuccess && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-white/10 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Listing Management Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Manage Posted Items
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Control listing status, drop prices, boost visibility, track offers, and view stats.
          </p>
        </div>

        <Link
          href="/listings/new"
          className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white font-bold text-xs rounded-2xl hover:bg-indigo-700 shadow-md hover:shadow-indigo-200 transition-all self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Item</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Ads</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{activeCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Views</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{totalViews}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Eye className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Offers Received</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{totalOffers}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Repeat className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        {(['ALL', 'ACTIVE', 'RESERVED', 'SOLD', 'TRADED'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-gray-900 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab === 'ALL' ? 'All Items' : tab}
            <span className="ml-1.5 opacity-60">
              ({tab === 'ALL' ? listings.length : listings.filter((i) => i.status === tab).length})
            </span>
          </button>
        ))}
      </div>

      {/* Listings List / Grid */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
          <Package className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-base font-bold text-gray-900">No items found in this view</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            You don't have any items matching this filter tab. Create a new listing to start trading!
          </p>
          <Link
            href="/listings/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Post First Item
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredListings.map((item) => {
            return (
              <div
                key={item.id}
                className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
              >
                {/* Thumbnail & Info */}
                <div className="flex gap-4 items-start flex-1 min-w-0">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                    <img
                      src={item.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    {item.isFeatured && (
                      <span className="absolute top-1 left-1 bg-amber-500 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md shadow-sm">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-lg ${
                          item.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'RESERVED'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {item.status}
                      </span>
                      <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-lg uppercase">
                        {item.listingType}
                      </span>
                      <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg uppercase">
                        {item.exchangeType.replace('_', ' ')}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-gray-900 truncate">{item.title}</h3>

                    {/* Price & Price Drop */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-gray-900">
                        {item.price ? `$${item.price}` : 'Barter Only'}
                      </span>
                      {item.previousPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          ${item.previousPrice}
                        </span>
                      )}
                    </div>

                    {/* Quick Stats */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-gray-400" />
                        <span>{item.viewsCount || 0} views</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Repeat className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="font-bold text-indigo-600">
                          {(item._count?.cashOffers || 0) + (item._count?.barterProposalsAsTarget || 0)} offers
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Interactive Management Toolbar */}
                <div className="w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-5 flex flex-col sm:flex-row md:flex-col gap-2 flex-shrink-0">
                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <label className="text-[10px] font-bold uppercase text-gray-400 sm:hidden md:block">
                      Status:
                    </label>
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      className="w-full text-xs font-bold bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-gray-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="ACTIVE">Mark Active</option>
                      <option value="RESERVED">Mark Reserved</option>
                      <option value="PENDING_EXCHANGE">Pending Exchange</option>
                      <option value="SOLD">Mark Sold</option>
                      <option value="TRADED">Mark Traded</option>
                      <option value="ARCHIVED">Archive Ad</option>
                    </select>
                  </div>

                  {/* Quick Action Button Bar */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* View Public Listing */}
                    <Link
                      href={`/listings/${item.id}`}
                      className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="View Public Page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    {/* Copy Link */}
                    <button
                      onClick={() => handleCopyLink(item.id)}
                      className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Share / Copy Link"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Edit Price Drop Tool */}
                    <button
                      onClick={() => {
                        setEditingPriceId(editingPriceId === item.id ? null : item.id);
                        setNewPrice(item.price ? item.price.toString() : '');
                      }}
                      className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                      title="Update / Drop Price"
                    >
                      <TrendingDown className="w-3.5 h-3.5" />
                      <span>Price</span>
                    </button>

                    {/* Promote / Boost Button */}
                    <button
                      onClick={() => handlePromote(item.id, 'FEATURED')}
                      disabled={item.isFeatured}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors ${
                        item.isFeatured
                          ? 'bg-emerald-50 text-emerald-700 cursor-default'
                          : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
                      }`}
                      title="Feature Ad on Top"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{item.isFeatured ? 'Featured' : 'Boost'}</span>
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-semibold flex items-center transition-colors"
                      title="Delete Listing"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Inline Price Drop Input Modal */}
                  {editingPriceId === item.id && (
                    <div className="mt-2 p-2.5 bg-amber-50 rounded-2xl border border-amber-200 flex items-center gap-2">
                      <input
                        type="number"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        placeholder="New price ($)"
                        className="w-24 px-2 py-1 text-xs border border-amber-300 rounded-lg focus:outline-none"
                      />
                      <button
                        onClick={() => handleUpdatePrice(item.id)}
                        className="px-3 py-1 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
