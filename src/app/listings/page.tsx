'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  BookOpen, 
  Package, 
  Repeat, 
  DollarSign, 
  X,
  ArrowUpDown
} from 'lucide-react';
import ListingCard from '@/components/listing-card';
import { ListingItem, ListingType, ExchangeType, ItemCondition } from '@/lib/types';

function ListingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [listings, setListings] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [listingType, setListingType] = useState<string>(searchParams.get('type') || '');
  const [exchangeType, setExchangeType] = useState<string>(searchParams.get('exchange') || '');
  const [condition, setCondition] = useState<string>(searchParams.get('condition') || '');
  const [minPrice, setMinPrice] = useState<string>(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get('maxPrice') || '');
  const [city, setCity] = useState<string>(searchParams.get('city') || '');
  const [sort, setSort] = useState<string>(searchParams.get('sort') || 'newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [verified, setVerified] = useState(searchParams.get('verified') === '1');
  const [shipping, setShipping] = useState(searchParams.get('shipping') === '1');
  const [posted, setPosted] = useState(searchParams.get('posted') || '');
  const [featured, setFeatured] = useState(searchParams.get('featured') === '1');

  useEffect(() => {
    fetchFilteredListings();
  }, [searchParams, sort]);

  const fetchFilteredListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (listingType) params.set('type', listingType);
      if (exchangeType) params.set('exchange', exchangeType);
      if (condition) params.set('condition', condition);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      if (city) params.set('city', city);
      if (sort) params.set('sort', sort);
      if (verified) params.set('verified', '1');
      if (shipping) params.set('shipping', '1');
      if (posted) params.set('posted', posted);
      if (featured) params.set('featured', '1');

      const res = await fetch(`/api/listings?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setListings(data.listings || []);
      }
    } catch (err) {
      console.error('Error loading listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (listingType) params.set('type', listingType);
    if (exchangeType) params.set('exchange', exchangeType);
    if (condition) params.set('condition', condition);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (city.trim()) params.set('city', city.trim());
    if (sort) params.set('sort', sort);

    router.push(`/listings?${params.toString()}`);
    setMobileFilterOpen(false);
  };

  const handleClearFilters = () => {
    setQuery('');
    setListingType('');
    setExchangeType('');
    setCondition('');
    setMinPrice('');
    setMaxPrice('');
    setCity('');
    setSort('newest');
    router.push('/listings');
  };

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Category / Type */}
      <div>
        <label className="text-xs font-bold text-gray-900 uppercase tracking-wider block mb-2.5">
          Category Type
        </label>
        <div className="space-y-1.5">
          {[
            { label: 'All Items', val: '' },
            { label: 'Books & Textbooks', val: 'BOOK', icon: BookOpen },
            { label: 'Gear & Electronics', val: 'PRODUCT', icon: Package },
          ].map((cat) => (
            <button
              key={cat.val}
              type="button"
              onClick={() => setListingType(cat.val)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                listingType === cat.val
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{cat.label}</span>
              {cat.icon && <cat.icon className="w-3.5 h-3.5 opacity-80" />}
            </button>
          ))}
        </div>
      </div>

      {/* Exchange Mode */}
      <div className="pt-4 border-t border-gray-200">
        <label className="text-xs font-bold text-gray-900 uppercase tracking-wider block mb-2.5">
          Exchange Mode
        </label>
        <div className="space-y-1.5">
          {[
            { label: 'All Modes', val: '' },
            { label: 'Barter Only', val: 'BARTER_ONLY', icon: Repeat },
            { label: 'Cash or Barter (Hybrid)', val: 'HYBRID' },
            { label: 'Cash Only', val: 'CASH_ONLY', icon: DollarSign },
          ].map((mode) => (
            <button
              key={mode.val}
              type="button"
              onClick={() => setExchangeType(mode.val)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                exchangeType === mode.val
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{mode.label}</span>
              {mode.icon && <mode.icon className="w-3.5 h-3.5 opacity-80" />}
            </button>
          ))}
        </div>
      </div>

      {/* Item Condition */}
      <div className="pt-4 border-t border-gray-200">
        <label className="text-xs font-bold text-gray-900 uppercase tracking-wider block mb-2.5">
          Condition
        </label>
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">Any Condition</option>
          <option value="BRAND_NEW">Brand New</option>
          <option value="LIKE_NEW">Like New</option>
          <option value="VERY_GOOD">Very Good</option>
          <option value="GOOD">Good</option>
          <option value="ACCEPTABLE">Acceptable</option>
        </select>
      </div>

      {/* Price Range */}
      <div className="pt-4 border-t border-gray-200">
        <label className="text-xs font-bold text-gray-900 uppercase tracking-wider block mb-2.5">
          Price Range ($ USD)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-1/2 px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-indigo-500"
          />
          <span className="text-gray-400 text-xs">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-1/2 px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* City */}
      <div className="pt-4 border-t border-gray-200">
        <label className="text-xs font-bold text-gray-900 uppercase tracking-wider block mb-2.5">
          Location / City
        </label>
        <input
          type="text"
          placeholder="e.g. New York, Austin, Boston"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Apply / Reset buttons */}
      <div className="pt-4 space-y-2">
        <button
          type="button"
          onClick={() => handleApplyFilters()}
          className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-sm transition-colors"
        >
          Apply Filters
        </button>
        <button
          type="button"
          onClick={handleClearFilters}
          className="w-full py-2 text-gray-600 hover:text-gray-900 rounded-xl text-xs font-semibold transition-colors"
        >
          Reset All Filters
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Explore Exchange Catalog
          </h1>
          <p className="text-xs sm:text-sm text-gray-700 mt-1">
            {listings.length} available items across books, college textbooks, and electronics
          </p>
        </div>

        {/* Search and Sort */}
        <div className="flex items-center gap-3">
          <form onSubmit={handleApplyFilters} className="relative flex-1 md:w-80">
            <input
              type="text"
              placeholder="Filter by title, author, ISBN..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-xs text-gray-900 focus:outline-none"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </form>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden p-2 bg-white border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar + Listings */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar */}
        <div className="hidden md:block bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm sticky top-20">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
            <span className="font-bold text-gray-900 text-sm">Faceted Filters</span>
          </div>
          <FilterSidebar />
        </div>

        {/* Listings Container */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-gray-200 shadow-sm space-y-3">
              <Package className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="text-base font-bold text-gray-900">No matching listings found</h3>
              <p className="text-xs text-gray-700 max-w-sm mx-auto">
                Try widening your search terms, changing the condition, or resetting all filters.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-xl hover:bg-indigo-100 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((item) => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base">Filter Catalog</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterSidebar />
          </div>
        </div>
      )}

    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16 text-center text-sm text-gray-500">Loading catalog...</div>}>
      <ListingsContent />
    </Suspense>
  );
}
