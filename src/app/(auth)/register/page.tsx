'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Lock, 
  Mail, 
  User, 
  MapPin, 
  AlertCircle, 
  ArrowRight,
  Repeat,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  QrCode
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('New York');
  const [state, setState] = useState('NY');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, city, state }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create account.');
      }

      localStorage.setItem('demo_user', JSON.stringify(data.user));
      router.push('/listings');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full overflow-hidden py-10 min-h-[calc(100vh-5rem)]">
      {/* Ambient background glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-secondary/10 blur-3xl pointer-events-none"></div>

      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="p-6 sm:p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-sm flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-primary text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Join the Circular Marketplace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">Create Trader Account</h1>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5">
              Set up your profile, list items for exchange, and unlock verified 6-digit meetup protection.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center p-1 rounded-full bg-surface-container-low">
            <Link
              href="/login"
              className="flex-1 py-2 rounded-full text-xs font-semibold transition-all text-center text-on-surface-variant hover:text-on-surface"
            >
              Sign In
            </Link>
            <button
              type="button"
              className="flex-1 py-2 rounded-full text-xs font-bold transition-all text-center bg-surface-container-lowest text-primary shadow-sm"
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="p-3.5 bg-error-container/40 border border-error/30 rounded-xl text-on-error-container text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-error" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface">Full Legal / Campus Name</label>
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-surface-container-low focus-within:bg-surface-container-lowest focus-within:ring-1 focus-within:ring-primary transition-all">
                <User className="w-4 h-4 text-outline" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Marcus Chen"
                  className="w-full bg-transparent border-none focus:outline-none text-xs text-on-surface placeholder:text-outline"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-on-surface">Institutional / Email Address</label>
                <span className="text-[11px] text-tertiary font-medium">Campus .edu favored</span>
              </div>
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-surface-container-low focus-within:bg-surface-container-lowest focus-within:ring-1 focus-within:ring-primary transition-all">
                <Mail className="w-4 h-4 text-outline" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="marcus@campus.edu"
                  className="w-full bg-transparent border-none focus:outline-none text-xs text-on-surface placeholder:text-outline"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface">Secret Passphrase</label>
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-surface-container-low focus-within:bg-surface-container-lowest focus-within:ring-1 focus-within:ring-primary transition-all">
                <Lock className="w-4 h-4 text-outline" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-transparent border-none focus:outline-none text-xs text-on-surface placeholder:text-outline"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface">Home City</label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-low focus-within:bg-surface-container-lowest focus-within:ring-1 focus-within:ring-primary transition-all">
                  <MapPin className="w-3.5 h-3.5 text-outline" />
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-transparent border-none focus:outline-none text-xs text-on-surface"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface">State</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low focus-within:bg-surface-container-lowest focus-within:ring-1 focus-within:ring-primary transition-all text-xs text-on-surface"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-full bg-primary hover:bg-primary-container text-on-primary font-semibold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-3 disabled:opacity-50"
            >
              <span>{loading ? 'Creating Profile...' : 'Complete Registration & Start Bartering'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/15 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
            <p className="text-[11px] text-on-surface-variant leading-tight">
              By registering, you agree to honest item grading rubrics, community safety safe-spot meetups, and verified barter handshakes.
            </p>
          </div>

          <div className="text-center">
            <span className="text-xs text-on-surface-variant">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-primary hover:underline">
                Sign In
              </Link>
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
