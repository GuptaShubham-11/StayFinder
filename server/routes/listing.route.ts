import { Router } from 'express';
import { listingController } from '../controllers/listing.controller';
import { verifyJWT } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/multer.middleware';

const router = Router();

router.use(verifyJWT);

// protected routes
router.post(
  '/create-listing',
  upload.array('images', 6),
  listingController.createListing
);
router.delete('/delete-listing/:id', listingController.deleteListing);
router.put(
  '/update-listing/:id',
  upload.array('images', 6),
  listingController.updateListing
);
router.get('/all-listings', listingController.getAllListings);
router.get('/listing/:id', listingController.getListingById);
router.get('/user-listings', listingController.getHostListings);
router.get('/host-listings', listingController.getHostListings);

export default router;
