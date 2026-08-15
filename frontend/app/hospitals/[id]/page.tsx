'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, Calendar, CheckCircle2, ShieldCheck, Building2, UserCheck } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { mockHospitals } from '@/data/mockHospitals';
import { HospitalHeader } from '@/components/hospitals/HospitalHeader';
import { HospitalGallery } from '@/components/hospitals/HospitalGallery';
import { HospitalNavigation } from '@/components/hospitals/HospitalNavigation';
import { HospitalOverview } from '@/components/hospitals/HospitalOverview';
import { DoctorGrid } from '@/components/hospitals/DoctorGrid';
import { SlotPicker } from '@/components/booking/SlotPicker';
import { BookingModal } from '@/components/booking/BookingModal';
import { RegisteredHospital } from '@/types/hospital';

export default function HospitalDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState('overview');

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<{ id: string; name: string; spec: string } | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null);

  const hospital = mockHospitals.find((h) => h.id === id) || mockHospitals[0];
  const isRegistered = hospital.registered;
  const registeredHosp = isRegistered ? (hospital as RegisteredHospital) : null;

  const defaultDoctor = registeredHosp?.doctors?.[0] || {
    id: 'doc1',
    name: 'Dr. Rahul Deshmukh',
    specialization: 'Cardiology',
  };

  const handleOpenBooking = () => {
    setSelectedDoctor({
      id: defaultDoctor.id,
      name: defaultDoctor.name,
      spec: defaultDoctor.specialization,
    });
    setActiveTab('doctors');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Back Navigation Button */}
          <div>
            <Link
              href="/hospitals"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-teal-700 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Hospital Discovery</span>
            </Link>
          </div>

          {/* Hospital Header Summary */}
          <HospitalHeader hospital={hospital} />

          {/* Gallery + Quick Registration Status Column */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Gallery Column */}
            <div className="lg:col-span-7">
              <HospitalGallery mainImage={hospital.image} name={hospital.name} />
            </div>

            {/* Quick Action Column */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              
              {isRegistered ? (
                <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-400/20 border border-teal-400/30 text-teal-300 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>MediSlot Registered Facility</span>
                  </div>
                  <h3 className="text-2xl font-black">Appointments Available via MediSlot</h3>
                  <p className="text-xs text-teal-100/90 leading-relaxed font-normal">
                    This hospital is registered on the MediSlot network. Select a doctor below to view real-time schedule slots and book your appointment.
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={handleOpenBooking}
                      className="w-full py-3.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Select Slot & Book Appointment</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white border-2 border-amber-200 p-6 sm:p-8 rounded-3xl shadow-soft space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
                    <AlertCircle className="w-4 h-4 text-amber-700" />
                    <span>External Directory Hospital</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Directory Information Only</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    This record is sourced from the official government hospital directory for regional discovery. This hospital has not completed MediSlot tenant registration.
                  </p>

                  <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 font-medium">
                    Appointment booking through MediSlot is unavailable for this hospital.
                  </div>
                </div>
              )}

              {/* Quick Contact Box */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Hospital Helpline</h4>
                <p className="text-lg font-black text-teal-700">{hospital.phone}</p>
                <p className="text-xs text-slate-500">{hospital.address}, {hospital.city}</p>
              </div>

            </div>

          </div>

          {/* Section Navigation Bar */}
          <HospitalNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isRegistered={isRegistered}
          />

          {/* Dynamic Tab Contents */}
          <div className="pt-2">
            {activeTab === 'overview' && <HospitalOverview hospital={hospital} />}

            {activeTab === 'doctors' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-900">Medical Specialists & Doctors</h3>
                    <p className="text-xs text-slate-500">Verified doctor profiles practicing at {hospital.name}</p>
                  </div>
                </div>

                {isRegistered && (
                  <SlotPicker
                    doctorId={selectedDoctor?.id || defaultDoctor.id}
                    doctorName={selectedDoctor?.name || defaultDoctor.name}
                    onSlotSelected={(slot) => {
                      setSelectedSlot(slot);
                      setIsBookingModalOpen(true);
                    }}
                  />
                )}

                <DoctorGrid
                  doctors={registeredHosp?.doctors || []}
                  isRegisteredHospital={isRegistered}
                />
              </div>
            )}

            {activeTab === 'departments' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-extrabold text-slate-900">Clinical Departments</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {(registeredHosp?.departments || [
                    { id: 'dep1', name: 'Emergency & Trauma', description: '24/7 emergency casualty care.', doctorCount: 6 },
                    { id: 'dep2', name: 'General Medicine', description: 'Primary and secondary outpatient care.', doctorCount: 4 },
                  ]).map((dept) => (
                    <div key={dept.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900">{dept.name}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{dept.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(activeTab === 'facilities' || activeTab === 'contact') && (
              <HospitalOverview hospital={hospital} />
            )}
          </div>

        </div>
      </main>

      {/* Booking Confirmation Modal */}
      {selectedDoctor && selectedSlot && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          hospitalId={hospital.id}
          hospitalName={hospital.name}
          doctorId={selectedDoctor.id}
          doctorName={selectedDoctor.name}
          specialization={selectedDoctor.spec}
          slotDate={selectedSlot.date}
          slotTime={selectedSlot.time}
        />
      )}

      <Footer />
    </div>
  );
}
