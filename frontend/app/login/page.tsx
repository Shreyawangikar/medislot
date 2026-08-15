'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Activity, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await login({ email, password });
      // Role-based redirection
      const role = user.role;
      if (role === 'PATIENT') router.push('/dashboard/patient');
      else if (role === 'DOCTOR') router.push('/dashboard/doctor');
      else if (role === 'HOSPITAL_ADMIN') router.push('/dashboard/hospital-admin');
      else if (role === 'PLATFORM_ADMIN') router.push('/dashboard/admin');
      else router.push('/');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      <main className="flex-grow pt-28 pb-16 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4 space-y-8">
          
          {/* Form Card Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 flex items-center justify-center text-white mx-auto shadow-md shadow-teal-600/30">
              <Activity className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
            <p className="text-xs text-slate-500 font-normal">
              Log in to your MediSlot account to access healthcare features.
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            
            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="patient@medislot.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-4 h-4" />}
                required
              />

              <div className="space-y-1">
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="w-4 h-4" />}
                  required
                />
                <div className="flex justify-end pt-1">
                  <span className="text-xs text-teal-600 hover:text-teal-800 font-semibold cursor-pointer">
                    Forgot Password?
                  </span>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                type="submit"
                disabled={isSubmitting}
                className="mt-2"
              >
                <LogIn className="w-4 h-4" />
                <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
              </Button>
            </form>

            <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
              Don't have an account?{' '}
              <Link href="/signup" className="text-teal-700 font-bold hover:underline">
                Sign Up as Patient
              </Link>
            </div>

          </div>

          {/* Test Accounts Hint Box */}
          <div className="bg-teal-50/70 border border-teal-200 p-4 rounded-2xl text-xs text-teal-900 space-y-1">
            <p className="font-extrabold uppercase tracking-wider text-[10px] text-teal-700">Phase 3 Seed Accounts Available:</p>
            <p className="text-[11px]"><strong>Patient:</strong> patient@medislot.org (Password123!)</p>
            <p className="text-[11px]"><strong>Doctor:</strong> doctor@medislot.org (Password123!)</p>
            <p className="text-[11px]"><strong>Hospital Admin:</strong> hospitaladmin@medislot.org (Password123!)</p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
