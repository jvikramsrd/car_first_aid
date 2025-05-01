import CircuitBreaker from 'opossum';
import Logger from './logger.js';

export const createCircuitBreaker = (name, options = {}) => {
  const defaultOptions = {
    timeout: 3000, // Time in milliseconds to wait for a function to complete
    errorThresholdPercentage: 50, // Error percentage at which to open the circuit
    resetTimeout: 10000, // Time in milliseconds to wait before attempting to close the circuit
    volumeThreshold: 5, // Minimum number of requests needed before tripping the circuit
  };

  const breaker = new CircuitBreaker(async (fn) => await fn(), {
    ...defaultOptions,
    ...options,
    name,
  });

  breaker.on('open', () => {
    Logger.warn(`Circuit breaker "${name}" opened`);
  });

  breaker.on('halfOpen', () => {
    Logger.info(`Circuit breaker "${name}" half-opened`);
  });

  breaker.on('close', () => {
    Logger.info(`Circuit breaker "${name}" closed`);
  });

  breaker.fallback(() => {
    Logger.warn(`Circuit breaker "${name}" fallback triggered`);
    throw new Error(`Service "${name}" is temporarily unavailable`);
  });

  return async (fn) => {
    try {
      return await breaker.fire(fn);
    } catch (error) {
      Logger.error(`Circuit breaker "${name}" error:`, error);
      throw error;
    }
  };
};

// Example usage:
// const aiDiagnoseBreaker = createCircuitBreaker('ai-diagnose', {
//   timeout: 5000,
//   errorThresholdPercentage: 30
// });
// 
// const result = await aiDiagnoseBreaker(async () => {
//   return await makeAIDiagnoseCall(data);
// }); 