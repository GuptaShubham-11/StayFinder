import Listing from '../models/listing.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { zodErrorFormater } from '../utils/zodErrorFormater';
import { listingValidation } from '../schemas/listing.schema';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import mongoose from 'mongoose';

// Create a Listing
const createListing = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const validationResult = listingValidation.safeParse(req.body);

  if (!validationResult.success) {
    const errorMessages = zodErrorFormater(validationResult);
    throw new ApiError(400, errorMessages || 'Invalid listing data!');
  }

  const listingData = validationResult.data;

  const listing = await Listing.create({
    ...listingData,
    host: req.user?._id,
  });

  res
    .status(201)
    .json(new ApiResponse(201, 'Listing created successfully.', listing));
});

const getAllListings = asyncHandler(async (req, res) => {
  const {
    location,
    minPrice,
    maxPrice,
    search,
    startDate,
    endDate,
    page = '1',
    limit = '10',
  } = req.query;

  const filters: any = {};

  // Optional Location
  if (location) {
    filters.location = { $regex: new RegExp(location as string, 'i') };
  }

  // Optional Price Filters
  if (minPrice || maxPrice) {
    filters.price = {};
    if (minPrice) filters.price.$gte = Number(minPrice);
    if (maxPrice) filters.price.$lte = Number(maxPrice);
  }

  // Optional Search in title or description
  if (search) {
    filters.$or = [
      { title: { $regex: new RegExp(search as string, 'i') } },
      { description: { $regex: new RegExp(search as string, 'i') } },
    ];
  }

  // Optional Availability Date Range Filter
  if (startDate && endDate) {
    filters.availability = {
      $elemMatch: {
        start: { $lte: new Date(startDate as string) },
        end: { $gte: new Date(endDate as string) },
      },
    };
  }

  const currentPage = parseInt(page as string, 10);
  const itemsPerPage = parseInt(limit as string, 10);
  const skip = (currentPage - 1) * itemsPerPage;

  const [listings, totalCount] = await Promise.all([
    Listing.find(filters)
      .populate('host', 'email')
      .skip(skip)
      .limit(itemsPerPage)
      .sort({ createdAt: -1 }), // Optional: newest first

    Listing.countDocuments(filters),
  ]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  res.status(200).json(
    new ApiResponse(200, 'Listings fetched successfully.', {
      listings,
      pagination: {
        totalCount,
        totalPages,
        currentPage,
        hasMore: currentPage < totalPages,
      },
    })
  );
});

// Get Listing by ID
const getListingById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid listing ID!');
  }

  const listing = await Listing.findById(id).populate('host', 'email');

  if (!listing) {
    throw new ApiError(404, 'Listing not found!');
  }

  res
    .status(200)
    .json(new ApiResponse(200, 'Listing fetched successfully.', listing));
});

// Delete a Listing (host only)
const deleteListing = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid listing ID!');
  }

  const listing = await Listing.findById(id);

  if (!listing) {
    throw new ApiError(404, 'Listing not found!');
  }

  if (listing.host.toString() !== (req.user?._id as string).toString()) {
    throw new ApiError(403, 'You are not authorized to delete this listing.');
  }

  await listing.deleteOne();

  res.status(200).json(new ApiResponse(200, 'Listing deleted successfully.'));
});

// Update Listing (host only)
const updateListing = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid listing ID!');
  }

  const listing = await Listing.findById(id);

  if (!listing) {
    throw new ApiError(404, 'Listing not found!');
  }

  if (listing.host.toString() !== (req.user?._id as string).toString()) {
    throw new ApiError(403, 'You are not authorized to update this listing.');
  }

  Object.assign(listing, updates);
  await listing.save();

  res
    .status(200)
    .json(new ApiResponse(200, 'Listing updated successfully.', listing));
});

export const listingController = {
  createListing,
  getAllListings,
  getListingById,
  deleteListing,
  updateListing,
};
