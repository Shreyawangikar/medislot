import React from 'react';
import { Doctor } from '../../types/hospital';
import { Award, Clock, Calendar, UserCheck } from 'lucide-react';
import { Button } from '../ui/Button';

interface DoctorCardProps {
  doctor: Doctor;
  isRegisteredHospital: boolean;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, isRegisteredHospital }) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft shadow-hover flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        
        {/* Doctor Header */}
        <div className="flex items-start gap-3.5">
          <img
            src={doctor.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'}
            alt={doctor.name}
            className="w-16 h-16 rounded-2xl object-cover bg-slate-100 border border-slate-200 shrink-0"
          />
          <div>
            <h4 className="text-base font-extrabold text-slate-900">{doctor.name}</h4>
            <p className="text-xs font-bold text-teal-700">{doctor.specialization}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{doctor.department} Dept.</p>
          </div>
        </div>

        {/* Qualification & Experience */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Award className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="truncate">{doctor.qualification}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>{doctor.experienceYears} Years Clinical Experience</span>
          </div>
          {doctor.nextSlot && (
            <div className="flex items-center gap-2 text-teal-800 font-semibold bg-teal-50 px-2.5 py-1 rounded-lg">
              <Calendar className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>Next Available: {doctor.nextSlot}</span>
            </div>
          )}
        </div>

      </div>

      {/* Action CTA */}
      <div className="pt-2">
        {isRegisteredHospital ? (
          <Button variant="secondary" size="sm" fullWidth disabled title="Booking coming next phase">
            <UserCheck className="w-3.5 h-3.5" />
            <span>View Doctor Profile</span>
          </Button>
        ) : (
          <Button variant="ghost" size="sm" fullWidth disabled>
            <span>Directory Profile Only</span>
          </Button>
        )}
      </div>

    </div>
  );
};
