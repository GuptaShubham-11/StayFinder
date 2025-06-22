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

  const { listingId, checkIn, checkOut } = validated.data;

  // Check: Check-in < Check-out
  if (checkIn >= checkOut) {
    throw new ApiError(400, 'Check-in must be before check-out');
  }

  // Check: Max stay limit (30 days)
  const diffDays =
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
    (1000 * 60 * 60 * 24);

  if (diffDays > 30) {
    throw new ApiError(400, 'Cannot book more than 30 days');
  }

  // Check: Listing exists
  const foundListing = await Listing.findById(listingId);
  if (!foundListing) {
    throw new ApiError(404, 'Listing not found');
  }

  // Check: Overlapping bookings
  const overlappingBooking = await Booking.findOne({
    listingId,
    $and: [{ checkIn: { $lt: checkOut } }, { checkOut: { $gt: checkIn } }],
  });

  if (overlappingBooking) {
    console.warn(
      `[Booking Conflict] User ${req.user?._id} tried booking ${listingId} from ${checkIn} to ${checkOut}`
    );
    throw new ApiError(400, 'Listing already booked for selected dates');
  }

  // Calculate total price
  const totalPrice = foundListing.price * Math.ceil(diffDays);

  // Save booking
  const booking = await Booking.create({
    user: req.user?._id,
    listingId,
    checkIn,
    checkOut,
    totalPrice,
  });

  res.status(201).json(new ApiResponse(201, 'Booking successful', booking));
});

const getUserBookings = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const bookings = await Booking.find({ user: req.user?._id })
    .populate('listingId')
    .lean();

  res.status(200).json(new ApiResponse(200, 'User bookings fetched', bookings));
});

const getHostBookings = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const listings = await Listing.find({ host: req.user?._id }, '_id');
  const listingIds = listings.map((l) => l._id);

  const bookings = await Booking.find({
    listingId: { $in: listingIds },
  })
    .populate('user')
    .populate('listingId')
    .lean();

  res.status(200).json(new ApiResponse(200, 'Host bookings fetched', bookings));
});

const getBookingsByListing = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const bookings = await Booking.find({ listingId: id });

  res
    .status(200)
    .json(new ApiResponse(200, 'Bookings for listing fetched', bookings));
});

export const bookingController = {
  createBooking,
  getUserBookings,
  getHostBookings,
  getBookingsByListing,
};
