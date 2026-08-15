import { Router } from 'express';
import { ProtectedController } from '../controllers/protectedController';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';

const router = Router();

// General authenticated user profile test endpoint
router.get('/profile', authenticate, ProtectedController.getProfile);

// Role-specific protected test endpoints
router.get('/patient', authenticate, authorize('PATIENT'), ProtectedController.getPatientData);
router.get('/doctor', authenticate, authorize('DOCTOR'), ProtectedController.getDoctorData);
router.get('/hospital-admin', authenticate, authorize('HOSPITAL_ADMIN'), ProtectedController.getHospitalAdminData);
router.get('/platform-admin', authenticate, authorize('PLATFORM_ADMIN'), ProtectedController.getPlatformAdminData);

export default router;
