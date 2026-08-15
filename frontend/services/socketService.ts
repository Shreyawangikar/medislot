import { io, Socket } from 'socket.io-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(API_BASE_URL, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
    });
  }
  return socket;
};

export const subscribeToDoctorSlots = (
  doctorId: string,
  onSlotUpdate: (update: { doctorId: string; appointmentDate: string; startTime: string; status: string }) => void
) => {
  const s = getSocket();
  s.emit('join_doctor_room', doctorId);
  s.on('slot_update', onSlotUpdate);

  return () => {
    s.emit('leave_doctor_room', doctorId);
    s.off('slot_update', onSlotUpdate);
  };
};
