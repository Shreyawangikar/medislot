'use client';

import React, { useState } from 'react';
import { Navigation, MapPin, Search } from 'lucide-react';
import { Button } from '../ui/Button';

interface LocationSelectorProps {
  locationValue: string;
  onLocationChange: (val: string) => void;
  onUseCurrentLocation: () => void;
  isLocating?: boolean;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  locationValue,
  onLocationChange,
  onUseCurrentLocation,
  isLocating = false,
}) => {
  const [activeTab, setActiveTab] = useState<'current' | 'manual'>('current');

  const presetLocations = ['Kothrud, Pune', 'Shivajinagar, Pune', 'Aundh, Pune', '411038', '411005'];

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 text-slate-800 text-xs font-bold uppercase tracking-wider">
          <MapPin className="w-4 h-4 text-teal-600" />
          <span>Search Location</span>
        </div>
        
        {/* Toggle Mode */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setActiveTab('current')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              activeTab === 'current' ? 'bg-white text-teal-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Current Location
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              activeTab === 'manual' ? 'bg-white text-teal-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Manual Entry
          </button>
        </div>
      </div>

      {activeTab === 'current' ? (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={onUseCurrentLocation}
            disabled={isLocating}
            className="w-full sm:w-auto"
          >
            <Navigation className={`w-4 h-4 text-teal-600 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Detecting Coordinates...' : 'Use My Current Location'}</span>
          </Button>
          <p className="text-xs text-slate-500 font-medium">
            Active position: <span className="text-teal-700 font-bold">{locationValue || 'Detecting browser coordinates...'}</span>
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="e.g. Kothrud, Shivajinagar, or 411038"
              value={locationValue}
              onChange={(e) => onLocationChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 items-center text-xs">
            <span className="text-slate-400 font-medium">Popular:</span>
            {presetLocations.map((loc) => (
              <button
                key={loc}
                onClick={() => onLocationChange(loc)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 transition-colors"
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
