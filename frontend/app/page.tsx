import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeatureSection } from '@/components/landing/FeatureSection';
import { AboutSection } from '@/components/landing/AboutSection';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { ContactSection } from '@/components/landing/ContactSection';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans antialiased text-slate-900 selection:bg-teal-100 selection:text-teal-900">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeatureSection />
        <AboutSection />
        <HowItWorks />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
