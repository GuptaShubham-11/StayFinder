import Listing from '../models/listing.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { zodErrorFormater } from '../utils/zodErrorFormater';
import { listingValidation } from '../schemas/listing.schema';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import mongoose from 'mongoose';
import { uploadOnCloudinary, deleteOnCloudinary } from '../utils/Cloudinary';

// ✅ Create a Listing
const createListing = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const body = {
    ...req.body,
    availability: JSON.parse(req.body.availability),
  };

  const validationResult = listingValidation.safeParse(body);
  if (!validationResult.success) {
    const errorMessages = zodErrorFormater(validationResult);
    console.log(errorMessages);

    throw new ApiError(400, errorMessages || 'Invalid listing data!');
  }

  const { title, description, location, price, availability } =
    validationResult.data;

  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    throw new ApiError(400, 'At least one image file is required.');
  }

  const imageUploads = await Promise.all(
    files.map((file) => uploadOnCloudinary(file.path, 'image'))
  );

  const imageUrls = imageUploads
    .filter((file) => file !== null)
    .map((file) => file.secure_url);

  console.log(req.user?._id);

  const listing = await Listing.create({
    title,
    description,
    location,
    price: Number(price),
    availability,
    images: imageUrls,
    host: req.user?._id as string,
  });

  res
    .status(201)
    .json(new ApiResponse(201, 'Listing created successfully.', listing));
});

// ✅ Get All Listings with Filters + Pagination
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

  if (location) {
    filters.location = { $regex: new RegExp(location as string, 'i') };
  }

  if (minPrice || maxPrice) {
    filters.price = {};
    if (minPrice) filters.price.$gte = Number(minPrice);
    if (maxPrice) filters.price.$lte = Number(maxPrice);
  }

  if (search) {
    filters.$or = [
      { title: { $regex: new RegExp(search as string, 'i') } },
      { description: { $regex: new RegExp(search as string, 'i') } },
    ];
  }

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
      .sort({ createdAt: -1 }),

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

// ✅ Get Listing by ID
const getListingById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
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

// ✅ Get Listings by Host
const getHostListings = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const listings = await Listing.find({ host: req.user?._id });
  res
    .status(200)
    .json(
      new ApiResponse(200, 'Host listings fetched successfully.', listings)
    );
});

// ✅ Delete Listing
const deleteListing = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, 'Invalid listing ID!');
  }

  const listing = await Listing.findById(id);
  if (!listing) {
    throw new ApiError(404, 'Listing not found!');
  }

  if (listing.host.toString() !== String(req.user?._id)) {
    throw new ApiError(403, 'You are not authorized to delete this listing.');
  }

  // Delete associated images from Cloudinary
  for (const url of listing.images) {
    await deleteOnCloudinary(url); // Assuming it extracts public_id internally
  }

  await listing.deleteOne();
  res.status(200).json(new ApiResponse(200, 'Listing deleted successfully.'));
});

// ✅ Update Listing (with image replacement and old image deletion)
const updateListing = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const updates = {
    ...req.body,
    availability: req.body.availability
      ? JSON.parse(req.body.availability)
      : undefined,
  };

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, 'Invalid listing ID!');
  }

  const listing = await Listing.findById(id);
  if (!listing) {
    throw new ApiError(404, 'Listing not found!');
  }

  if (listing.host.toString() !== req.user?._id?.toString()) {
    throw new ApiError(403, 'You are not authorized to update this listing.');
  }

  // Validate partial update
  const partialValidation = listingValidation.partial();
  const parsed = partialValidation.safeParse(updates);
  if (!parsed.success) {
    const errorMessages = zodErrorFormater(parsed);
    throw new ApiError(400, errorMessages || 'Invalid update data!');
  }

  const files = req.files as Express.Multer.File[];
  let newImageUrls: string[] = [];
  const oldImageUrls = listing.images;

  // If new images provided, upload and set them
  if (files && files.length > 0) {
    const uploads = await Promise.all(
      files.map((file) => uploadOnCloudinary(file.path, 'image'))
    );

    newImageUrls = uploads.filter(Boolean).map((f: any) => f.secure_url);
    listing.images = newImageUrls;
  }

  // Apply remaining validated updates
  Object.assign(listing, parsed.data);

  await listing.save();

  // Delete old images *after* successful save
  if (newImageUrls.length > 0) {
    await Promise.all(
      oldImageUrls.map((url) => deleteOnCloudinary(url, 'image'))
    );
  }

  res
    .status(200)
    .json(new ApiResponse(200, 'Listing updated successfully.', listing));
});

export const listingController = {
  createListing,
  getAllListings,
  getListingById,
  getHostListings,
  deleteListing,
  updateListing,
};
