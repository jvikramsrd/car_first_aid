import express from 'express';
import { getTowingServices, createTowingService } from '../controllers/towingControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getTowingServices)
  .post(protect, createTowingService);

export default router;
