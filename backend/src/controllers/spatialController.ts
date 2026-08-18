import { Request, Response, NextFunction } from 'express';
import { SpatialSearchService } from '../services/spatialSearchService';

export class SpatialController {
  static async searchNearby(req: Request, res: Response, next: NextFunction) {
    try {
      const lat = parseFloat((req.query.lat as string) || '18.5074');
      const lng = parseFloat((req.query.lng as string) || '73.8077');
      const radiusKm = parseFloat((req.query.radius as string) || '10');
      const specialization = req.query.specialization as string | undefined;
      const hospitalType = (req.query.hospitalType as any) || 'all';
      const q = req.query.q as string | undefined;

      const hospitals = await SpatialSearchService.searchHospitals({
        latitude: lat,
        longitude: lng,
        radiusKm,
        specialization,
        hospitalType,
        searchQuery: q,
      });

      return res.status(200).json({
        queryLocation: { lat, lng, radiusKm },
        count: hospitals.length,
        hospitals,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getHospitalById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = typeof req.params.id === 'string'
        ? req.params.id
        : Array.isArray(req.params.id) && typeof req.params.id[0] === 'string'
          ? req.params.id[0]
          : undefined;

      if (!id) {
        return res.status(400).json({ error: 'Hospital id is required.' });
      }

      const hospital = await SpatialSearchService.findHospitalById(id as string);

      if (!hospital) {
        return res.status(404).json({ error: 'Hospital not found' });
      }

      return res.status(200).json(hospital);
    } catch (error) {
      next(error);
    }
  }
}
