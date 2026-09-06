'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Flame, PlusCircle, Package, ShieldCheck, Star, Search } from 'lucide-react';
import ListingCard from '@/components/listing-card';
import CategoryRail from '@/components/category-rail';
import { ListingItem } from '@/lib/types';
import { TRENDING_SEARCHES } from '@/lib/catalog';
import { useMarketplace } from '@/components/marketplace-provider';

export default function HomePage() {
  const { city } = useMarketplace();
  const [featured, setFeatured] = useState<ListingItem[]>([]);
  const [fresh, setFresh] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cityParam = city && city !== 'All India' ? `&city=${encodeURIComponent(city)}` : '';
    Promise.all([
      fetch(`/api/listings?featured=1&limit=8${cityParam}`).then((r) => r.json()),
      fetch(`/api/listings?sort=newest&limit=8${cityParam}`).then((r) => r.json()),
    ])
      .then(([a, b]) => {
        setFeatured(a.listings || []);
        setFresh(b.listings || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [city]);

  return (
    <div className="pb-16">
      <section className="px-4 sm:px-6 lg:px-8 pt-12 pb-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs uppercase tracking-[0.2em] text-sage font-semibold mb-3">Circular classifieds</p>
          <h1 className="font-display text-4xl sm:text-6xl text-ink max-w-3xl text-balance leading-[1.05]">
            Find it. Swap it. Keep it in circulation.
          </h1>
          <p className="mt-4 max-w-xl text-mist text-base">
            A more complete classifieds desk than a simple listing grid — location search, categories, offers, barter, and seller trust in one place.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {TRENDING_SEARCHES.map((term) => (
              <Link
                key={term}
                href={`/listings?q=${encodeURIComponent(term)}`}
                className="px-3 py-1.5 rounded-full bg-surface border border-ink/10 text-xs font-semibold hover:border-sage"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <CategoryRail />
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-14">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl flex items-center gap-2">
                <Flame className="w-5 h-5 text-gold" /> Featured & urgent
              </h2>
              <p className="text-sm text-mist mt-1">Promoted ads surface first, like a real classifieds board.</p>
            </div>
            <Link href="/listings?featured=1" className="text-sm font-semibold text-sage hover:underline">
              See all
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-80 bg-surface rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featured.map((item) => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-14">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-6">
            <h2 className="font-display text-2xl">Fresh on the board</h2>
            <Link href="/listings" className="inline-flex items-center gap-1 text-sm font-semibold text-sage">
              Browse catalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {fresh.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-4">
          {[
            { icon: Search, title: 'Search like OLX', body: 'Location, voice, recent & saved searches, price and condition filters.' },
            { icon: ShieldCheck, title: 'Verified handovers', body: 'Meetup codes, dual-sided reviews, and report tools on every ad.' },
            { icon: Star, title: 'Negotiate in-thread', body: 'Cash offers, counters, and barter proposals live inside chat.' },
          ].map((card) => (
            <div key={card.title} className="p-6 rounded-2xl bg-surface border border-ink/10">
              <card.icon className="w-5 h-5 text-sage mb-3" />
              <h3 className="font-display text-lg">{card.title}</h3>
              <p className="text-sm text-mist mt-2">{card.body}</p>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto mt-8 p-8 rounded-3xl bg-sage text-surface flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl">Post an ad in under a minute</h2>
            <p className="text-sm text-white/80 mt-1">Multi-step sell flow with photos, delivery, and promotion badges.</p>
          </div>
          <Link href="/listings/new" className="inline-flex items-center gap-2 px-5 py-3 bg-gold text-ink font-bold rounded-full">
            <PlusCircle className="w-4 h-4" /> SELL
          </Link>
        </div>
      </section>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 bg-surface rounded-2xl border border-ink/10">
      <Package className="w-12 h-12 text-mist mx-auto mb-3" />
      <h3 className="font-display text-lg">No ads in this city yet</h3>
      <Link href="/listings/new" className="inline-flex mt-4 items-center gap-2 text-sm font-semibold text-sage">
        <PlusCircle className="w-4 h-4" /> List an item
      </Link>
    </div>
  );
}
