import z from 'zod';

export const addToWishlistSchema = z.object({
  listingId: z.string().min(1, 'Listing ID is required'),
});
