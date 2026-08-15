'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { Stethoscope, ShieldCheck } from 'lucide-react';

function DoctorDashboardContent() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-3xl p-8 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md">
          <Stethoscope className="w-4 h-4 text-teal-300" />
          <span>Doctor Portal</span>
        </div>
        <h1 className="text-3xl font-black">Welcome, {user?.name || 'Doctor'}!</h1>
        <p className="text-xs text-teal-100">
          Logged in as: <strong className="text-white">{user?.email}</strong> (Role: DOCTOR)
        </p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-soft space-y-4 text-center">
        <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mx-auto">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Doctor Access Control Verified</h2>
        <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
          Doctor authentication successful. Doctor roster schedules, consultation slot management, and patient queue dashboards will be implemented in future phases.
        </p>
      </div>
    </div>
  );
}

export default function DoctorDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['DOCTOR']}>
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
        <Navbar />
        <main className="flex-grow pt-24">
          <DoctorDashboardContent />
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
