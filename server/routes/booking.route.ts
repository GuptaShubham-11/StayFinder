import { Router } from 'express';
import { bookingController } from '../controllers/booking.controller';
import { verifyJWT } from '../middlewares/auth.middleware';

const router = Router();

router.use(verifyJWT);

// protected routes
router.post('/create-booking', bookingController.createBooking);
router.get('/user-bookings', bookingController.getUserBookings);
router.get('/host-bookings', bookingController.getHostBookings);
router.get('/get-bookings/:id', bookingController.getBookingsByListing);

export default router;
