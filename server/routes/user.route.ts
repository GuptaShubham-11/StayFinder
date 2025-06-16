import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { verifyJWT } from '../middlewares/auth.middleware';

const router = Router();

// public routes
router.post('/signup', userController.signUp);
router.post('/signin', userController.signIn);
router.post('/refresh-access-token', userController.refreshAccessToken);

router.use(verifyJWT);

// protected routes
router.post('/signout', userController.signOut);
router.get('/current-user', userController.currentUser);

export default router;
