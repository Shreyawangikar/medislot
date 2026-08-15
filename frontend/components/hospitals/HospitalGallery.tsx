'use client';

import React, { useState } from 'react';

interface HospitalGalleryProps {
  mainImage: string;
  name: string;
}

export const HospitalGallery: React.FC<HospitalGalleryProps> = ({ mainImage, name }) => {
  const [selectedImage, setSelectedImage] = useState(mainImage);

  const galleryThumbnails = [
    mainImage,
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=400&q=80',
  ];

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-slate-100 shadow-sm border border-slate-200">
        <img
          src={selectedImage}
          alt={name}
          className="w-full h-full object-cover transition-all duration-300"
        />
        <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-lg text-white text-[11px] font-bold">
          Hospital Gallery View
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-2">
        {galleryThumbnails.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(img)}
            className={`relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-100 border-2 transition-all ${
              selectedImage === img
                ? 'border-teal-600 scale-95 shadow-md'
                : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            <img src={img} alt={`${name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};
