import React from 'react';
import { Doctor } from '../../types/hospital';
import { DoctorCard } from './DoctorCard';

interface DoctorGridProps {
  doctors: Doctor[];
  isRegisteredHospital: boolean;
}

export const DoctorGrid: React.FC<DoctorGridProps> = ({ doctors, isRegisteredHospital }) => {
  if (!doctors || doctors.length === 0) {
    return (
      <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
        Doctor directory profile data is currently not available for this facility.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {doctors.map((doctor) => (
        <DoctorCard
          key={doctor.id}
          doctor={doctor}
          isRegisteredHospital={isRegisteredHospital}
        />
      ))}
    </div>
  );
};
