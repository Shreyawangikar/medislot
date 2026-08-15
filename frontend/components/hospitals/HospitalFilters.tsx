import React from 'react';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { HospitalFilterOptions } from '../../types/hospital';

interface HospitalFiltersProps {
  filters: HospitalFilterOptions;
  onFilterChange: (newFilters: Partial<HospitalFilterOptions>) => void;
  onReset: () => void;
}

export const HospitalFilters: React.FC<HospitalFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const specializations = [
    'All Specializations',
    'Cardiology',
    'Orthopedics',
    'Neurology',
    'Pediatrics',
    'Oncology',
    'Gastroenterology',
    'General Medicine',
  ];

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 text-slate-800 text-xs font-bold uppercase tracking-wider">
          <SlidersHorizontal className="w-4 h-4 text-teal-600" />
          <span>Filters & Options</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-teal-600 hover:text-teal-800 font-semibold transition-colors"
        >
          Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Hospital Registration Type Filter */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
            Hospital Type
          </label>
          <select
            value={filters.hospitalType}
            onChange={(e) => onFilterChange({ hospitalType: e.target.value as any })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-teal-500 focus:bg-white"
          >
            <option value="all">All Hospitals (Combined)</option>
            <option value="registered">MediSlot Registered Only</option>
            <option value="external">External Directory Only</option>
          </select>
        </div>

        {/* Specialization Filter */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
            Specialization
          </label>
          <select
            value={filters.specialization}
            onChange={(e) => onFilterChange({ specialization: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-teal-500 focus:bg-white"
          >
            {specializations.map((spec) => (
              <option key={spec} value={spec === 'All Specializations' ? '' : spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
            Sort Results By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-teal-500 focus:bg-white"
          >
            <option value="distance">Nearest Distance (km)</option>
            <option value="rating">Top Rated</option>
            <option value="name">Alphabetical (A-Z)</option>
          </select>
        </div>

      </div>
    </div>
  );
};
