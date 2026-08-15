import React from 'react';
import { Hospital } from '../../types/hospital';
import { Building2, CheckCircle2, ShieldCheck, MapPin, Phone, Mail, Award } from 'lucide-react';

interface HospitalOverviewProps {
  hospital: Hospital;
}

export const HospitalOverview: React.FC<HospitalOverviewProps> = ({ hospital }) => {
  return (
    <div className="space-y-8">
      
      {/* About Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-4">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-teal-600" />
          <span>About {hospital.name}</span>
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed">
          {hospital.description || 'This hospital provides multi-specialty care and health services to the local community.'}
        </p>

        {/* Specializations Grid */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Clinical Specializations</h4>
          <div className="flex flex-wrap gap-2">
            {hospital.specializations.map((spec, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-xl bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-100 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                <span>{spec}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Facilities & Infrastructure */}
      {hospital.facilities && hospital.facilities.length > 0 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-4">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-teal-600" />
            <span>Facilities & Infrastructure</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {hospital.facilities.map((fac, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span className="text-xs font-bold text-slate-800">{fac}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact & Location Info */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-4">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-teal-600" />
          <span>Location & Contact Details</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Full Address</span>
            <p className="font-semibold text-slate-800">{hospital.address}</p>
            <p className="text-slate-600">{hospital.city}, {hospital.state} - {hospital.pincode}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Helpline Phone</span>
            <p className="font-bold text-teal-700">{hospital.phone}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Email Contact</span>
            <p className="font-semibold text-slate-800">{hospital.email || 'N/A'}</p>
          </div>
        </div>
      </div>

    </div>
  );
};
