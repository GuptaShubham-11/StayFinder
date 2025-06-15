import { Router } from 'express';
import { bookingController } from '../controllers/booking.controller';
import { verifyJWT } from '../middlewares/auth.middleware';

const router = Router();

router.use(verifyJWT);

// protected routes
router.post('/create-booking', bookingController.createBooking);
router.get('/user-bookings', bookingController.getUserBookings);
router.get('/host-bookings', bookingController.getHostBookings);

export default router;