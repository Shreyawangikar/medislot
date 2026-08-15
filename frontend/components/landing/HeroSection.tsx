'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Building2, ShieldCheck, Clock, ArrowRight, UserCheck, Stethoscope } from 'lucide-react';
import { Button } from '../ui/Button';

export const HeroSection: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (locationQuery) params.append('location', locationQuery);
    router.push(`/hospitals?${params.toString()}`);
  };

  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 bg-gradient-to-b from-teal-50/60 via-white to-slate-50 overflow-hidden">
      
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-teal-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-40 left-[-100px] w-80 h-80 bg-cyan-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/80 border border-teal-200 text-teal-900 text-xs font-semibold tracking-wide">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              <span>Multi-Hospital Discovery & Scheduling</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Find the right hospital.{' '}
              <span className="text-transparent bg-clip-text gradient-teal">
                Find the right doctor.
              </span>{' '}
              Book with confidence.
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
              MediSlot helps patients discover nearby registered and external government hospitals, browse specialist doctors, check real-time schedule availability, and access healthcare services seamlessly.
            </p>

            {/* Interactive Search Bar UI */}
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white p-3 rounded-2xl shadow-xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-12 gap-2 mt-4"
            >
              {/* Query Field */}
              <div className="sm:col-span-5 relative flex items-center border-b sm:border-b-0 sm:border-r border-slate-100 pb-2 sm:pb-0">
                <Stethoscope className="w-5 h-5 text-teal-600 absolute left-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Hospital, doctor, or specialty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                />
              </div>

              {/* Location Field */}
              <div className="sm:col-span-4 relative flex items-center border-b sm:border-b-0 sm:border-r border-slate-100 pb-2 sm:pb-0">
                <MapPin className="w-5 h-5 text-teal-600 absolute left-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Location or Pincode..."
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                />
              </div>

              {/* Search Submit */}
              <div className="sm:col-span-3">
                <Button variant="primary" size="md" fullWidth type="submit" className="h-full py-3">
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </Button>
              </div>
            </form>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/hospitals">
                <Button variant="primary" size="lg">
                  <span>Find Hospitals</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href="#about">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/60 text-slate-600">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal-600" />
                <span className="text-xs font-semibold">120+ Hospitals</span>
              </div>
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-teal-600" />
                <span className="text-xs font-semibold">500+ Verified Doctors</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-600" />
                <span className="text-xs font-semibold">Real-Time Access</span>
              </div>
            </div>

          </div>

          {/* Right Visual Image Card (Matching the design aesthetic of medical trust) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Primary Visual Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-teal-700 aspect-[4/5] flex flex-col justify-between p-6 text-white group">
                
                {/* Visual Medical Background Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-teal-950 via-teal-900/60 to-teal-800/40 z-10" />
                
                {/* Decorative Pattern Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/20 rounded-full blur-2xl" />

                {/* Top Badge Overlay */}
                <div className="relative z-20 flex justify-between items-start">
                  <div className="bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-white border border-white/30 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>24/7 Healthcare Access</span>
                  </div>
                </div>

                {/* Center Visual Mock Illustration */}
                <div className="relative z-20 space-y-4 my-auto text-center">
                  <div className="w-20 h-20 mx-auto rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-teal-200 shadow-inner">
                    <Stethoscope className="w-10 h-10 text-teal-300" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">Central Medical Network</h3>
                    <p className="text-xs text-teal-100/90 mt-1 max-w-xs mx-auto">
                      Connecting patients directly with multi-specialty care and location-based discovery.
                    </p>
                  </div>
                </div>

                {/* Floating Bottom Card Widget */}
                <div className="relative z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl text-slate-900 shadow-xl border border-white/40 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-extrabold text-slate-900 truncate">Kothrud Specialty Hospital</h4>
                    <p className="text-[11px] text-teal-700 font-medium">1.2 km away • MediSlot Registered</p>
                  </div>
                  <div className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Open
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
