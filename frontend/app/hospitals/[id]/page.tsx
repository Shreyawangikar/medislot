'use client';

import React, { useState, use, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, Calendar, CheckCircle2, ShieldCheck, Building2, UserCheck, RefreshCw } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HospitalHeader } from '@/components/hospitals/HospitalHeader';
import { HospitalGallery } from '@/components/hospitals/HospitalGallery';
import { HospitalNavigation } from '@/components/hospitals/HospitalNavigation';
import { HospitalOverview } from '@/components/hospitals/HospitalOverview';
import { DoctorGrid } from '@/components/hospitals/DoctorGrid';
import { SlotPicker } from '@/components/booking/SlotPicker';
import { BookingModal } from '@/components/booking/BookingModal';
import { Hospital, RegisteredHospital } from '@/types/hospital';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const fallbackHospital: Hospital = {
  id: 'unknown',
  name: 'Hospital Details Unavailable',
  address: 'Address not available',
  city: 'Pune',
  state: 'Maharashtra',
  pincode: '411001',
  distanceKm: 0,
  phone: '+91 00000 00000',
  email: 'support@medislot.in',
  description: 'This hospital record is currently unavailable. We are showing placeholder details until the facility information is synced from the database.',
  image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80',
  specializations: ['General Medicine'],
  rating: 4.5,
  reviewCount: 0,
  facilities: ['Emergency Care', 'OPD Services', 'Diagnostic Labs'],
  registered: true,
  bookingAvailable: true,
  doctors: [{
    id: 'default-doc',
    name: 'Dr. Medical Consultant',
    specialization: 'General Medicine',
    qualification: 'MD, MBBS',
    department: 'General Medicine',
    experienceYears: 10,
    availableDays: ['Mon', 'Wed', 'Fri'],
    nextSlot: 'Today 03:00 PM',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
  }],
  departments: [{
    id: 'default-dept',
    name: 'General Medicine',
    description: 'Primary diagnosis, consultation, and outpatient care.',
    doctorCount: 1,
  }],
};

const normalizeHospitalDetails = (item: any): Hospital => {
  const registered = Boolean(item.registered);
  const specializations = Array.isArray(item.specializations) && item.specializations.length > 0
    ? item.specializations
    : ['General Medicine'];

  const normalizedDoctors = Array.isArray(item.doctors)
    ? item.doctors.map((doctor: any, index: number) => ({
      id: doctor.id || `doctor-${index}`,
      name: doctor.name || 'Medical Specialist',
      specialization: doctor.specialization || specializations[0],
      qualification: doctor.qualification || 'MBBS, MD',
      department: doctor.department || 'General Medicine',
      experienceYears: Number(doctor.experienceYears ?? 8),
      availableDays: doctor.availableDays || ['Mon', 'Wed', 'Fri'],
      nextSlot: doctor.nextSlot || 'Today 03:00 PM',
      image: doctor.image || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
    }))
    : [];

  const normalizedDepartments = Array.isArray(item.departments) && item.departments.length > 0
    ? item.departments.map((dept: any, index: number) => ({
      id: dept.id || `dept-${index}`,
      name: dept.name || 'General Medicine',
      description: dept.description || 'Patient care and specialty services.',
      doctorCount: Number(dept.doctorCount ?? Math.max(normalizedDoctors.length, 1)),
    }))
    : [{
      id: 'default-dept',
      name: 'General Medicine',
      description: 'Patient care and specialty services.',
      doctorCount: Math.max(normalizedDoctors.length, 1),
    }];

  return {
    id: String(item.id || 'unknown'),
    name: item.name || 'Hospital',
    address: item.address || 'Address not available',
    city: item.city || 'Pune',
    state: item.state || 'Maharashtra',
    pincode: item.pincode || '411001',
    distanceKm: Number(item.distanceKm ?? 0),
    phone: item.phone || '+91 00000 00000',
    email: item.email || 'support@medislot.in',
    description: item.description || `${item.name || 'This hospital'} provides ${specializations.slice(0, 2).join(', ')} care and patient-focused medical services.`,
    image: item.image || 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
    specializations,
    rating: Number(item.rating ?? (registered ? 4.7 : 4.2)),
    reviewCount: Number(item.reviewCount ?? 0),
    facilities: Array.isArray(item.facilities) && item.facilities.length > 0 ? item.facilities : ['Emergency Care', 'Diagnostics', 'Pharmacy'],
    ...(registered
      ? {
        registered: true,
        bookingAvailable: true,
        doctors: normalizedDoctors.length > 0 ? normalizedDoctors : fallbackHospital.doctors,
        departments: normalizedDepartments,
      }
      : {
        registered: false,
        bookingAvailable: false,
        source: item.source || 'Government Hospital Directory',
        sourceId: item.sourceId || item.id,
      }),
  } as Hospital;
};

export default function HospitalDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState('overview');
  const [hospital, setHospital] = useState<Hospital>(fallbackHospital);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<{ id: string; name: string; spec: string } | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    fetch(`${API_BASE_URL}/api/hospitals/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Request failed with status ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        setHospital(normalizeHospitalDetails(data));
      })
      .catch((error) => {
        if (!isMounted) return;
        console.error('Hospital detail fetch failed:', error);
        setHospital(fallbackHospital);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-10 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
              <p className="text-sm font-semibold text-slate-700">Loading hospital details...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
