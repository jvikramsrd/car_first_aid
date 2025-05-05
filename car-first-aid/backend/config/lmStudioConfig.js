// LM Studio configuration
export const LM_STUDIO_URL = process.env.LM_STUDIO_URL || 'http://localhost:1234';
export const LM_STUDIO_MODEL = process.env.LM_STUDIO_MODEL || 'gemma-3-4b-it';

// Default configuration
export const lmStudioConfig = {
  url: LM_STUDIO_URL,
  model: LM_STUDIO_MODEL,
  temperature: 0.7,
  maxTokens: 1000,
  systemPrompt: "You are an expert automotive technician. Analyze the car problem and provide a diagnosis in JSON format with the following fields: causes (array), severity (low/medium/high), solutions (array), estimatedCost (string), safetyImplications (string).",
  retryAttempts: 3,
  retryDelay: 1000 // 1 second
}; 