import { z } from 'zod';
import Logger from '../utils/logger.js';

export const validateRequest = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      Logger.error('Validation error:', error.errors);
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      });
    }
    Logger.error('Unexpected validation error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Example schemas
export const schemas = {
  auth: {
    login: z.object({
      body: z.object({
        email: z.string().email(),
        password: z.string().min(6)
      })
    }),
    register: z.object({
      body: z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(6)
      })
    })
  },
  diagnose: {
    create: z.object({
      body: z.object({
        symptoms: z.array(z.string()),
        carModel: z.string(),
        carYear: z.number().int().min(1900).max(new Date().getFullYear()),
        mileage: z.number().int().min(0)
      })
    })
  }
}; 