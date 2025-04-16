import express from 'express';
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    await authUser(req, res);
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    await registerUser(req, res);
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/logout
router.post('/logout', logoutUser);

// @route   GET /api/auth/profile
router.route('/profile')
  .get(protect, getUserProfile);

export default router;
