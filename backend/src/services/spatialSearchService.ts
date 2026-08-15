import { prisma } from '../config/prisma';

export interface LocationSearchParams {
  latitude: number;
  longitude: number;
  radiusKm?: number;
  specialization?: string;
  hospitalType?: 'all' | 'registered' | 'external';
  searchQuery?: string;
}

export interface SearchResultItem {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email?: string | null;
  description?: string | null;
  distanceKm: number;
  registered: boolean;
  bookingAvailable: boolean;
  specializations: string[];
  source?: string;
}

// Haversine formula for distance calculation in kilometers
function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export class SpatialSearchService {
  static async searchHospitals(params: LocationSearchParams): Promise<SearchResultItem[]> {
    const {
      latitude,
      longitude,
      radiusKm = 10,
      specialization,
      hospitalType = 'all',
      searchQuery,
    } = params;

    const results: SearchResultItem[] = [];

    // 1. Query Registered Hospitals if allowed
    if (hospitalType === 'all' || hospitalType === 'registered') {
      const registeredList = await prisma.hospital.findMany({
        include: {
          doctors: {
            select: { specialization: true },
          },
        },
      });

      for (const h of registeredList) {
        const dist = calculateHaversineDistance(latitude, longitude, h.latitude, h.longitude);
        if (dist <= radiusKm) {
          const specs = Array.from(
            new Set(h.doctors.map((d) => d.specialization).filter(Boolean))
          );
          if (specs.length === 0) specs.push('General Medicine', 'Multi-Specialty');

          if (specialization && !specs.some((s) => s.toLowerCase().includes(specialization.toLowerCase()))) {
            continue;
          }

          if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const matchName = h.name.toLowerCase().includes(q);
            const matchCity = h.city.toLowerCase().includes(q) || h.address.toLowerCase().includes(q);
            if (!matchName && !matchCity) continue;
          }

          results.push({
            id: h.id,
            name: h.name,
            address: h.address,
            city: h.city,
            state: h.state,
            pincode: h.pincode,
            phone: h.phone,
            email: h.email,
            description: h.description,
            distanceKm: dist,
            registered: true,
            bookingAvailable: true,
            specializations: specs,
          });
        }
      }
    }

    // 2. Query External Government Directory Hospitals if allowed
    if (hospitalType === 'all' || hospitalType === 'external') {
      const externalList = await prisma.externalHospital.findMany();

      for (const ext of externalList) {
        const dist = calculateHaversineDistance(latitude, longitude, ext.latitude, ext.longitude);
        if (dist <= radiusKm) {
          if (
            specialization &&
            !ext.specializations.some((s) => s.toLowerCase().includes(specialization.toLowerCase()))
          ) {
            continue;
          }

          if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const matchName = ext.name.toLowerCase().includes(q);
            const matchCity = ext.city.toLowerCase().includes(q) || ext.address.toLowerCase().includes(q);
            if (!matchName && !matchCity) continue;
          }

          results.push({
            id: ext.id,
            name: ext.name,
            address: ext.address,
            city: ext.city,
            state: ext.state,
            pincode: ext.pincode,
            phone: ext.phone,
            email: ext.email,
            distanceKm: dist,
            registered: false,
            bookingAvailable: false,
            specializations: ext.specializations.length > 0 ? ext.specializations : ['General Medicine'],
            source: ext.source,
          });
        }
      }
    }

    // Sort combined results by distance in ascending order
    return results.sort((a, b) => a.distanceKm - b.distanceKm);
  }
}
