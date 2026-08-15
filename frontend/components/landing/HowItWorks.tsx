import React from 'react';
import { Search, UserCheck, CalendarCheck } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      icon: <Search className="w-6 h-6 text-teal-600" />,
      title: 'Find a Hospital',
      description: 'Search nearby healthcare facilities using your location or manual pincode filter with distance sorting.',
    },
    {
      number: '02',
      icon: <UserCheck className="w-6 h-6 text-teal-600" />,
      title: 'Choose a Doctor',
      description: 'Filter specialist doctors by department, experience, and verified qualifications.',
    },
    {
      number: '03',
      icon: <CalendarCheck className="w-6 h-6 text-teal-600" />,
      title: 'Book an Appointment',
      description: 'Select an available schedule slot at registered MediSlot hospitals for instant reservation.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-50/70 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeading
          badge="Simple Process"
          title="How MediSlot Works"
          subtitle="Three straightforward steps to discover healthcare centers and manage your consultations."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-soft relative flex flex-col justify-between space-y-6 group hover:border-teal-300 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <span className="text-3xl font-black text-slate-200 group-hover:text-teal-200 transition-colors">
                  {step.number}
                </span>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="pt-2">
                <span className="text-xs font-semibold text-teal-600 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Learn step detail &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
