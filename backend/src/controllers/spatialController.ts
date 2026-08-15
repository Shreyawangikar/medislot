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
}
