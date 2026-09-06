'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BookOpen, 
  Package, 
  Repeat, 
  DollarSign, 
  Plus, 
  Trash2, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Heart,
  Star,
  Check,
  X,
  Zap
} from 'lucide-react';

export default function NewListingPage() {
  const router = useRouter();

  const [listingType, setListingType] = useState<'BOOK' | 'PRODUCT'>('PRODUCT');
  const [exchangeType, setExchangeType] = useState<'HYBRID' | 'BARTER_ONLY' | 'CASH_ONLY'>('HYBRID');
  const [title, setTitle] = useState('Sony WH-1000XM5 Noise-Canceling Headphones');
  const [description, setDescription] = useState('Purchased 4 months ago for study sessions. Includes carrying case, USB-C braid cable, 3.5mm jack, and original retail box. Battery health tested at 98%.');
  const [price, setPrice] = useState('280');
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [condition, setCondition] = useState('LIKE_NEW');
  const [city, setCity] = useState('New York');
  const [state, setState] = useState('NY');
  const [pickupAvailable, setPickupAvailable] = useState(true);
  const [shippingAvailable, setShippingAvailable] = useState(false);
  const [shippingCost, setShippingCost] = useState('4.00');
  const [barterWishlist, setBarterWishlist] = useState('Kindle Paperwhite, Mech Keyboards, iPad Mini');
  const [wishlistTags, setWishlistTags] = useState<string[]>([
    'Kindle Paperwhite 11th Gen',
    'Mechanical Keyboards (75%)',
    'iPad Mini 6 (WiFi)'
  ]);
  const [tagInput, setTagInput] = useState('');
  const [handoverSpot, setHandoverSpot] = useState('Campus Safe Spot');
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
  ]);

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
  const [brand, setBrand] = useState('Sony');
  const [model, setModel] = useState('WH-1000XM5 (Silver)');
  const [includesOriginalBox, setIncludesOriginalBox] = useState(true);
  const [includesAccessories, setIncludesAccessories] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSwitchCategory = (type: 'BOOK' | 'PRODUCT') => {
    setListingType(type);
    if (type === 'BOOK') {
      setTitle('Principles of Neural Science, Sixth Edition');
      setAuthor('Eric R. Kandel');
      setIsbn('978-1259642234');
      setGenre('Biological Sciences');
      setPrice('145');
      setDescription('Standard comprehensive medical & neuroscience reference text. Clean pages with zero highlighting. Includes digital access code scratcher.');
      setImages(['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80']);
      setWishlistTags(['Organic Chemistry 8th Ed', 'Clinical Neurology Atlas', 'Stethoscope']);
      setBarterWishlist('Organic Chemistry 8th Ed, Clinical Neurology Atlas');
    } else {
      setTitle('Sony WH-1000XM5 Noise-Canceling Headphones');
      setBrand('Sony');
      setModel('WH-1000XM5 (Silver)');
      setPrice('280');
      setDescription('Purchased 4 months ago for study sessions. Includes carrying case, USB-C braid cable, 3.5mm jack, and original retail box. Battery health tested at 98%.');
      setImages(['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80']);
      setWishlistTags(['Kindle Paperwhite 11th Gen', 'Mechanical Keyboards (75%)', 'iPad Mini 6 (WiFi)']);
      setBarterWishlist('Kindle Paperwhite, Mech Keyboards, iPad Mini');
    }
  };

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setImages([...images, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddTag = (e?: React.KeyboardEvent) => {
    if (e && e.key !== 'Enter') return;
    if (e) e.preventDefault();
    if (tagInput.trim() && !wishlistTags.includes(tagInput.trim())) {
      const updated = [...wishlistTags, tagInput.trim()];
      setWishlistTags(updated);
      setBarterWishlist(updated.join(', '));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    const updated = wishlistTags.filter(t => t !== tag);
    setWishlistTags(updated);
    setBarterWishlist(updated.join(', '));
  };

  const handleQuickAddTag = (tag: string) => {
    if (!wishlistTags.includes(tag)) {
      const updated = [...wishlistTags, tag];
      setWishlistTags(updated);
      setBarterWishlist(updated.join(', '));
    }
  };

  const conditionLabels: Record<string, { label: string; desc: string }> = {
    BRAND_NEW: { label: 'Brand New', desc: 'Sealed in box' },
    LIKE_NEW: { label: 'Mint 9/10', desc: 'Zero scratches' },
    VERY_GOOD: { label: 'Very Good', desc: 'Light gentle use' },
    GOOD: { label: 'Good', desc: 'Fully functional' },
    ACCEPTABLE: { label: 'Acceptable', desc: 'Heavy wear, works' }
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Top Breadcrumb & Actions */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-tertiary mb-1">
            <Zap className="w-4 h-4 text-tertiary" />
            <span className="text-[11px] uppercase tracking-wider font-bold">Peer-To-Peer Direct Swap</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">Publish a Barter Ad</h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            List your tech gear or books, set valuation, and discover verified swap matches.
          </p>
        </div>
        
        <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
          <Link
            href="/listings"
            className="px-4 py-2 rounded-full bg-surface-container-lowest text-on-surface font-semibold text-xs border border-outline-variant/30 hover:bg-surface-container transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Catalog
          </Link>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high text-on-surface text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-tertiary-container animate-ping"></span>
            Auto-saving draft
          </span>
        </div>
      </div>

      {/* Multi-Step Indicator */}
      <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl border border-outline-variant/20 shadow-sm mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
              01
            </div>
            <div className="min-w-0">
              <span className="block text-[11px] uppercase tracking-wider text-primary font-bold">Step 1</span>
              <p className="text-xs sm:text-sm font-semibold text-on-surface truncate">Category & Details</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-surface-container-high text-on-surface-variant flex items-center justify-center font-bold text-sm shrink-0">
              02
            </div>
            <div className="min-w-0">
              <span className="block text-[11px] uppercase tracking-wider text-outline font-bold">Step 2</span>
              <p className="text-xs sm:text-sm font-semibold text-on-surface truncate">Photos & Proof</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-surface-container-high text-on-surface-variant flex items-center justify-center font-bold text-sm shrink-0">
              03
            </div>
            <div className="min-w-0">
              <span className="block text-[11px] uppercase tracking-wider text-outline font-bold">Step 3</span>
              <p className="text-xs sm:text-sm font-semibold text-on-surface truncate">Wishlist & Offset</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-surface-container-high text-on-surface-variant flex items-center justify-center font-bold text-sm shrink-0">
              04
            </div>
            <div className="min-w-0">
              <span className="block text-[11px] uppercase tracking-wider text-outline font-bold">Step 4</span>
              <p className="text-xs sm:text-sm font-semibold text-on-surface truncate">Handover & Safe Spots</p>
            </div>
          </div>
        </div>
        <div className="w-full bg-surface-container h-1.5 rounded-full mt-4 overflow-hidden">
          <div className="bg-primary h-full rounded-full transition-all duration-300 w-2/3"></div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error-container/40 border border-error/30 rounded-2xl text-on-error-container text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-error" />
          <span>{error}</span>
        </div>
      )}

      {/* Main 2-Column Split */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Configuration (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Category Switcher Pill */}
          <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl border border-outline-variant/20 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] uppercase tracking-wider text-outline font-bold">Category Mode</span>
              <span className="text-tertiary text-xs font-semibold inline-flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Smart form adapts dynamically
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 p-1 bg-surface-container-low rounded-2xl">
              <button
                type="button"
                onClick={() => handleSwitchCategory('PRODUCT')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  listingType === 'PRODUCT'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Tech & Electronics</span>
              </button>
              <button
                type="button"
                onClick={() => handleSwitchCategory('BOOK')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  listingType === 'BOOK'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Textbooks & Books</span>
              </button>
            </div>
          </div>

          {/* Section 1: Item Identity & Specs */}
          <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/20 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary-fixed text-primary flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-on-surface">1. Item Identity & Specs</h2>
              </div>
              <span className="text-[11px] font-bold text-on-surface-variant bg-surface-container px-2.5 py-0.5 rounded-full">
                Required
              </span>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1.5">
                Listing Title *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sony WH-1000XM5 Noise-Canceling Headphones"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border border-transparent focus:border-primary focus:bg-surface-container-lowest focus:outline-none transition-all"
                />
                {title.length > 5 && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-primary">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                )}
              </div>
              <p className="text-[11px] text-on-surface-variant mt-1">
                Include model edition, colorway, and year for 42% faster circular swaps.
              </p>
            </div>

            {/* Dynamic Specifics (Product vs Book) */}
            {listingType === 'PRODUCT' ? (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Brand / Maker</label>
                    <input
                      type="text"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="e.g. Sony, Apple, Keychron"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-xs focus:bg-surface-container-lowest focus:border-primary focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Model / Edition</label>
                    <input
                      type="text"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="e.g. WH-1000XM5 (Silver)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-xs focus:bg-surface-container-lowest focus:border-primary focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-xs focus:bg-surface-container-lowest focus:border-primary focus:outline-none transition-all"
                    >
                      <option value="Electronics">Electronics</option>
                      <option value="Computers & Accessories">Computers & Accessories</option>
                      <option value="Audio & Headphones">Audio & Headphones</option>
                      <option value="Games & Hobbies">Games & Hobbies</option>
                      <option value="Photography">Photography</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-4 pt-6">
                    <label className="flex items-center gap-2 text-xs font-semibold text-on-surface cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includesOriginalBox}
                        onChange={(e) => setIncludesOriginalBox(e.target.checked)}
                        className="rounded text-primary focus:ring-primary w-4 h-4 accent-primary"
                      />
                      <span>Original Box</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs font-semibold text-on-surface cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includesAccessories}
                        onChange={(e) => setIncludesAccessories(e.target.checked)}
                        className="rounded text-primary focus:ring-primary w-4 h-4 accent-primary"
                      />
                      <span>All Cables & Extras</span>
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Author *</label>
                    <input
                      type="text"
                      required
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="e.g. Eric R. Kandel"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-xs focus:bg-surface-container-lowest focus:border-primary focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">ISBN / Edition</label>
                    <input
                      type="text"
                      value={isbn}
                      onChange={(e) => setIsbn(e.target.value)}
                      placeholder="e.g. 978-1259642234"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-xs focus:bg-surface-container-lowest focus:border-primary focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Genre</label>
                    <select
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-xs focus:bg-surface-container-lowest focus:border-primary focus:outline-none"
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Biological Sciences">Biological Sciences</option>
                      <option value="Science Fiction">Science Fiction</option>
                      <option value="General Non-Fiction">General Non-Fiction</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Book Format</label>
                    <select
                      value={bookFormat}
                      onChange={(e) => setBookFormat(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-xs focus:bg-surface-container-lowest focus:border-primary focus:outline-none"
                    >
                      <option value="HARDCOVER">Hardcover</option>
                      <option value="PAPERBACK">Paperback</option>
                      <option value="SPIRAL">Spiral Bound</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">Course Code</label>
                    <input
                      type="text"
                      value={courseCode}
                      onChange={(e) => setCourseCode(e.target.value)}
                      placeholder="e.g. CS 440"
                      className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-xs focus:bg-surface-container-lowest focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Condition Selector Grids */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-on-surface">Condition Grade</label>
                <span className="text-[11px] font-semibold text-primary">Standardized Rubric</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'BRAND_NEW', label: 'Brand New', desc: 'Sealed in box' },
                  { id: 'LIKE_NEW', label: 'Mint 9/10', desc: 'Zero scratches' },
                  { id: 'VERY_GOOD', label: 'Very Good', desc: 'Light gentle use' },
                  { id: 'GOOD', label: 'Fair/Good', desc: 'Fully functional' }
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCondition(c.id)}
                    className={`p-3 rounded-xl text-left transition-all ${
                      condition === c.id
                        ? 'bg-primary-fixed text-on-primary-fixed shadow-sm ring-1 ring-primary/40'
                        : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="block text-xs font-bold">{c.label}</span>
                      {condition === c.id && <Check className="w-3.5 h-3.5 text-primary" />}
                    </div>
                    <span className="block text-[11px] text-on-surface-variant opacity-80 mt-0.5">{c.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description Box */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-on-surface mb-1.5">
                Item Description & Provenance *
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Purchased 4 months ago for study sessions. Includes carrying case, USB-C braid cable, 3.5mm jack..."
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-xs focus:bg-surface-container-lowest focus:border-primary focus:outline-none transition-all resize-none"
              />
            </div>
          </div>

          {/* Section 2: Barter Protocol & Valuation */}
          <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/20 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-secondary-fixed text-secondary flex items-center justify-center">
                  <Repeat className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-on-surface">2. Barter Protocol & Valuation</h2>
              </div>
              <span className="text-[11px] font-bold text-tertiary-container bg-tertiary-fixed px-2.5 py-0.5 rounded-full">
                Circular Core
              </span>
            </div>

            {/* Trade Mode Selector Pill Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setExchangeType('BARTER_ONLY')}
                className={`p-3.5 rounded-xl text-left transition-all ${
                  exchangeType === 'BARTER_ONLY'
                    ? 'bg-secondary text-on-secondary shadow-md'
                    : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Repeat className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Zero Cash</span>
                </div>
                <span className="block text-xs font-bold">True Barter</span>
                <span className="block text-[11px] opacity-80 mt-0.5">100% Item-for-item</span>
              </button>

              <button
                type="button"
                onClick={() => setExchangeType('HYBRID')}
                className={`p-3.5 rounded-xl text-left transition-all ${
                  exchangeType === 'HYBRID'
                    ? 'bg-primary text-on-primary shadow-md'
                    : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <DollarSign className="w-4 h-4 text-tertiary" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Most Popular</span>
                </div>
                <span className="block text-xs font-bold">Hybrid Swap</span>
                <span className="block text-[11px] opacity-80 mt-0.5">Item + Cash balance</span>
              </button>

              <button
                type="button"
                onClick={() => setExchangeType('CASH_ONLY')}
                className={`p-3.5 rounded-xl text-left transition-all ${
                  exchangeType === 'CASH_ONLY'
                    ? 'bg-surface-container-highest text-on-surface shadow-md ring-1 ring-outline'
                    : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <DollarSign className="w-4 h-4 text-outline" />
                </div>
                <span className="block text-xs font-bold">Cash Direct</span>
                <span className="block text-[11px] text-on-surface-variant mt-0.5">Traditional buyout</span>
              </button>
            </div>

            {/* Estimated Item Market Valuation */}
            {exchangeType !== 'BARTER_ONLY' && (
              <div className="bg-surface-container-low p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-on-surface">Estimated Market Valuation</span>
                    <span className="text-[11px] text-on-surface-variant">Used to recommend fair trade algorithmic counterparts</span>
                  </div>
                  <div className="flex items-center gap-1 bg-surface-container-lowest px-3 py-1 rounded-full shadow-sm">
                    <span className="text-tertiary font-bold text-sm">$</span>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-16 bg-transparent font-bold text-sm text-on-surface focus:outline-none text-right"
                    />
                  </div>
                </div>

                {/* Histogram Visual */}
                <div className="pt-1">
                  <div className="flex items-center justify-between text-[11px] text-on-surface-variant mb-1">
                    <span>Algorithmic Median: <strong className="text-on-surface">$260 – $295</strong></span>
                    <span className="text-primary font-semibold">Healthy Valuation Range</span>
                  </div>
                  <div className="h-8 w-full flex items-end gap-1.5 py-1">
                    <div className="flex-1 bg-primary/20 rounded-t h-2"></div>
                    <div className="flex-1 bg-primary/30 rounded-t h-4"></div>
                    <div className="flex-1 bg-primary/45 rounded-t h-6"></div>
                    <div className="flex-1 bg-primary rounded-t h-8 relative">
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary ring-2 ring-surface-container-lowest"></span>
                    </div>
                    <div className="flex-1 bg-primary/60 rounded-t h-5"></div>
                    <div className="flex-1 bg-primary/35 rounded-t h-3"></div>
                    <div className="flex-1 bg-primary/20 rounded-t h-1.5"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Wishlist Tags (Item for Item) */}
            {exchangeType !== 'CASH_ONLY' && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-on-surface">
                    What items would you trade this for? (Wishlist)
                  </label>
                  <span className="text-[11px] text-outline">Targeting ~${price || '200'} valuation</span>
                </div>

                <div className="p-3 bg-surface-container-low rounded-xl flex flex-wrap gap-2 items-center min-h-[48px]">
                  {wishlistTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-on-primary text-xs font-medium shadow-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:opacity-75 focus:outline-none"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <div className="flex items-center gap-1 bg-surface-container-lowest rounded-full px-3 py-1 shadow-sm">
                    <Plus className="w-3.5 h-3.5 text-outline" />
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder="Type target item & hit Enter..."
                      className="bg-transparent text-on-surface text-xs placeholder:text-outline focus:outline-none w-44"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[11px] text-on-surface-variant font-medium">Popular counter-offers:</span>
                  {['Fujifilm FinePix', 'Steam Deck 64GB', 'Mechanical 75% Keyboard', 'Analog 35mm SLR'].map((rec) => (
                    <button
                      key={rec}
                      type="button"
                      onClick={() => handleQuickAddTag(rec)}
                      className="px-2.5 py-0.5 rounded-full bg-surface-container text-[11px] text-on-surface hover:bg-surface-container-high transition-colors"
                    >
                      + {rec}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cash Offset Buffer Callout */}
            <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-on-surface">Cash Flexibility Buffer (OBO)</span>
                <span className="text-[11px] text-on-surface-variant">Open to cash difference adjustments in trade proposals</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNegotiable}
                  onChange={(e) => setIsNegotiable(e.target.checked)}
                  className="rounded text-primary focus:ring-primary w-4 h-4 accent-primary"
                />
                <span className="text-xs font-semibold text-primary">Allow Cash Offset</span>
              </label>
            </div>
          </div>

          {/* Section 3: Safe Spots & Handover */}
          <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/20 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-tertiary-fixed text-tertiary flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-on-surface">3. Handover & Safe Spots</h2>
              </div>
              <span className="text-[11px] font-semibold text-primary flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Safe Meetup Verified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { name: 'Campus Safe Spot', desc: 'Columbia Student Center', icon: 'campus' },
                { name: 'Transit Hub Locker', desc: 'Grand Central Smart Bay', icon: 'locker' },
                { name: 'Public Library', desc: 'NYPL Schwartzman Wing', icon: 'library' }
              ].map((spot) => (
                <button
                  key={spot.name}
                  type="button"
                  onClick={() => setHandoverSpot(spot.name)}
                  className={`p-3.5 rounded-xl text-left border transition-all ${
                    handoverSpot === spot.name
                      ? 'border-primary bg-primary-fixed/20 shadow-sm'
                      : 'border-outline-variant/20 bg-surface-container-low hover:bg-surface-container'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <MapPin className={`w-4 h-4 ${handoverSpot === spot.name ? 'text-primary' : 'text-outline'}`} />
                    <span className={`w-3.5 h-3.5 rounded-full border ${handoverSpot === spot.name ? 'bg-primary border-primary' : 'border-outline'}`}></span>
                  </div>
                  <span className="block text-xs font-bold text-on-surface">{spot.name}</span>
                  <span className="block text-[11px] text-on-surface-variant mt-0.5">{spot.desc}</span>
                </button>
              ))}
            </div>

            {/* City & State */}
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">Meetup City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low text-on-surface text-xs focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">State</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low text-on-surface text-xs focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* 6-Digit Handshake Guarantee Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-primary-fixed/60 to-surface-container-low flex items-start gap-3 border border-primary/20">
              <div className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-on-primary-fixed">6-Digit Code Exchange Guarantee</h3>
                  <span className="bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Included
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                  Neither trader leaves the meetup until both parties enter their synced 6-digit handshake codes on their phones. Swaps are verified and ratings unlocked only when both confirm physical receipt.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Photo URLs */}
          <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/20 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface-variant flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-on-surface">4. Photos & Proof</h2>
              </div>
              <span className="text-[11px] text-outline">Verified Photos Boost Swap Rate</span>
            </div>

            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Paste an image URL (e.g. https://images.unsplash.com/...)"
                className="flex-1 px-3.5 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl text-xs focus:outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2.5 bg-primary text-on-primary text-xs font-bold rounded-xl hover:bg-primary-container transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Photo
              </button>
            </div>

            {images.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pt-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-outline-variant/30 flex-shrink-0 group">
                    <img src={img} alt="Uploaded" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-error text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions Footer */}
          <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl border border-outline-variant/20 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <Link
              href="/listings"
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-on-surface-variant hover:bg-surface-container rounded-full text-center transition-colors"
            >
              Cancel & Discard
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 bg-primary hover:bg-primary-container active:scale-95 text-on-primary text-xs font-bold rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Publishing Listing...' : 'Publish Listing & Unlock Barter Matching'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Right Column: Live Sticky Marketplace Preview (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] uppercase tracking-wider text-outline font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Live Marketplace Preview
            </span>
            <span className="text-xs text-on-surface-variant">Feed card render</span>
          </div>

          {/* Floating Card Mockup */}
          <div className="bg-surface-container-lowest rounded-3xl p-4 sm:p-5 border border-outline-variant/20 shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            {/* Image Container with Badges */}
            <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-surface-container-low">
              <img
                src={images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'}
                alt={title}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm flex items-center justify-center text-primary shadow-sm hover:scale-110 transition-transform"
              >
                <Heart className="w-4 h-4" />
              </button>

              {/* Valuation Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1 bg-surface-container-lowest/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                <span className="text-[11px] text-outline font-medium">Valuation</span>
                <span className="text-sm text-tertiary font-bold">
                  {exchangeType === 'BARTER_ONLY' ? 'Pure Barter' : `$${price || '0'}`}
                </span>
              </div>

              {/* Bottom Condition & Category */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {conditionLabels[condition]?.label || 'Good'}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface text-[11px] font-semibold">
                  {listingType === 'PRODUCT' ? category : 'Textbook'}
                </span>
              </div>
            </div>

            {/* Card Content Body */}
            <div className="pt-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-on-surface-variant">
                <span className="font-semibold text-primary">
                  {listingType === 'PRODUCT' ? `${brand || 'Brand'} • ${model || 'Model'}` : `${author || 'Author'}`}
                </span>
                <span className="flex items-center gap-1 text-on-surface-variant font-medium">
                  <Star className="w-3.5 h-3.5 text-tertiary fill-tertiary" />
                  4.9 (24 swaps)
                </span>
              </div>

              <h3 className="text-base font-bold text-on-surface line-clamp-2">
                {title || 'Untitled Listing'}
              </h3>

              {/* Wishlist Preview */}
              <div className="space-y-1 pt-1">
                <span className="block text-[11px] text-outline uppercase tracking-wider font-semibold">
                  Owner Wants In Return:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {wishlistTags.slice(0, 3).map((w, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface text-[11px]">
                      {w}
                    </span>
                  ))}
                  {wishlistTags.length === 0 && (
                    <span className="text-[11px] text-outline italic">Open to all offers</span>
                  )}
                </div>
              </div>

              {/* Handover & Offset callout */}
              <div className="pt-2 flex items-center justify-between text-xs text-on-surface-variant border-t border-outline-variant/15">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span className="truncate max-w-[140px]">{handoverSpot}</span>
                </div>
                <span className="text-tertiary font-semibold">
                  {isNegotiable ? '±$50 cash offset' : 'Fixed Valuation'}
                </span>
              </div>

              {/* Simulated Proposer Button */}
              <div className="pt-3">
                <button
                  type="button"
                  className="w-full py-2.5 px-4 rounded-full bg-primary/10 hover:bg-primary hover:text-on-primary text-primary font-semibold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Repeat className="w-4 h-4" />
                  <span>Offer Barter Match</span>
                </button>
              </div>
            </div>
          </div>

          {/* Trust Metric Card */}
          <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/20 shadow-sm space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5 text-tertiary" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-on-surface">BarterHub Exchange Integrity</h4>
                <p className="text-[11px] text-on-surface-variant">Listing passes 100% of community safety checks.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2.5 rounded-xl bg-surface-container-low text-center">
                <span className="block text-base font-bold text-primary">99.4%</span>
                <span className="block text-[10px] text-outline uppercase font-semibold">Meetup Success Rate</span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-container-low text-center">
                <span className="block text-base font-bold text-tertiary">&lt; 3 hrs</span>
                <span className="block text-[10px] text-outline uppercase font-semibold">Avg Counter-Offer</span>
              </div>
            </div>
          </div>

        </div>

      </form>
    </div>
  );
}
