'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Building2, AlertCircle, RefreshCw } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LocationSelector } from '@/components/hospitals/LocationSelector';
import { RadiusSelector } from '@/components/hospitals/RadiusSelector';
import { HospitalFilters } from '@/components/hospitals/HospitalFilters';
import { HospitalCard } from '@/components/hospitals/HospitalCard';
import { mockHospitals } from '@/data/mockHospitals';
import { HospitalFilterOptions, Hospital } from '@/types/hospital';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Geocoding dictionary for popular Pune landmarks & pincodes
const resolveLocationCoords = (locStr: string): { lat: number; lng: number } | null => {
  const q = locStr.toLowerCase().replace(/['"]/g, '').trim();
  if (!q) return null;
  if (q.includes('shivajinagar') || q.includes('411005') || q.includes('fc road') || q.includes('shimla office')) {
    return { lat: 18.5314, lng: 73.8446 };
  }
  if (q.includes('kothrud') || q.includes('411038') || q.includes('karve road') || q.includes('paud road')) {
    return { lat: 18.5074, lng: 73.8077 };
  }
  if (q.includes('aundh') || q.includes('411007') || q.includes('dp road')) {
    return { lat: 18.5580, lng: 73.8070 };
  }
  if (q.includes('baner') || q.includes('balewadi') || q.includes('411045')) {
    return { lat: 18.5596, lng: 73.7799 };
  }
  if (q.includes('hadapsar') || q.includes('magarpatta') || q.includes('411028')) {
    return { lat: 18.5089, lng: 73.9260 };
  }
  if (q.includes('viman nagar') || q.includes('411014') || q.includes('nagar road')) {
    return { lat: 18.5679, lng: 73.9143 };
  }
  return null;
};

function HospitalsContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialLocation = searchParams.get('location') || '';

  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: 18.5314,
    lng: 73.8446,
  });

  const [apiHospitals, setApiHospitals] = useState<Hospital[]>(mockHospitals);

  const [filters, setFilters] = useState<HospitalFilterOptions>({
    searchQuery: initialQuery,
    locationQuery: initialLocation || 'Shivajinagar, Pune',
    radiusKm: 10,
    specialization: '',
    department: '',
    hospitalType: 'all',
    sortBy: 'distance',
  });

  const currentLat = coords.lat;
  const currentLng = coords.lng;

  // Interconnected Location & Spatial Search Engine
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const params = new URLSearchParams({
      lat: currentLat.toString(),
      lng: currentLng.toString(),
      radius: filters.radiusKm.toString(),
      hospitalType: filters.hospitalType,
    });
    if (filters.specialization) params.append('specialization', filters.specialization);
    if (filters.searchQuery) params.append('q', filters.searchQuery);

    fetch(`${API_BASE_URL}/api/hospitals/nearby?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data && data.hospitals && Array.isArray(data.hospitals) && data.hospitals.length > 0) {
          setApiHospitals(data.hospitals);
        } else {
          // Calculate exact distances from active coordinates
          const calculated = mockHospitals.map((h) => {
            let hLat = 18.5074;
            let hLng = 73.8077;
            if (h.name.toLowerCase().includes('sancheti') || h.pincode === '411005') {
              hLat = 18.5314;
              hLng = 73.8446;
            } else if (h.name.toLowerCase().includes('shivajinagar')) {
              hLat = 18.5314;
              hLng = 73.8446;
            } else if (h.name.toLowerCase().includes('aundh')) {
              hLat = 18.5580;
              hLng = 73.8070;
            } else if (h.name.toLowerCase().includes('baner')) {
              hLat = 18.5596;
              hLng = 73.7799;
            }

            const R = 6371;
            const dLat = ((hLat - currentLat) * Math.PI) / 180;
            const dLon = ((hLng - currentLng) * Math.PI) / 180;
            const a =
              Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos((currentLat * Math.PI) / 180) *
                Math.cos((hLat * Math.PI) / 180) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const dist = Math.round(R * c * 10) / 10;
            return { ...h, distanceKm: Math.max(0.4, dist) };
          });
          setApiHospitals(calculated);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setApiHospitals(mockHospitals);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentLat, currentLng, filters.radiusKm, filters.hospitalType, filters.specialization, filters.searchQuery]);

  // Handle Manual & Controlled Location Interconnection
  const handleFilterChange = (newFilters: Partial<HospitalFilterOptions>) => {
    if (newFilters.locationQuery !== undefined) {
      const resolved = resolveLocationCoords(newFilters.locationQuery);
      if (resolved) {
        setCoords(resolved);
      }
    }
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Exact callback functions requested by user
  function gotLocation(position: GeolocationPosition) {
    console.log(position);
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    setCoords({ lat, lng });
    setIsLocating(false);
    setFilters((prev) => ({
      ...prev,
      locationQuery: `Current Location (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`,
    }));
  }

  function failedToGet(error: GeolocationPositionError) {
    console.log('There was some issue');
    console.log(error);
    setIsLocating(false);
    alert(`There was some issue getting location: ${error.message}`);
  }

  const handleUseCurrentLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      alert('Browser geolocation is not supported on this device.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(gotLocation, failedToGet);
  };

  // Fully Interconnected Results Filtering
  const filteredHospitals = useMemo(() => {
    const q = filters.searchQuery.replace(/['"]/g, '').trim().toLowerCase();

    return apiHospitals
      .filter((h) => {
        // Keyword Match Check
        const matchName = q ? h.name.toLowerCase().includes(q) : false;
        const matchAddress = q ? (h.address.toLowerCase().includes(q) || h.city.toLowerCase().includes(q)) : false;
        const matchPincode = q && h.pincode ? h.pincode.includes(q) : false;
        const matchSpec = q ? h.specializations.some((s) => s.toLowerCase().includes(q)) : false;
        const matchDoctor = q && (h as any).doctors ? (h as any).doctors.some((d: any) => d.name?.toLowerCase().includes(q)) : false;

        const isKeywordMatch = matchName || matchAddress || matchPincode || matchSpec || matchDoctor;

        if (q && !isKeywordMatch) return false;

        // Radius filter: apply radius constraint unless explicit keyword search is active
        if (!q && h.distanceKm > filters.radiusKm) return false;

        // Registration type filter
        if (filters.hospitalType === 'registered' && !h.registered) return false;
        if (filters.hospitalType === 'external' && h.registered) return false;

        // Specialization filter
        if (filters.specialization) {
          const specMatch = h.specializations.some(
            (s) => s.toLowerCase() === filters.specialization.toLowerCase()
          );
          if (!specMatch) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'distance') return a.distanceKm - b.distanceKm;
        if (filters.sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (filters.sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [apiHospitals, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-3xl p-8 text-white shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md">
          <Building2 className="w-4 h-4 text-teal-300" />
          <span>Unified Hospital Discovery</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          Explore Hospitals & Medical Facilities
        </h1>
        <p className="text-sm sm:text-base text-teal-100/90 max-w-2xl font-normal">
          Discover registered MediSlot centers and government directory hospitals within your target search area.
        </p>

        {/* Interconnected Search Input Bar */}
        <div className="relative max-w-2xl pt-2">
          <Search className="absolute left-4 top-5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search hospitals by name (e.g. Sancheti, Kothrud), doctor name, specialization, or area..."
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange({ searchQuery: e.target.value })}
            className="w-full bg-white text-slate-900 rounded-2xl pl-12 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-md font-medium placeholder:text-slate-400"
          />
          {filters.searchQuery && (
            <button
              onClick={() => handleFilterChange({ searchQuery: '' })}
              className="absolute right-4 top-4.5 text-xs text-slate-400 hover:text-slate-600 font-bold bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Control Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <LocationSelector
            locationValue={filters.locationQuery}
            onLocationChange={(val) => handleFilterChange({ locationQuery: val })}
            onUseCurrentLocation={handleUseCurrentLocation}
            isLocating={isLocating}
          />

          <RadiusSelector
            selectedRadius={filters.radiusKm}
            onRadiusChange={(radius) => handleFilterChange({ radiusKm: radius })}
          />
        </div>

        {/* Right Main Filters & Results Area */}
        <div className="lg:col-span-8 space-y-6">
          <HospitalFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={() =>
              setFilters({
                searchQuery: '',
                locationQuery: 'Shivajinagar, Pune',
                radiusKm: 10,
                specialization: '',
                department: '',
                hospitalType: 'all',
                sortBy: 'distance',
              })
            }
          />

          {/* Results Summary Bar */}
          <div className="flex items-center justify-between px-2 text-xs font-semibold text-slate-600">
            <span>
              Showing <strong className="text-teal-700">{filteredHospitals.length}</strong> hospitals within {filters.radiusKm} km radius
            </span>
            <span className="text-slate-400">
              Sorted by: <strong className="text-slate-700 capitalize">{filters.sortBy}</strong>
            </span>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="py-20 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
              <p className="text-sm font-semibold text-slate-700">Searching nearby medical centers...</p>
            </div>
          ) : filteredHospitals.length === 0 ? (
            /* Empty State */
            <div className="py-16 px-6 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">No Hospitals Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {filters.searchQuery
                    ? `No medical centers matched "${filters.searchQuery}". Try clearing search keywords.`
                    : `No medical centers matched your search query or radius filter (${filters.radiusKm} km). Try expanding your radius.`}
                </p>
              </div>
              <button
                onClick={() =>
                  setFilters({
                    searchQuery: '',
                    locationQuery: 'Shivajinagar, Pune',
                    radiusKm: 50,
                    specialization: '',
                    department: '',
                    hospitalType: 'all',
                    sortBy: 'distance',
                  })
                }
                className="px-4 py-2 rounded-xl bg-teal-50 text-teal-700 text-xs font-semibold hover:bg-teal-100 transition-colors"
              >
                Expand Radius to 50 km
              </button>
            </div>
          ) : (
            /* Results Grid */
            <div className="space-y-4">
              {filteredHospitals.map((hospital) => (
                <HospitalCard key={hospital.id} hospital={hospital} />
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default function HospitalsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />
      <main className="flex-grow pt-20">
        <Suspense fallback={<div className="p-10 text-center text-sm text-slate-500">Loading Hospitals...</div>}>
          <HospitalsContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
