import express from 'express';
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    await authUser(req, res);
  } catch (error) {
    next(error);
  }
});
router.post('/register', async (req, res, next) => {
  try {
    await registerUser(req, res);
  } catch (error) {
    next(error);
  }
});
router.post('/logout', logoutUser);
router.route('/profile')
  .get(protect, getUserProfile);

export default router;
