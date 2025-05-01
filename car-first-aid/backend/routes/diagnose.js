import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  diagnoseIssue,
  saveDiagnosis,
  getDiagnosisHistory
} from '../controllers/diagnoseController.js';
import { validateRequest } from '../middleware/validation.js';
import { schemas } from '../middleware/validation.js';
import { createCircuitBreaker } from '../utils/circuitBreaker.js';
import Logger from '../utils/logger.js';
import { AppError } from '../middleware/errorMiddleware.js';

const router = express.Router();

// Create circuit breaker for AI diagnosis
const aiDiagnoseBreaker = createCircuitBreaker('ai-diagnose', {
  timeoutDuration: 5000,
  errorThreshold: 30
});

// Public routes
router.post('/', validateRequest(schemas.diagnose.create), async (req, res, next) => {
  try {
    const { symptoms, carModel, carYear, mileage } = req.body;

    // Log the diagnosis request
    Logger.info('Diagnosis request received', {
      carModel,
      carYear,
      mileage,
      symptomsCount: symptoms.length
    });

    // Process the diagnosis (example implementation)
    const diagnosis = await aiDiagnoseBreaker(async () => {
      // Add your AI diagnosis logic here
      return {
        possibleIssues: ['Engine misfire', 'Fuel system problem'],
        confidence: 0.85,
        recommendations: ['Check spark plugs', 'Inspect fuel injectors']
      };
    });

    res.status(200).json({
      status: 'success',
      data: diagnosis
    });
  } catch (error) {
    Logger.error('Diagnosis error:', error);
    next(new AppError('Failed to process diagnosis', 500));
  }
});

// Protected routes (require authentication)
router.post('/save', protect, saveDiagnosis);
router.get('/history', protect, getDiagnosisHistory);

export default router;
