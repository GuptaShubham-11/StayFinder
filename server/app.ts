import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Initialize express app
const app: Application = express();

if (!process.env.CLIENT_URL) {
  throw new Error('CLIENT_URL environment variable is not set');
}

// Middleware setup
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());

// Routes
import userRoutes from './routes/user.route';
import listingRoutes from './routes/listing.route';
import bookingRoutes from './routes/booking.route';
import wishlistRoutes from './routes/wishlists.route';

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/listings', listingRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/wishlists', wishlistRoutes);

// Global error handler
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error('❌ Error:', err.message);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
);

export { app };
