import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import protectedRoutes from './routes/protectedRoutes';
import bookingRoutes from './routes/bookingRoutes';
import spatialRoutes from './routes/spatialRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'MediSlot Backend API' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/hospitals', spatialRoutes);

// Global Error Handler Middleware
app.use(errorHandler);

export default app;
