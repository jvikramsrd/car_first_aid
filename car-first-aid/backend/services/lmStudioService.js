import fetch from 'node-fetch';
import { lmStudioConfig } from '../config/lmStudioConfig.js';

export class LMStudioService {
  constructor() {
    this.config = lmStudioConfig;
    this.retryCount = 0;
  }

  async generateDiagnosis(prompt) {
    try {
      const response = await this.makeRequest(prompt);
      return this.parseResponse(response);
    } catch (error) {
      console.error('LM Studio service error:', error);
      throw error;
    }
  }

  async makeRequest(prompt) {
    try {
      // Prepare the request body
      const requestBody = {
        model: this.config.model,
        messages: [
          {
            role: "system",
            content: this.config.systemPrompt
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens,
        stream: false
      };

      console.log('Sending request to LM Studio:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(this.config.url + '/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('LM Studio API error details:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`LM Studio API error: ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      
      if (!result.choices || !result.choices[0] || !result.choices[0].message) {
        console.error('Invalid LM Studio response:', JSON.stringify(result, null, 2));
        throw new Error('Invalid response structure from LM Studio');
      }

      return result;
    } catch (error) {
      console.error('LM Studio request error:', error);
      if (this.retryCount < this.config.retryAttempts) {
        this.retryCount++;
        console.log(`Retrying LM Studio request (attempt ${this.retryCount}/${this.config.retryAttempts})...`);
        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay * this.retryCount));
        return this.makeRequest(prompt);
      }
      throw error;
    }
  }

  parseResponse(response) {
    try {
      console.log('Raw response from LM Studio:', JSON.stringify(response, null, 2));
      const content = response.choices[0].message.content;
      let jsonContent = content;
      // Try to extract JSON from code block
      if (content.includes('```')) {
        const matches = content.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
        if (matches && matches[1]) {
          jsonContent = matches[1].trim();
        }
      } else {
        // Try to extract the first {...} block
        const curlyMatch = content.match(/\{[\s\S]*\}/);
        if (curlyMatch) {
          jsonContent = curlyMatch[0];
        }
      }
      // Clean up control characters
      jsonContent = jsonContent.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
      // Attempt to repair common JSON issues (trailing commas)
      jsonContent = jsonContent.replace(/,\s*([}\]])/g, '$1');
      try {
        const parsedContent = JSON.parse(jsonContent);
        const formattedResponse = {
          causes: Array.isArray(parsedContent.causes) ? parsedContent.causes : [String(parsedContent.causes || 'Unknown cause')],
          severity: String(parsedContent.severity || 'medium').toLowerCase(),
          solutions: Array.isArray(parsedContent.solutions) ? parsedContent.solutions : [String(parsedContent.solutions || 'Consult a professional mechanic')],
          estimatedCost: String(parsedContent.estimatedCost || 'Unknown'),
          safetyImplications: String(parsedContent.safetyImplications || 'Unknown - professional inspection recommended'),
          urgencyLevel: parseInt(parsedContent.urgencyLevel) || 3,
          additionalNotes: String(parsedContent.additionalNotes || '')
        };
        this.validateResponse(formattedResponse);
        return formattedResponse;
      } catch (parseError) {
        console.error('Failed to parse JSON content:', parseError);
        console.error('Raw content:', jsonContent);
        throw new Error('Invalid JSON format in LM Studio response');
      }
    } catch (error) {
      console.error('Failed to parse LM Studio response:', error);
      throw new Error('Invalid response format from LM Studio');
    }
  }

  validateResponse(response) {
    const requiredFields = [
      'causes',
      'severity',
      'solutions',
      'estimatedCost',
      'safetyImplications',
      'urgencyLevel'
    ];

    const defaultValues = {
      causes: ['Unknown cause'],
      severity: 'medium',
      solutions: ['Consult a professional mechanic'],
      estimatedCost: 'Varies - professional diagnosis needed',
      safetyImplications: 'Unknown - professional inspection recommended',
      urgencyLevel: 3
    };

    // Ensure all required fields exist with valid values
    for (const field of requiredFields) {
      if (!response[field]) {
        console.warn(`Missing field in response: ${field}, using default value`);
        response[field] = defaultValues[field];
      }
    }

    return true;
  }
} 