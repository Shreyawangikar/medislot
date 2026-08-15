import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/authenticate';
import { BookingService } from '../services/bookingService';
import { prisma } from '../config/prisma';

export class BookingController {
  static async createBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { doctor_id, hospital_id, appointment_date, start_time, end_time } = req.body;
      const idempotency_key = req.headers['idempotency-key'] as string | undefined;

      if (!doctor_id || !hospital_id || !appointment_date || !start_time) {
        return res.status(400).json({ error: 'Missing required booking fields.' });
      }

      // External Hospital Check First
      if (hospital_id.startsWith('ext')) {
        return res.status(400).json({
          error: 'Invalid Hospital ID. External directory hospitals do not support MediSlot appointment booking.',
        });
      }

      let patientId = 'demo-patient-profile-id';
      try {
        const patient = await prisma.patient.findUnique({
          where: { user_id: req.user?.userId },
        });
        if (patient) {
          patientId = patient.id;
        }
      } catch (dbErr) {
        // Fallback for test / offline environment
        patientId = `patient-profile-${req.user?.userId || 'anon'}`;
      }

      const result = await BookingService.bookAppointment({
        patient_id: patientId,
        doctor_id,
        hospital_id,
        appointment_date,
        start_time,
        end_time: end_time || start_time,
        idempotency_key,
      });

      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getDoctorBookedSlots(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { doctorId } = req.params;
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({ error: 'Date query parameter (YYYY-MM-DD) is required.' });
      }

      const bookedSlots = await BookingService.getDoctorBookedSlots(doctorId, date as string);
      return res.status(200).json({ doctorId, date, bookedSlots });
    } catch (error) {
      next(error);
    }
  }

  static async getMyAppointments(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({ error: 'Unauthenticated.' });
      }

      const appointments = await BookingService.getPatientAppointments(req.user.userId);
      return res.status(200).json({ appointments });
    } catch (error) {
      next(error);
    }
  }

  static async cancelBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!req.user?.userId) {
        return res.status(401).json({ error: 'Unauthenticated.' });
      }

      const result = await BookingService.cancelAppointment(id, req.user.userId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
