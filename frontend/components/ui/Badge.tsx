import React from 'react';

interface BadgeProps {
  variant?: 'registered' | 'external' | 'teal' | 'gray' | 'outline';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'teal',
  children,
  className = '',
}) => {
  const variantStyles = {
    registered: 'bg-teal-50 text-teal-800 border border-teal-200 font-semibold',
    external: 'bg-slate-100 text-slate-700 border border-slate-200 font-medium',
    teal: 'bg-teal-100 text-teal-900 font-medium',
    gray: 'bg-slate-100 text-slate-700 font-medium',
    outline: 'border border-slate-300 text-slate-700 font-medium',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs gap-1.5 transition-colors ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};
