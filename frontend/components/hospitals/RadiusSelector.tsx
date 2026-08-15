import React from 'react';
import { Compass } from 'lucide-react';

interface RadiusSelectorProps {
  selectedRadius: number;
  onRadiusChange: (radius: number) => void;
}

export const RadiusSelector: React.FC<RadiusSelectorProps> = ({
  selectedRadius,
  onRadiusChange,
}) => {
  const options = [1, 5, 10, 25, 50];

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
      <div className="flex items-center gap-2 text-slate-800 text-xs font-bold uppercase tracking-wider">
        <Compass className="w-4 h-4 text-teal-600" />
        <span>Search Radius</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((r) => {
          const isSelected = selectedRadius === r;
          return (
            <button
              key={r}
              onClick={() => onRadiusChange(r)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                isSelected
                  ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {r} km
            </button>
          );
        })}
      </div>
    </div>
  );
};
