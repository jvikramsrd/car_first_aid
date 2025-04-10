import express from 'express';
import { getMechanics, createMechanic, getNearbyMechanics } from '../controllers/mechanicsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getMechanics)
  .post(protect, createMechanic);

router.route('/nearby')
  .get(getNearbyMechanics);

export default router;
