import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, CheckCircle2, AlertCircle, ArrowRight, Star, Calendar } from 'lucide-react';
import { Hospital } from '../../types/hospital';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface HospitalCardProps {
  hospital: Hospital;
}

export const HospitalCard: React.FC<HospitalCardProps> = ({ hospital }) => {
  const isRegistered = hospital.registered;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft shadow-hover overflow-hidden flex flex-col md:flex-row group">
      
      {/* Hospital Image Container */}
      <div className="relative md:w-72 h-48 md:h-auto shrink-0 bg-slate-100 overflow-hidden">
        <img
          src={hospital.image}
          alt={hospital.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isRegistered ? (
            <Badge variant="registered">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
              <span>MediSlot Registered</span>
            </Badge>
          ) : (
            <Badge variant="external">
              <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>Not Registered</span>
            </Badge>
          )}
        </div>
        
        <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-bold text-white flex items-center gap-1">
          <MapPin className="w-3 h-3 text-teal-400" />
          <span>{hospital.distanceKm} km away</span>
        </div>
      </div>

      {/* Hospital Info & Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-teal-700 transition-colors">
                {hospital.name}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{hospital.address}, {hospital.city} - {hospital.pincode}</span>
              </p>
            </div>
            {hospital.rating && (
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 text-xs font-bold text-amber-800 shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{hospital.rating}</span>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {hospital.description}
          </p>

          {/* Specialization Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {hospital.specializations.slice(0, 4).map((spec, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold"
              >
                {spec}
              </span>
            ))}
            {hospital.specializations.length > 4 && (
              <span className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-400 text-[10px] font-semibold">
                +{hospital.specializations.length - 4} more
              </span>
            )}
          </div>

        </div>

        {/* Action Bar */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-teal-600" />
            <span className="font-semibold text-slate-700">{hospital.phone}</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            
            {/* View Details Link */}
            <Link href={`/hospitals/${hospital.id}`}>
              <Button variant="outline" size="sm">
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>

            {/* Registered vs External Booking Action */}
            {isRegistered ? (
              <Button
                variant="primary"
                size="sm"
                disabled
                title="Appointment booking will be enabled in Phase 4"
                className="opacity-90"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Appointment</span>
              </Button>
            ) : (
              <div className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-xl font-medium">
                MediSlot Booking Unavailable
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
