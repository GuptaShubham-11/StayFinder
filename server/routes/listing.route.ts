import { Router } from 'express';
import { listingController } from '../controllers/listing.controller';
import { verifyJWT } from '../middlewares/auth.middleware';

const router = Router();

router.use(verifyJWT);

// protected routes
router.post('/create-listing', listingController.createListing);
router.get('/all-listings', listingController.getAllListings);
router.delete('/delete-listing/:id', listingController.deleteListing);
router.get('/listing/:id', listingController.getListingById);
router.put('/update-listing/:id', listingController.updateListing);

export default router;