import Wishlist from '../models/wishlists.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

// ➕ Add a listing to wishlist (creates wishlist if not exists)
const addToWishlist = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { listingId } = req.params;

  if (!listingId) {
    throw new ApiError(400, 'Listing ID is required');
  }

  const wishlist = await Wishlist.findOneAndUpdate(
    { user: req.user!._id },
    { $addToSet: { listings: listingId } },
    { new: true, upsert: true }
  );

  res
    .status(200)
    .json(new ApiResponse(200, 'Listing added to wishlist', wishlist));
});

// 🧾 Get all wishlisted listings for the user
const getUserWishlist = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user!._id })
    .populate('listings')
    .exec();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        'Wishlist fetched successfully',
        wishlist?.listings ?? []
      )
    );
});

// ❌ Remove a listing from wishlist
const removeFromWishlist = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    const { listingId } = req.params;

    console.log(listingId);

    const wishlist = await Wishlist.findOneAndUpdate(
      { user: req.user!._id },
      { $pull: { listings: listingId } },
      { new: true }
    );

    res
      .status(200)
      .json(new ApiResponse(200, 'Listing removed from wishlist', wishlist));
  }
);

export const wishlistController = {
  addToWishlist,
  getUserWishlist,
  removeFromWishlist,
};
