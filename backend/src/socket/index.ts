import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

let io: SocketIOServer | null = null;

export const initSocket = (httpServer: HTTPServer): SocketIOServer => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    socket.on('join_doctor_room', (doctorId: string) => {
      socket.join(`doctor_${doctorId}`);
      console.log(`[Socket.IO] Client ${socket.id} joined room doctor_${doctorId}`);
    });

    socket.on('leave_doctor_room', (doctorId: string) => {
      socket.leave(`doctor_${doctorId}`);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.IO is not initialized.');
  }
  return io;
};

export const broadcastSlotUpdate = (
  doctorId: string,
  appointmentDate: string,
  startTime: string,
  status: 'BOOKED' | 'AVAILABLE' | 'CANCELLED'
) => {
  if (io) {
    io.to(`doctor_${doctorId}`).emit('slot_update', {
      doctorId,
      appointmentDate,
      startTime,
      status,
      timestamp: new Date().toISOString(),
    });
    console.log(`[Socket.IO Broadcast] Doctor ${doctorId} slot ${appointmentDate} ${startTime} -> ${status}`);
  }
};
