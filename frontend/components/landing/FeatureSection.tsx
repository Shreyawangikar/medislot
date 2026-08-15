import React from 'react';
import { MapPin, UserCheck, CalendarCheck, ShieldCheck, Building2 } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { FeatureCard } from './FeatureCard';

export const FeatureSection: React.FC = () => {
  const features = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Nearby Hospital Discovery',
      description: 'Locate healthcare centers near your current location or specified area with radius filtering (1km to 50km).',
      badge: 'Location-Aware',
    },
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: 'Doctor Discovery',
      description: 'Search doctors by medical specialization, qualification, department, and experience across network hospitals.',
      badge: 'Specialists',
    },
    {
      icon: <CalendarCheck className="w-6 h-6" />,
      title: 'Appointment Availability',
      description: 'View real-time schedule slots for registered healthcare centers without waiting in long clinic queues.',
      badge: 'Real-Time',
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: 'Secure Booking Framework',
      description: 'Guaranteed single-patient slot reservation with concurrency-safe booking logic.',
      badge: 'Protected',
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      title: 'Multi-Hospital Access',
      description: 'Explore both MediSlot-registered partner facilities and regional government directory hospitals.',
      badge: 'Unified',
    },
  ];

  return (
    <section className="py-20 bg-slate-50/70 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeading
          badge="Platform Capabilities"
          title="Designed for Effortless Healthcare Navigation"
          subtitle="MediSlot unifies hospital discovery and appointment workflows in a seamless, reliable platform."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <FeatureCard
              key={idx}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              badge={feature.badge}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
