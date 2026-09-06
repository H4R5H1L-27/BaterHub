'use client';

import React from 'react';
import Link from 'next/link';
import { GitCompare, X } from 'lucide-react';
import { useMarketplace } from './marketplace-provider';

export default function CompareTray() {
  const { compareIds, clearCompare, toggleCompare } = useMarketplace();
  if (compareIds.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[min(720px,calc(100%-1.5rem))] bg-ink text-surface rounded-2xl shadow-lift px-4 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-sm">
        <GitCompare className="w-4 h-4 text-gold" />
        <span>Compare {compareIds.length} of 3 ads</span>
      </div>
      <div className="flex items-center gap-2">
        {compareIds.map((id) => (
          <button
            key={id}
            onClick={() => toggleCompare(id)}
            className="text-[10px] px-2 py-1 rounded-full bg-white/10 hover:bg-white/20"
            aria-label="Remove from compare"
          >
            {id.slice(-4)} <X className="inline w-3 h-3" />
          </button>
        ))}
        <Link
          href={`/compare?ids=${compareIds.join(',')}`}
          className="px-3 py-1.5 rounded-full bg-gold text-ink text-xs font-bold hover:bg-[#c49212]"
        >
          Open
        </Link>
        <button onClick={clearCompare} className="text-xs text-white/70 hover:text-white">
          Clear
        </button>
      </div>
    </div>
  );
}
