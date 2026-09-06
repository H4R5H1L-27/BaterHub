'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  Package, 
  Repeat, 
  DollarSign, 
  UploadCloud, 
  Plus, 
  Trash2, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function NewListingPage() {
  const router = useRouter();

  const [listingType, setListingType] = useState<'BOOK' | 'PRODUCT'>('BOOK');
  const [exchangeType, setExchangeType] = useState<'HYBRID' | 'BARTER_ONLY' | 'CASH_ONLY'>('HYBRID');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [condition, setCondition] = useState('LIKE_NEW');
  const [city, setCity] = useState('New York');
  const [state, setState] = useState('NY');
  const [pickupAvailable, setPickupAvailable] = useState(true);
  const [shippingAvailable, setShippingAvailable] = useState(false);
  const [shippingCost, setShippingCost] = useState('4.00');
  const [barterWishlist, setBarterWishlist] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState<string[]>([]);

  // Book specific
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [genre, setGenre] = useState('General Non-Fiction');
  const [bookFormat, setBookFormat] = useState('PAPERBACK');
  const [hasAnnotations, setHasAnnotations] = useState(false);
  const [academicSubject, setAcademicSubject] = useState('');
  const [courseCode, setCourseCode] = useState('');

  // Product specific
  const [category, setCategory] = useState('Electronics');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [includesOriginalBox, setIncludesOriginalBox] = useState(false);
  const [includesAccessories, setIncludesAccessories] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setImages([...images, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !description.trim()) {
      setError('Please provide an item title and description.');
      return;
    }

    if (listingType === 'BOOK' && !author.trim()) {
      setError('Please specify the book author.');
      return;
    }

    if (exchangeType !== 'BARTER_ONLY' && (!price || parseFloat(price) <= 0)) {
      setError('Please enter a valid listing asking price.');
      return;
    }

    setLoading(true);

    try {
      const payload: any = {
        title: title.trim(),
        description: description.trim(),
        listingType,
        exchangeType,
        price: exchangeType === 'BARTER_ONLY' ? null : parseFloat(price),
        isNegotiable,
        condition,
        city: city.trim(),
        state: state.trim(),
        pickupAvailable,
        shippingAvailable,
        shippingCost: shippingAvailable ? parseFloat(shippingCost) : null,
        barterWishlist: barterWishlist.trim() || null,
        images: images.length > 0 ? images : undefined,
      };

      if (listingType === 'BOOK') {
        payload.bookDetails = {
          author: author.trim(),
          isbn: isbn.trim() || null,
          genre,
          format: bookFormat,
          hasAnnotations,
          academicSubject: academicSubject.trim() || null,
          courseCode: courseCode.trim() || null,
        };
      } else {
        payload.productDetails = {
          category,
          brand: brand.trim() || null,
          model: model.trim() || null,
          includesOriginalBox,
          includesAccessories,
        };
      }

      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create listing.');
      }

      router.push(`/listings/${data.listing.id}`);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/listings"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Cancel & Return
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xl overflow-hidden">
        
        {/* Banner Header */}
        <div className="px-8 py-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
          <h1 className="text-2xl font-black tracking-tight">Create a New Listing</h1>
          <p className="text-xs text-indigo-100 mt-1">
            Choose book or general product, define trade and cash terms, and connect with peer exchangers.
          </p>
        </div>

        {error && (
          <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* Step 1: Listing Type Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
              1. What are you listing?
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setListingType('BOOK')}
                className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-all ${
                  listingType === 'BOOK'
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-bold shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-900">Book or Textbook</p>
                  <p className="text-xs text-gray-500">ISBN, author, genre & syllabus tags</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setListingType('PRODUCT')}
                className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-all ${
                  listingType === 'PRODUCT'
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-bold shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-900">Gear or Product</p>
                  <p className="text-xs text-gray-500">Electronics, gaming, board games, audio</p>
                </div>
              </button>
            </div>
          </div>

          {/* Step 2: Exchange Type (Barter vs Cash vs Hybrid) */}
          <div className="pt-6 border-t border-gray-100">
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
              2. Exchange Preference
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  type: 'HYBRID',
                  label: 'Cash or Barter',
                  desc: 'Accept cash offers OR trade proposals',
                  color: 'indigo',
                },
                {
                  type: 'BARTER_ONLY',
                  label: 'Barter Only',
                  desc: 'Item-for-item swap only (no cash price)',
                  color: 'purple',
                },
                {
                  type: 'CASH_ONLY',
                  label: 'Cash Only',
                  desc: 'Standard sale / direct purchase',
                  color: 'emerald',
                },
              ].map((m) => (
                <button
                  key={m.type}
                  type="button"
                  onClick={() => setExchangeType(m.type as any)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    exchangeType === m.type
                      ? 'border-indigo-600 bg-indigo-50/40 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="text-xs font-bold text-gray-900">{m.label}</p>
                  <p className="text-[11px] text-gray-500 mt-1">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Core Information */}
          <div className="pt-6 border-t border-gray-100 space-y-4">
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
              3. Item Details
            </label>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Listing Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={listingType === 'BOOK' ? 'e.g. Designing Data-Intensive Applications (Paperback)' : 'e.g. Sony WH-1000XM4 Wireless Headphones'}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Book Specific Fields */}
            {listingType === 'BOOK' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Author *</label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Martin Kleppmann"
                    className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">ISBN / ISBN-13</label>
                  <input
                    type="text"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    placeholder="e.g. 978-1449373320"
                    className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Genre / Category</label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Biological Sciences">Biological Sciences</option>
                    <option value="Science Fiction & Fantasy">Science Fiction & Fantasy</option>
                    <option value="Classic Literature">Classic Literature</option>
                    <option value="Philosophy">Philosophy</option>
                    <option value="Business & Finance">Business & Finance</option>
                    <option value="General Non-Fiction">General Non-Fiction</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Format</label>
                  <select
                    value={bookFormat}
                    onChange={(e) => setBookFormat(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="PAPERBACK">Paperback</option>
                    <option value="HARDCOVER">Hardcover</option>
                    <option value="MASS_MARKET">Mass Market Paperback</option>
                    <option value="SPIRAL">Spiral Bound</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Academic Subject (Optional)</label>
                  <input
                    type="text"
                    value={academicSubject}
                    onChange={(e) => setAcademicSubject(e.target.value)}
                    placeholder="e.g. Systems Architecture"
                    className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Course Code (Optional)</label>
                  <input
                    type="text"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    placeholder="e.g. CS 440 / MATH 101"
                    className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* Product Specific Fields */}
            {listingType === 'PRODUCT' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Computers & Accessories">Computers & Accessories</option>
                    <option value="Audio & Headphones">Audio & Headphones</option>
                    <option value="Games & Hobbies">Games & Hobbies</option>
                    <option value="Office & Study Gear">Office & Study Gear</option>
                    <option value="Photography">Photography</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Brand</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Sony, Apple, Keychron, Logitech"
                    className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Model / Specs</label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. WH-1000XM4, K2 V2"
                    className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includesOriginalBox}
                      onChange={(e) => setIncludesOriginalBox(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span>Original Box Included</span>
                  </label>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Condition *</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="BRAND_NEW">Brand New (Unopened / Sealed)</option>
                <option value="LIKE_NEW">Like New (Immaculate, no marks or signs of wear)</option>
                <option value="VERY_GOOD">Very Good (Minimal shelf wear, intact binding)</option>
                <option value="GOOD">Good (Read or used, minor notes/wear, fully functional)</option>
                <option value="ACCEPTABLE">Acceptable (Noticeable wear or annotations, complete)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Description *</label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe condition, reason for selling/trading, what is included, etc."
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            {/* Barter Wishlist input */}
            {exchangeType !== 'CASH_ONLY' && (
              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200">
                <label className="block text-xs font-bold text-purple-900 uppercase tracking-wider mb-1">
                  What would you like to trade this for? (Barter Wishlist)
                </label>
                <input
                  type="text"
                  value={barterWishlist}
                  onChange={(e) => setBarterWishlist(e.target.value)}
                  placeholder="e.g. Open to trade for Clean Architecture or sci-fi paperbacks"
                  className="w-full px-3.5 py-2 bg-white border border-purple-300 rounded-xl text-xs focus:outline-none focus:border-purple-600 text-gray-900"
                />
              </div>
            )}
          </div>

          {/* Step 4: Pricing & Location */}
          <div className="pt-6 border-t border-gray-100 space-y-4">
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
              4. Price & Meetup Preferences
            </label>

            {exchangeType !== 'BARTER_ONLY' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Asking Price ($ USD) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 font-bold">$</span>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="35.00"
                      className="w-full pl-7 pr-4 py-2 bg-white border border-gray-300 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isNegotiable}
                      onChange={(e) => setIsNegotiable(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span>Open to Best Reasonable Cash Offers (OBO)</span>
                  </label>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pickupAvailable}
                  onChange={(e) => setPickupAvailable(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>Safe Public Meetup / Local Pickup</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shippingAvailable}
                  onChange={(e) => setShippingAvailable(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>Willing to Ship / Mail Item</span>
              </label>
            </div>
          </div>

          {/* Step 5: Images */}
          <div className="pt-6 border-t border-gray-100 space-y-3">
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
              5. Photo URLs
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Paste an image URL (e.g. https://...)"
                className="flex-1 px-3.5 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Photo
              </button>
            </div>

            {images.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pt-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0 group">
                    <img src={img} alt="Uploaded" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
            <Link
              href="/listings"
              className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition-all hover:scale-105"
            >
              {loading ? 'Publishing Listing...' : 'Publish Listing'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
