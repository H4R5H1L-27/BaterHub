'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeftRight, Lock, Mail, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to sign in.');
      }

      localStorage.setItem('demo_user', JSON.stringify(data.user));
      router.push('/listings');
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, password: 'password123' }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('demo_user', JSON.stringify(data.user));
        router.push('/listings');
      } else {
        throw new Error(data.error || 'Demo login failed.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-200/80 shadow-xl p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Welcome Back</h1>
          <p className="text-xs text-gray-500">Sign in to manage your trades, offers & chat</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
              />
              <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
              />
              <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Logins for Testing */}
        <div className="pt-4 border-t border-gray-100">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 text-center">
            One-Click Test Personas
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('alex@example.com')}
              className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-left border border-slate-200 text-xs transition-colors"
            >
              <p className="font-bold text-gray-900 truncate">Alex Turner</p>
              <p className="text-[10px] text-gray-500">SE & Books (NY)</p>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('sarah@example.com')}
              className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-left border border-slate-200 text-xs transition-colors"
            >
              <p className="font-bold text-gray-900 truncate">Sarah Jenkins</p>
              <p className="text-[10px] text-gray-500">PhD Scholar (MA)</p>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('marcus@example.com')}
              className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-left border border-slate-200 text-xs transition-colors"
            >
              <p className="font-bold text-gray-900 truncate">Marcus Chen</p>
              <p className="text-[10px] text-gray-500">Tech & Audio (CA)</p>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('elena@example.com')}
              className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-left border border-slate-200 text-xs transition-colors"
            >
              <p className="font-bold text-gray-900 truncate">Elena Rostova</p>
              <p className="text-[10px] text-gray-500">Student (TX)</p>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500">
          Don't have an account?{' '}
          <Link href="/register" className="font-bold text-indigo-600 hover:underline">
            Register free
          </Link>
        </p>

      </div>
    </div>
  );
}
