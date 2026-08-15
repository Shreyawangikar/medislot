'use client';

import React, { useState } from 'react';
import { X, Calendar, Clock, Building2, User, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { ClientBookingService } from '@/services/bookingService';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  hospitalId: string;
  hospitalName: string;
  doctorId: string;
  doctorName: string;
  specialization: string;
  slotDate: string;
  slotTime: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  hospitalId,
  hospitalName,
  doctorId,
  doctorName,
  specialization,
  slotDate,
  slotTime,
}) => {
  const router = useRouter();
  const { user, token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successBooking, setSuccessBooking] = useState<any>(null);

  if (!isOpen) return null;

  const handleConfirmBooking = async () => {
    setError('');
    if (!user || !token) {
      setError('Please sign in to complete your appointment booking.');
      router.push('/login');
      return;
    }

    setIsSubmitting(true);
    const idempotencyKey = `idemp_${user.id}_${Date.now()}`;

    try {
      const response = await ClientBookingService.bookAppointment(
        {
          doctor_id: doctorId,
          hospital_id: hospitalId,
          appointment_date: slotDate,
          start_time: slotTime,
        },
        token,
        idempotencyKey
      );

      setSuccessBooking(response.appointment);
    } catch (err: any) {
      setError(err.message || 'Slot collision: This slot was just reserved by another patient.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white max-w-lg w-full rounded-3xl border border-slate-200 shadow-2xl overflow-hidden space-y-6">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">Confirm Appointment</h3>
              <p className="text-xs text-teal-300">MediSlot Transactional Booking</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 pt-0 space-y-6">
          
          {successBooking ? (
            /* Success Summary State */
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-2xl font-black text-slate-900">Appointment Reserved!</h4>
                <p className="text-xs text-slate-600">
                  Your appointment with <strong className="text-slate-900">{doctorName}</strong> is confirmed.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Hospital:</span>
                  <span className="font-bold text-slate-800">{hospitalName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date & Time:</span>
                  <span className="font-bold text-teal-700">{slotDate} at {slotTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Booking Reference:</span>
                  <span className="font-mono text-slate-700 text-[11px]">{successBooking.id.substring(0, 8)}</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => {
                  onClose();
                  router.push('/dashboard/patient');
                }}
              >
                View My Appointments
              </Button>
            </div>
          ) : (
            /* Reservation Confirmation State */
            <>
              {error && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-teal-600" />
                  <span className="text-slate-500">Doctor:</span>
                  <span className="font-bold text-slate-900 ml-auto">{doctorName} ({specialization})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-teal-600" />
                  <span className="text-slate-500">Hospital:</span>
                  <span className="font-bold text-slate-900 ml-auto">{hospitalName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  <span className="text-slate-500">Date:</span>
                  <span className="font-bold text-slate-900 ml-auto">{slotDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-600" />
                  <span className="text-slate-500">Slot Time:</span>
                  <span className="font-bold text-teal-700 ml-auto">{slotTime}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-teal-50/70 p-3 rounded-xl border border-teal-200">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Protected by MediSlot Concurrency Transaction Engine (Double-booking prevention active).</span>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button variant="outline" size="md" fullWidth onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={handleConfirmBooking}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Reserving Slot...' : 'Confirm Booking'}
                </Button>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
