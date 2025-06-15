import Booking from '../models/booking.model';
import Listing from '../models/listing.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { bookingValidation } from '../schemas/booking.schema';
import { zodErrorFormater } from '../utils/zodErrorFormater';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

const createBooking = asyncHandler(async (req: AuthenticatedRequest, res) => {
    const validated = bookingValidation.safeParse(req.body);

    if (!validated.success) {
        throw new ApiError(400, zodErrorFormater(validated));
    }

    const { listing, checkIn, checkOut, totalPrice } = validated.data;

    // Validate dates
    if (checkIn >= checkOut) {
        throw new ApiError(400, 'Check-in must be before check-out');
    }

    // Check for overlapping bookings
    const overlappingBooking = await Booking.findOne({
        listing,
        $or: [
            { checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn } }
        ],
    });

    if (overlappingBooking) {
        throw new ApiError(400, 'Listing already booked for selected dates');
    }

    const booking = await Booking.create({
        user: req.user?._id,
        listing,
        checkIn,
        checkOut,
        totalPrice,
    });

    res.status(201).json(new ApiResponse(201, 'Booking successful', booking));
});

const getUserBookings = asyncHandler(async (req: AuthenticatedRequest, res) => {
    const bookings = await Booking.find({ user: req.user?._id }).populate('listing');
    res.status(200).json(new ApiResponse(200, 'User bookings fetched', bookings));
});

const getHostBookings = asyncHandler(async (req: AuthenticatedRequest, res) => {
    const listings = await Listing.find({ host: req.user?._id }, '_id');
    const listingIds = listings.map(l => l._id);

    const bookings = await Booking.find({ listing: { $in: listingIds } }).populate('user listing');

    res.status(200).json(new ApiResponse(200, 'Host bookings fetched', bookings));
});

export const bookingController = {
    createBooking,
    getUserBookings,
    getHostBookings,
};
