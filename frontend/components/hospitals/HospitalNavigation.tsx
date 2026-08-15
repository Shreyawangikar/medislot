'use client';

import React from 'react';

interface HospitalNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isRegistered: boolean;
}

export const HospitalNavigation: React.FC<HospitalNavigationProps> = ({
  activeTab,
  onTabChange,
  isRegistered,
}) => {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'doctors', label: 'Doctors' },
    { id: 'departments', label: 'Departments' },
    { id: 'facilities', label: 'Facilities' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-1.5 overflow-x-auto">
      <nav className="flex space-x-1 min-w-max">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
