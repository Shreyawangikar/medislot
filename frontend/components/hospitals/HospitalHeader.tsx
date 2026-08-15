import React from 'react';
import { MapPin, Phone, Mail, CheckCircle2, AlertCircle, Calendar, Star, Building2 } from 'lucide-react';
import { Hospital } from '../../types/hospital';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface HospitalHeaderProps {
  hospital: Hospital;
}

export const HospitalHeader: React.FC<HospitalHeaderProps> = ({ hospital }) => {
  const isRegistered = hospital.registered;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6 sm:p-8 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left Hospital Meta */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {isRegistered ? (
              <Badge variant="registered">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                <span>MediSlot Registered Facility</span>
              </Badge>
            ) : (
              <Badge variant="external">
                <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
                <span>Government Directory (External)</span>
              </Badge>
            )}

            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full flex items-center gap-1">
              <MapPin className="w-3 h-3 text-teal-600" />
              <span>{hospital.distanceKm} km away</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {hospital.name}
          </h1>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-teal-600" />
              <span>{hospital.address}, {hospital.city} - {hospital.pincode}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-teal-600" />
              <span>{hospital.phone}</span>
            </div>
            {hospital.email && (
              <div className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-teal-600" />
                <span>{hospital.email}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          {isRegistered ? (
            <div className="space-y-1 text-center sm:text-right">
              <Button variant="primary" size="lg" disabled className="w-full sm:w-auto">
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </Button>
              <p className="text-[10px] text-teal-700 font-medium">
                Appointments available through MediSlot
              </p>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-center space-y-1">
              <p className="text-xs font-bold text-amber-900">Not Registered with MediSlot</p>
              <p className="text-[11px] text-amber-700 font-medium">
                Appointment booking through MediSlot is unavailable for this hospital.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
