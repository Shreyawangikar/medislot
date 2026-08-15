const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface BookingPayload {
  doctor_id: string;
  hospital_id: string;
  appointment_date: string;
  start_time: string;
  end_time?: string;
}

export class ClientBookingService {
  static async bookAppointment(payload: BookingPayload, token: string, idempotencyKey?: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    if (idempotencyKey) {
      headers['Idempotency-Key'] = idempotencyKey;
    }

    const res = await fetch(`${API_BASE_URL}/api/booking`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to complete appointment booking.');
    }
    return data;
  }

  static async getBookedSlots(doctorId: string, date: string): Promise<string[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/booking/doctor-slots/${doctorId}?date=${date}`);
      const data = await res.json();
      return data.bookedSlots || [];
    } catch (e) {
      return [];
    }
  }

  static async getMyAppointments(token: string) {
    const res = await fetch(`${API_BASE_URL}/api/booking/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch appointments.');
    return data.appointments || [];
  }

  static async cancelAppointment(appointmentId: string, token: string) {
    const res = await fetch(`${API_BASE_URL}/api/booking/${appointmentId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to cancel appointment.');
    return data;
  }
}
