import React from 'react';
import Link from 'next/link';
import { ArrowLeftRight, ShieldCheck, Repeat, HeartHandshake, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Props Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-gray-800">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
              <Repeat className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base mb-1">True Barter & Cash Hybrid</h4>
              <p className="text-sm text-gray-400">
                Swap item for item, offer partial cash top-ups, or buy directly with standard cash offers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base mb-1">Dual-Sided Verified Reviews</h4>
              <p className="text-sm text-gray-400">
                Transparent reputation scores with detailed condition and punctuality metrics.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 flex-shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base mb-1">In-Person Handover Codes</h4>
              <p className="text-sm text-gray-400">
                Unique trade security tokens safeguard your exchanges during safe local public meetups.
              </p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <ArrowLeftRight className="w-4 h-4" />
              </div>
              <span className="font-bold text-white tracking-tight">BarterHub</span>
            </div>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              The premier circular marketplace for books, textbooks, electronics, and second-hand items.
            </p>
          </div>

          <div>
            <h5 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Explore</h5>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link href="/listings?type=BOOK" className="hover:text-white transition-colors">College Textbooks</Link></li>
              <li><Link href="/listings?type=BOOK" className="hover:text-white transition-colors">Fiction & Literature</Link></li>
              <li><Link href="/listings?type=PRODUCT" className="hover:text-white transition-colors">Audio & Headphones</Link></li>
              <li><Link href="/listings?type=PRODUCT" className="hover:text-white transition-colors">Mechanical Keyboards</Link></li>
              <li><Link href="/listings?exchange=BARTER_ONLY" className="hover:text-white transition-colors">Barter-Only Swaps</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Platform</h5>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link href="/listings/new" className="hover:text-white transition-colors">Create Listing</Link></li>
              <li><Link href="/offers" className="hover:text-white transition-colors">Trade Offers</Link></li>
              <li><Link href="/messages" className="hover:text-white transition-colors">Live Chat Hub</Link></li>
              <li><Link href="/api/health" className="hover:text-white transition-colors">System Health</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Safety & Community</h5>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Safe Meetup Guidelines</li>
              <li>Condition Grading Scale</li>
              <li>Scam Prevention Rules</li>
              <li>Dispute Mediation</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-700">
          <p>© {new Date().getFullYear()} BarterHub Platform. All rights reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span>Community Standards</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
