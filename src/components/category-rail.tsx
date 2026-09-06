'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  GraduationCap,
  Headphones,
  Keyboard,
  Camera,
  Dices,
  Repeat,
  Smartphone,
} from 'lucide-react';
import { MARKET_CATEGORIES } from '@/lib/catalog';

const icons = {
  book: BookOpen,
  textbook: GraduationCap,
  audio: Headphones,
  keyboard: Keyboard,
  camera: Camera,
  game: Dices,
  swap: Repeat,
  phone: Smartphone,
};

export default function CategoryRail() {
  return (
    <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
      {MARKET_CATEGORIES.map((cat) => {
        const Icon = icons[cat.icon];
        return (
          <Link
            key={cat.slug}
            href={cat.href}
            className="group flex flex-col items-center gap-2 p-3 rounded-2xl bg-surface border border-ink/10 hover:border-sage/40 hover:shadow-card transition-all duration-200"
          >
            <span className="w-11 h-11 rounded-2xl bg-sage-tint text-sage flex items-center justify-center group-hover:bg-sage group-hover:text-surface transition-colors">
              <Icon className="w-5 h-5" />
            </span>
            <span className="text-[11px] font-semibold text-ink text-center leading-tight">{cat.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
