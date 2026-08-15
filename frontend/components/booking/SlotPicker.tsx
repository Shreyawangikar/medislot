'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle2, Lock, Radio } from 'lucide-react';
import { subscribeToDoctorSlots } from '@/services/socketService';
import { ClientBookingService } from '@/services/bookingService';

interface SlotPickerProps {
  doctorId: string;
  doctorName: string;
  onSlotSelected: (slot: { date: string; time: string }) => void;
}

export const SlotPicker: React.FC<SlotPickerProps> = ({
  doctorId,
  doctorName,
  onSlotSelected,
}) => {
  const [selectedDate, setSelectedDate] = useState('2026-08-17');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isLiveConnected, setIsLiveConnected] = useState(true);

  const availableSlots = [
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '03:30 PM',
    '04:00 PM',
    '04:30 PM',
  ];

  // Fetch initial booked slots for date
  useEffect(() => {
    ClientBookingService.getBookedSlots(doctorId, selectedDate).then((slots) => {
      setBookedSlots(slots);
    });
  }, [doctorId, selectedDate]);

  // Subscribe to real-time Socket.IO updates for doctor
  useEffect(() => {
    const unsubscribe = subscribeToDoctorSlots(doctorId, (update) => {
      if (update.appointmentDate === selectedDate) {
        if (update.status === 'BOOKED') {
          setBookedSlots((prev) => [...prev, update.startTime]);
          if (selectedTime === update.startTime) {
            setSelectedTime(null);
          }
        } else if (update.status === 'AVAILABLE') {
          setBookedSlots((prev) => prev.filter((s) => s !== update.startTime));
        }
      }
    });

    return () => unsubscribe();
  }, [doctorId, selectedDate, selectedTime]);

  const handleSlotClick = (time: string) => {
    if (bookedSlots.includes(time)) return;
    setSelectedTime(time);
    onSlotSelected({ date: selectedDate, time });
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-6">
      
      {/* Header with Socket.IO Live Indicator */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-600" />
            <span>Select Consultation Slot</span>
          </h3>
          <p className="text-xs text-slate-500">Pick an available time for {doctorName}</p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-emerald-800 text-[11px] font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Real-Time Sync Active</span>
        </div>
      </div>

      {/* Date Selector */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Appointment Date
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['2026-08-17', '2026-08-18', '2026-08-19'].map((date) => {
            const isSelected = selectedDate === date;
            return (
              <button
                key={date}
                type="button"
                onClick={() => {
                  setSelectedDate(date);
                  setSelectedTime(null);
                }}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-600 shadow-md'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{date}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
          <span>Available Schedules ({selectedDate})</span>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-100 border border-teal-400" /> Available
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200 border border-slate-300" /> Reserved
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
          {availableSlots.map((time) => {
            const isBooked = bookedSlots.includes(time);
            const isSelected = selectedTime === time;

            return (
              <button
                key={time}
                type="button"
                disabled={isBooked}
                onClick={() => handleSlotClick(time)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isBooked
                    ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed line-through'
                    : isSelected
                    ? 'bg-teal-600 text-white border-teal-600 shadow-md ring-2 ring-teal-200'
                    : 'bg-teal-50/80 text-teal-900 border border-teal-200 hover:bg-teal-100'
                }`}
              >
                {isBooked ? (
                  <Lock className="w-3 h-3 text-slate-400" />
                ) : isSelected ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                ) : (
                  <Clock className="w-3 h-3 text-teal-600" />
                )}
                <span>{time}</span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
