import React from 'react';
import { CheckCircle2, Hospital, Globe, Compass, ShieldCheck } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Visual Illustration */}
          <div className="lg:col-span-5 relative">
            <div className="bg-gradient-to-tr from-teal-600 to-cyan-600 rounded-3xl p-8 text-white shadow-xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md">
                <Compass className="w-4 h-4" />
                <span>Dual Dataset Integration</span>
              </div>

              <h3 className="text-2xl font-black tracking-tight leading-snug">
                Separating Discovery from Reservation for Complete Coverage
              </h3>

              <p className="text-sm text-teal-50/90 leading-relaxed font-normal">
                Patients shouldn’t be limited to only registered facilities when looking for nearby healthcare. MediSlot indexes both registered partner facilities and government directory hospitals.
              </p>

              <div className="space-y-3 pt-2">
                <div className="bg-white/15 backdrop-blur-md p-3.5 rounded-xl border border-white/20 flex items-start gap-3">
                  <Hospital className="w-5 h-5 text-teal-200 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Registered Hospitals</h4>
                    <p className="text-[11px] text-teal-100/90">Full appointment booking, verified doctors, real-time availability.</p>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-xl border border-white/10 flex items-start gap-3">
                  <Globe className="w-5 h-5 text-teal-200 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">External Hospitals</h4>
                    <p className="text-[11px] text-teal-100/90">Informational directory details, emergency contacts, spatial distance.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-7 space-y-6">
            <SectionHeading
              badge="About MediSlot"
              title="A Professional Healthcare Platform Built for Transparent Access"
              subtitle="MediSlot empowers patients and healthcare providers with a modern, location-aware infrastructure."
              centered={false}
            />

            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              MediSlot is engineered to solve healthcare discovery fragmentation. By combining location proximity algorithms with real-time schedule management, patients can find appropriate facilities within 1 to 50 km, explore specialist departments, and manage appointments with total clarity.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                'Location-Aware Proximity Search',
                'Multi-Hospital Tenant Architecture',
                'Specialization & Department Filters',
                'Transparent Registration Badging',
                'Verified Doctor Profiles',
                'Centralized Patient Portal',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                  <span className="text-sm font-semibold text-slate-800">{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-500">
              <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
              <span>MediSlot operates as a discovery and scheduling platform and does not replace emergency 108 medical response services.</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
