import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware';
import { wishlistController } from '../controllers/wishlists.controller';

const router = Router();

router.use(verifyJWT);

// protected routes
router.post('/add-wishlist/:listingId', wishlistController.addToWishlist);
router.get('/get-wishlist', wishlistController.getUserWishlist);
router.delete(
  '/remove-wishlist/:listingId',
  wishlistController.removeFromWishlist
);

export default router;
