import express from 'express';
import os from 'os';
import Logger from '../utils/logger.js';
import { createCircuitBreaker } from '../utils/circuitBreaker.js';

const router = express.Router();

// Create circuit breaker for external service checks
const externalServiceBreaker = createCircuitBreaker('external-services', {
  timeoutDuration: 5000,
  errorThreshold: 30
});

const checkExternalServices = async () => {
  // Add your external service checks here
  return {
    database: 'connected',
    aiService: 'operational',
    // Add more services as needed
  };
};

router.get('/', async (req, res) => {
  try {
    const externalServices = await externalServiceBreaker(checkExternalServices);
    
    const healthcheck = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      system: {
        memory: {
          total: os.totalmem(),
          free: os.freemem(),
          used: os.totalmem() - os.freemem(),
          usage: ((os.totalmem() - os.freemem()) / os.totalmem() * 100).toFixed(2) + '%'
        },
        cpu: {
          load: os.loadavg(),
          cores: os.cpus().length
        },
        platform: process.platform,
        nodeVersion: process.version
      },
      services: externalServices,
      environment: process.env.NODE_ENV || 'development'
    };

    Logger.info('Health check performed', healthcheck);
    res.status(200).json(healthcheck);
  } catch (error) {
    Logger.error('Health check failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: error.message
    });
  }
});

export default router; 