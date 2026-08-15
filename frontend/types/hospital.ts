export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  qualification: string;
  department: string;
  experienceYears: number;
  availableDays?: string[];
  nextSlot?: string;
  image?: string;
}

export interface DepartmentInfo {
  id: string;
  name: string;
  description: string;
  doctorCount: number;
}

export interface BaseHospital {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  distanceKm: number;
  phone: string;
  email?: string;
  description?: string;
  image: string;
  specializations: string[];
  rating?: number;
  reviewCount?: number;
  facilities?: string[];
}

export interface RegisteredHospital extends BaseHospital {
  registered: true;
  bookingAvailable: true;
  doctors: Doctor[];
  departments: DepartmentInfo[];
}

export interface ExternalHospital extends BaseHospital {
  registered: false;
  bookingAvailable: false;
  source: string;
  sourceId?: string;
}

export type Hospital = RegisteredHospital | ExternalHospital;

export interface HospitalFilterOptions {
  searchQuery: string;
  locationQuery: string;
  radiusKm: number;
  specialization: string;
  department: string;
  hospitalType: 'all' | 'registered' | 'external';
  sortBy: 'distance' | 'name' | 'rating';
}
