import express from 'express';
import { 
  getParts,
  createPart,
  getPartById
} from '../controllers/partsController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getParts)
  .post(protect, admin, createPart);

router.route('/:id')
  .get(getPartById);

export default router;
