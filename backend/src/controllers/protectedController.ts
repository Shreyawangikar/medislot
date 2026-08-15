import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authenticate';

export class ProtectedController {
  static getProfile(req: AuthenticatedRequest, res: Response) {
    return res.status(200).json({
      message: 'Access granted to general protected profile.',
      userId: req.user?.userId,
      role: req.user?.role,
    });
  }

  static getPatientData(req: AuthenticatedRequest, res: Response) {
    return res.status(200).json({
      message: 'Access granted to Patient Protected Resource.',
      userId: req.user?.userId,
      role: req.user?.role,
      data: 'Patient appointment history and personal records placeholder.',
    });
  }

  static getDoctorData(req: AuthenticatedRequest, res: Response) {
    return res.status(200).json({
      message: 'Access granted to Doctor Protected Resource.',
      userId: req.user?.userId,
      role: req.user?.role,
      data: 'Doctor schedule and consultation roster placeholder.',
    });
  }

  static getHospitalAdminData(req: AuthenticatedRequest, res: Response) {
    return res.status(200).json({
      message: 'Access granted to Hospital Admin Protected Resource.',
      userId: req.user?.userId,
      role: req.user?.role,
      data: 'Hospital tenant settings and department management placeholder.',
    });
  }

  static getPlatformAdminData(req: AuthenticatedRequest, res: Response) {
    return res.status(200).json({
      message: 'Access granted to Platform Admin Protected Resource.',
      userId: req.user?.userId,
      role: req.user?.role,
      data: 'Global platform analytics and tenant provisioning placeholder.',
    });
  }
}
