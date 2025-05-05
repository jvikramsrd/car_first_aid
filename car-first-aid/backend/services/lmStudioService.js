import axios from 'axios';
import { LM_STUDIO_URL, LM_STUDIO_MODEL } from '../config/lmStudioConfig.js';

export class LMStudioService {
  constructor() {
    this.baseUrl = LM_STUDIO_URL;
    this.model = LM_STUDIO_MODEL;
    console.log('LM Studio Service initialized with:', {
      baseUrl: this.baseUrl,
      model: this.model
    });
  }

  async generateDiagnosis(prompt) {
    try {
      console.log('Making request to LM Studio...');
      const response = await this.makeRequest(prompt);
      console.log('Raw response from LM Studio:', response);
      
      const parsedResponse = this.parseResponse(response);
      console.log('Parsed response:', parsedResponse);
      
      return parsedResponse;
    } catch (error) {
      console.error('LM Studio service error:', error);
      throw error;
    }
  }

  async makeRequest(prompt) {
    try {
      // First check if LM Studio is reachable
      try {
        await axios.get(this.baseUrl);
        console.log('LM Studio server is reachable');
      } catch (error) {
        console.error('LM Studio server is not reachable:', error.message);
        throw new Error('LM Studio server is not reachable. Please ensure it is running.');
      }

      const requestBody = {
        model: this.model,
        prompt: prompt,
        temperature: 0.7,
        max_tokens: 1000,
        stop: ["\n\n", "Human:", "Assistant:"],
        stream: false
      };

      console.log('Making request to LM Studio with body:', JSON.stringify(requestBody, null, 2));
      console.log('Request URL:', `${this.baseUrl}/v1/completions`);

      const response = await axios.post(`${this.baseUrl}/v1/completions`, requestBody, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      console.log('Response data:', JSON.stringify(response.data, null, 2));

      if (!response.data || !response.data.choices || !response.data.choices[0]) {
        console.error('Invalid response format:', response.data);
        throw new Error('Invalid response format from LM Studio');
      }

      const text = response.data.choices[0].text;
      console.log('Extracted text from response:', text);
      return text;
    } catch (error) {
      console.error('LM Studio request error:', error);
      
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Failed to connect to LM Studio. Please ensure LM Studio is running.');
      }
      
      if (error.response) {
        console.error('LM Studio error response:', error.response.data);
        throw new Error(`LM Studio API error: ${error.response.data.error || error.message}`);
      }
      
      throw error;
    }
  }

  parseResponse(response) {
    try {
      console.log('Parsing response:', response);
      
      // Extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('No JSON found in response:', response);
        throw new Error('No JSON found in response');
      }

      const jsonStr = jsonMatch[0];
      console.log('Extracted JSON string:', jsonStr);

      const parsed = JSON.parse(jsonStr);
      console.log('Parsed JSON:', parsed);

      // Validate required fields
      const requiredFields = ['causes', 'severity', 'solutions', 'estimatedCost', 'safetyImplications'];
      const missingFields = requiredFields.filter(field => !parsed[field]);

      if (missingFields.length > 0) {
        console.error('Missing required fields:', missingFields);
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Validate field types
      if (!Array.isArray(parsed.causes)) {
        parsed.causes = [parsed.causes];
      }
      if (!Array.isArray(parsed.solutions)) {
        parsed.solutions = [parsed.solutions];
      }

      // Validate severity
      const validSeverities = ['low', 'medium', 'high'];
      if (!validSeverities.includes(parsed.severity.toLowerCase())) {
        parsed.severity = 'medium';
      }

      return parsed;
    } catch (error) {
      console.error('Response parsing error:', error);
      throw new Error(`Failed to parse LM Studio response: ${error.message}`);
    }
  }
} 