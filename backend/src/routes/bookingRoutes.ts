import { Router } from 'express';
import { BookingController } from '../controllers/bookingController';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';

const router = Router();

router.post('/', authenticate, authorize('PATIENT'), BookingController.createBooking);
router.get('/my', authenticate, authorize('PATIENT'), BookingController.getMyAppointments);
router.delete('/:id', authenticate, authorize('PATIENT'), BookingController.cancelBooking);
router.get('/doctor-slots/:doctorId', BookingController.getDoctorBookedSlots);

export default router;
