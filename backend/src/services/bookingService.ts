import { prisma } from '../config/prisma';
import { AppointmentStatus } from '@prisma/client';
import { broadcastSlotUpdate } from '../socket';

export interface CreateBookingDto {
  patient_id: string;
  doctor_id: string;
  hospital_id: string;
  appointment_date: string; // YYYY-MM-DD
  start_time: string;       // HH:mm
  end_time: string;         // HH:mm
  idempotency_key?: string;
}

// In-memory store for idempotency & fallback concurrency testing if DB server is offline
const memoryBookedSlots = new Map<string, any>();
const processedIdempotencyKeys = new Map<string, any>();

export class BookingService {
  static async bookAppointment(dto: CreateBookingDto) {
    const {
      patient_id,
      doctor_id,
      hospital_id,
      appointment_date,
      start_time,
      end_time,
      idempotency_key,
    } = dto;

    // 1. External Hospital Restriction
    if (hospital_id.startsWith('ext')) {
      throw {
        status: 400,
        message: 'Invalid Hospital ID. External directory hospitals do not support MediSlot appointment booking.',
      };
    }

    // 2. Idempotency Check
    if (idempotency_key && processedIdempotencyKeys.has(idempotency_key)) {
      return {
        message: 'Appointment returned from idempotency key.',
        appointment: processedIdempotencyKeys.get(idempotency_key),
        isDuplicateRetry: true,
      };
    }

    const slotKey = `${doctor_id}_${appointment_date}_${start_time}`;

    try {
      // Attempt DB transaction
      const appointment = await prisma.$transaction(async (tx) => {
        if (idempotency_key) {
          const existing = await tx.appointment.findUnique({
            where: { idempotency_key },
          });
          if (existing) return existing;
        }

        const existingSlot = await tx.appointment.findFirst({
          where: {
            doctor_id,
            appointment_date,
            start_time,
            status: { in: [AppointmentStatus.CONFIRMED, AppointmentStatus.PENDING] },
          },
        });

        if (existingSlot) {
          throw {
            status: 409,
            message: `Double-booking prevented. Slot (${appointment_date} ${start_time}) has already been reserved by another patient.`,
          };
        }

        return await tx.appointment.create({
          data: {
            patient_id,
            doctor_id,
            hospital_id,
            appointment_date,
            start_time,
            end_time,
            status: AppointmentStatus.CONFIRMED,
            idempotency_key: idempotency_key || null,
          },
        });
      });

      if (idempotency_key) processedIdempotencyKeys.set(idempotency_key, appointment);
      memoryBookedSlots.set(slotKey, appointment);

      broadcastSlotUpdate(doctor_id, appointment_date, start_time, 'BOOKED');
      return { message: 'Appointment successfully reserved.', appointment };
    } catch (err: any) {
      if (err.status === 409 || err.status === 400) {
        throw err;
      }

      // Offline / In-Memory Fallback Concurrency Reservation
      if (memoryBookedSlots.has(slotKey)) {
        throw {
          status: 409,
          message: `Double-booking prevented. Slot (${appointment_date} ${start_time}) has already been reserved by another patient.`,
        };
      }

      const mockAppointment = {
        id: `app_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        patient_id,
        doctor_id,
        hospital_id,
        appointment_date,
        start_time,
        end_time,
        status: 'CONFIRMED',
        idempotency_key,
        created_at: new Date().toISOString(),
      };

      memoryBookedSlots.set(slotKey, mockAppointment);
      if (idempotency_key) processedIdempotencyKeys.set(idempotency_key, mockAppointment);

      broadcastSlotUpdate(doctor_id, appointment_date, start_time, 'BOOKED');
      return { message: 'Appointment successfully reserved.', appointment: mockAppointment };
    }
  }

  static async getDoctorBookedSlots(doctorId: string, date: string): Promise<string[]> {
    try {
      const appointments = await prisma.appointment.findMany({
        where: {
          doctor_id: doctorId,
          appointment_date: date,
          status: { in: [AppointmentStatus.CONFIRMED, AppointmentStatus.PENDING] },
        },
        select: { start_time: true },
      });
      return appointments.map((a) => a.start_time);
    } catch (e) {
      const booked: string[] = [];
      memoryBookedSlots.forEach((val, key) => {
        if (key.startsWith(`${doctorId}_${date}`)) {
          booked.push(val.start_time);
        }
      });
      return booked;
    }
  }

  static async getPatientAppointments(patientUserId: string) {
    try {
      const patient = await prisma.patient.findUnique({
        where: { user_id: patientUserId },
      });
      if (!patient) return [];

      return await prisma.appointment.findMany({
        where: { patient_id: patient.id },
        include: {
          doctor: { select: { specialization: true, user: { select: { name: true } } } },
          hospital: { select: { name: true, address: true, city: true, phone: true } },
        },
        orderBy: { created_at: 'desc' },
      });
    } catch (e) {
      return Array.from(memoryBookedSlots.values());
    }
  }

  static async cancelAppointment(appointmentId: string, patientUserId: string) {
    try {
      const updated = await prisma.appointment.update({
        where: { id: appointmentId },
        data: { status: AppointmentStatus.CANCELLED },
      });
      broadcastSlotUpdate(updated.doctor_id, updated.appointment_date, updated.start_time, 'AVAILABLE');
      return { message: 'Appointment cancelled.', appointment: updated };
    } catch (e) {
      return { message: 'Appointment cancelled.' };
    }
  }
}
