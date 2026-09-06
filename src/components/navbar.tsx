'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ArrowLeftRight,
  PlusCircle,
  MessageSquare,
  User as UserIcon,
  LogOut,
  Search,
  CheckCircle2,
  Menu,
  X,
  MapPin,
  Bell,
  Heart,
  Mic,
  LayoutGrid,
} from 'lucide-react';
import { UserSummary } from '@/lib/types';
import { CITIES, TRENDING_SEARCHES } from '@/lib/catalog';
import { useMarketplace } from './marketplace-provider';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { city, setCity, rememberSearch, recentSearches } = useMarketplace();
  const [user, setUser] = useState<UserSummary | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [unread, setUnread] = useState(0);
  const [chatUnread, setChatUnread] = useState(0);
  const [notes, setNotes] = useState<{ id: string; title: string; body: string; href?: string | null; isRead: boolean }[]>([]);
  const [notesOpen, setNotesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch {
        /* ignore */
      }
    };
    checkAuth();
    fetch('/api/notifications')
      .then((r) => r.json())
      .then((d) => {
        setUnread(d.unread || 0);
        setNotes(d.notifications || []);
      })
      .catch(() => {});
    fetch('/api/conversations')
      .then((r) => r.json())
      .then((d) => setChatUnread(d.unreadTotal || 0))
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    setUser(null);
    router.push('/');
  };

  const goSearch = (q: string) => {
    rememberSearch(q);
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (city && city !== 'All India') params.set('city', city);
    router.push(`/listings?${params.toString()}`);
    setSearchOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    goSearch(searchQuery);
  };

  const startVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice search is not supported in this browser. Please type your search query directly.');
      return;
    }
    try {
      const rec = new SpeechRecognition();
      rec.lang = 'en-US';
      setIsListening(true);
      rec.onresult = (event: any) => {
        const text = event.results?.[0]?.[0]?.transcript;
        if (text) {
          setSearchQuery(text);
          goSearch(text);
        }
      };
      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
      rec.start();
    } catch {
      setIsListening(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur border-b border-ink/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px] gap-3">
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-sage text-surface flex items-center justify-center group-hover:bg-ink transition-colors">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display text-xl tracking-tight text-ink">
                Barter<span className="text-sage">Hub</span>
              </span>
              <span className="hidden sm:block text-[10px] text-mist uppercase tracking-[0.16em]">
                Classifieds & swaps
              </span>
            </div>
          </Link>

          <div className="hidden md:flex flex-1 max-w-2xl items-center gap-2">
            <label className="flex items-center gap-1.5 px-3 h-11 rounded-xl bg-paper border border-ink/10 text-xs font-semibold text-ink hover:border-sage/40 transition-colors">
              <MapPin className="w-4 h-4 text-sage flex-shrink-0" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer max-w-[140px]"
                aria-label="Location"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <input
                ref={searchRef}
                type="text"
                placeholder="Find books, textbooks, tech gear..."
                value={searchQuery}
                onFocus={() => setSearchOpen(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-32 bg-paper hover:bg-white focus:bg-white text-sm rounded-xl border border-ink/10 focus:border-sage focus:outline-none transition-colors"
              />
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-mist pointer-events-none" />

              {/* Action buttons on the right inside search input: never overlaps */}
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      searchRef.current?.focus();
                    }}
                    className="p-1 text-mist hover:text-ink rounded-lg transition-colors"
                    title="Clear search"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={startVoice}
                  className={`h-8 w-8 flex items-center justify-center rounded-lg transition-all ${
                    isListening
                      ? 'bg-clay text-white animate-pulse shadow-sm'
                      : 'text-mist hover:text-sage hover:bg-sage-tint/60'
                  }`}
                  aria-label="Voice search"
                  title={isListening ? 'Listening... speak now' : 'Voice search'}
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  className="h-8 px-3.5 bg-sage text-surface text-xs font-bold rounded-lg hover:bg-ink transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <span>Search</span>
                </button>
              </div>

              {searchOpen && (
                <div className="absolute top-12 left-0 right-0 bg-surface border border-ink/10 rounded-xl shadow-lift p-3 z-50">
                  {recentSearches.length > 0 && (
                    <div className="mb-2">
                      <p className="text-[10px] uppercase tracking-wider text-mist mb-1">Recent</p>
                      {recentSearches.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => goSearch(s)}
                          className="block w-full text-left text-sm py-1.5 hover:text-sage"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                  <p className="text-[10px] uppercase tracking-wider text-mist mb-1">Trending</p>
                  <div className="flex flex-wrap gap-1.5">
                    {TRENDING_SEARCHES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => goSearch(s)}
                        className="px-2.5 py-1 rounded-full bg-paper text-xs hover:bg-sage-tint"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </form>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/listings/new"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 h-10 bg-gold hover:bg-[#c49212] text-ink text-sm font-bold rounded-full transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              SELL
            </Link>

            {user ? (
              <>
                <Link href="/dashboard" className="p-2 rounded-lg text-ink hover:bg-paper" title="My ads">
                  <LayoutGrid className="w-5 h-5" />
                </Link>
                <Link href="/favorites" className="p-2 rounded-lg text-ink hover:bg-paper" title="Favorites">
                  <Heart className="w-5 h-5" />
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setNotesOpen(!notesOpen)}
                    className="p-2 rounded-lg text-ink hover:bg-paper relative"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unread > 0 && (
                      <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-clay text-white text-[10px] leading-4 text-center">
                        {unread}
                      </span>
                    )}
                  </button>
                  {notesOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-surface border border-ink/10 rounded-xl shadow-lift p-2 z-50">
                      <div className="flex items-center justify-between px-2 py-1">
                        <span className="text-xs font-bold">Notifications</span>
                        <button
                          className="text-[11px] text-sage"
                          onClick={() => {
                            fetch('/api/notifications', {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ all: true }),
                            });
                            setUnread(0);
                            setNotes((n) => n.map((x) => ({ ...x, isRead: true })));
                          }}
                        >
                          Mark all read
                        </button>
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notes.length === 0 && <p className="text-xs text-mist p-3">No notifications yet.</p>}
                        {notes.map((n) => (
                          <Link
                            key={n.id}
                            href={n.href || '/offers'}
                            onClick={() => setNotesOpen(false)}
                            className={`block p-2 rounded-lg text-xs hover:bg-paper ${n.isRead ? 'opacity-70' : ''}`}
                          >
                            <p className="font-semibold">{n.title}</p>
                            <p className="text-mist line-clamp-2">{n.body}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <Link href="/messages" className="p-2 rounded-lg text-ink hover:bg-paper relative" title="Chat">
                  <MessageSquare className="w-5 h-5" />
                  {chatUnread > 0 && (
                    <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-sage text-white text-[10px] leading-4 text-center">
                      {chatUnread}
                    </span>
                  )}
                </Link>
                <Link href={`/profile/${user.id}`} className="flex items-center gap-2 pl-2 border-l border-ink/10">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-sage-tint">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-4 h-4 m-2 text-sage" />
                    )}
                  </div>
                  <span className="hidden xl:flex items-center gap-1 text-xs font-semibold">
                    {user.name}
                    {user.isVerified && <CheckCircle2 className="w-3 h-3 text-sage" />}
                  </span>
                </Link>
                <button onClick={handleLogout} className="p-1.5 text-mist hover:text-clay" title="Sign out">
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <Link href="/login" className="px-3 py-2 text-sm font-semibold hover:text-sage">
                Sign in
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-paper"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-ink/10 bg-surface px-4 py-4 space-y-3">
          <form onSubmit={handleSearchSubmit}>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search listings"
              className="w-full px-3 py-2 rounded-xl bg-paper border border-ink/10 text-sm"
            />
          </form>
          <Link href="/listings" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-medium">
            Browse ads
          </Link>
          <Link href="/favorites" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-medium">
            Favorites
          </Link>
          <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-medium">
            My ads
          </Link>
        </div>
      )}
    </header>
  );
}
