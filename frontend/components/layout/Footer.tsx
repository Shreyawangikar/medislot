import React from 'react';
import Link from 'next/link';
import { Activity, ShieldCheck, Heart, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
                <Activity className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Medi<span className="text-teal-400">Slot</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              MediSlot is a multi-hospital healthcare discovery & appointment platform empowering patients to easily search nearby hospitals, doctors, and real-time medical services.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <div className="flex items-center gap-1.5 text-xs text-teal-400 bg-teal-950/60 border border-teal-800/60 px-3 py-1.5 rounded-full">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Healthcare Network</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-teal-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/hospitals" className="hover:text-teal-400 transition-colors">Find Hospitals</Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-teal-400 transition-colors">About MediSlot</Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-teal-400 transition-colors">How It Works</Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-teal-400 transition-colors">Contact Support</Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Support & Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#contact" className="hover:text-teal-400 transition-colors">Help Center</Link>
              </li>
              <li>
                <span className="cursor-pointer hover:text-teal-400 transition-colors">Privacy Policy</span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-teal-400 transition-colors">Terms of Service</span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-teal-400 transition-colors">Hospital Registration</span>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Contact Us</h3>
            <div className="space-y-2.5 text-sm text-slate-400">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Healthcare Tech Hub, Kothrud, Pune, Maharashtra 411038</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>+91 (020) 2544-8000</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>support@medislot.org</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} MediSlot Healthcare Platform. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with care for public health</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
