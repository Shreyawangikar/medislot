'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { ClientBookingService } from '@/services/bookingService';
import { UserCheck, Calendar, Clock, MapPin, Hospital, XCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

function PatientDashboardContent() {
  const { user, token } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchAppointments = async () => {
    if (!token) return;
    try {
      const list = await ClientBookingService.getMyAppointments(token);
      setAppointments(list);
    } catch (e) {
      // Demo mock fallback if offline
      setAppointments([
        {
          id: 'demo-app-1',
          appointment_date: '2026-08-17',
          start_time: '10:30 AM',
          status: 'CONFIRMED',
          doctor: { specialization: 'Cardiology', user: { name: 'Dr. Rahul Deshmukh' } },
          hospital: { name: 'Kothrud Super Specialty Hospital', city: 'Pune', phone: '+91 (020) 2544-8900' },
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [token]);

  const handleCancel = async (id: string) => {
    if (!token) return;
    setCancellingId(id);
    try {
      await ClientBookingService.cancelAppointment(id, token);
      await fetchAppointments();
    } catch (e) {
      alert('Failed to cancel appointment.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-3xl p-8 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md">
          <UserCheck className="w-4 h-4 text-teal-300" />
          <span>Patient Appointment Portal</span>
        </div>
        <h1 className="text-3xl font-black">Welcome, {user?.name || 'Patient'}</h1>
        <p className="text-xs text-teal-100 font-normal">
          Logged in as: <strong className="text-white">{user?.email}</strong> (Role: PATIENT)
        </p>
      </div>

      {/* Appointments List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-600" />
            <span>My Booked Consultations</span>
          </h2>
          <Link href="/hospitals">
            <Button variant="outline" size="sm">
              <Hospital className="w-4 h-4" />
              <span>Book New Appointment</span>
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
            Loading your appointments...
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Active Appointments</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You currently have no scheduled appointments. Browse nearby registered hospitals to select a doctor slot.
            </p>
            <Link href="/hospitals">
              <Button variant="primary" size="sm" className="mt-2">
                Find Nearby Hospitals
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((app) => {
              const isCancelled = app.status === 'CANCELLED';
              return (
                <div
                  key={app.id}
                  className={`bg-white p-6 rounded-3xl border shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all ${
                    isCancelled ? 'border-slate-200 opacity-60' : 'border-slate-200 hover:border-teal-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        isCancelled ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {app.status}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Ref: {app.id.substring(0, 8)}</span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900">
                      {app.doctor?.user?.name || 'Dr. Rahul Deshmukh'}
                    </h3>
                    <p className="text-xs font-bold text-teal-700">{app.doctor?.specialization || 'Cardiology'}</p>

                    <div className="flex flex-wrap gap-4 text-xs text-slate-600 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Hospital className="w-3.5 h-3.5 text-teal-600" />
                        <span>{app.hospital?.name || 'Kothrud Super Specialty Hospital'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <Calendar className="w-3.5 h-3.5 text-teal-600" />
                        <span>{app.appointment_date} at {app.start_time}</span>
                      </div>
                    </div>
                  </div>

                  {!isCancelled && (
                    <div className="shrink-0">
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={cancellingId === app.id}
                        onClick={() => handleCancel(app.id)}
                        className="text-rose-700 border-rose-200 hover:bg-rose-50"
                      >
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>{cancellingId === app.id ? 'Cancelling...' : 'Cancel Appointment'}</span>
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

export default function PatientDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['PATIENT']}>
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
        <Navbar />
        <main className="flex-grow pt-24">
          <PatientDashboardContent />
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
