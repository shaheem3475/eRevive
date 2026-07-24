const { GoogleGenerativeAI } = require('@google/generative-ai');
const { calculateAIDecisionDefaults } = require('./businessRules');

/**
 * Service layer for Google Gemini Vision AI analysis & AI Decision Engine.
 * Keeps Gemini SDK logic decoupled from controllers.
 */
class GeminiVisionService {
    /**
     * Analyzes an uploaded image using Google Gemini Multimodal Vision API.
     * Generates device identification, market valuation, intelligent recommendation, and eco-impact.
     * 
     * @param {string} imageBase64 - Base64 encoded image string (with or without data URI header)
     * @param {string} mimeType - Image mime type (e.g., 'image/jpeg', 'image/png')
     * @returns {Promise<Object>} Extended AI Decision Engine analysis JSON object
     */
    static async analyzeDeviceImage(imageBase64, mimeType = 'image/jpeg') {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not configured on the backend server');
        }

        if (!imageBase64) {
            throw new Error('No image data provided for AI vision analysis');
        }

        // Clean base64 data header if present (e.g. data:image/jpeg;base64,...)
        let rawBase64 = imageBase64;
        let detectedMime = mimeType;

        if (imageBase64.includes(';base64,')) {
            const parts = imageBase64.split(';base64,');
            const mimeMatch = parts[0].match(/data:(image\/[a-zA-Z0-9.+-]+)/);
            if (mimeMatch) {
                detectedMime = mimeMatch[1];
            }
            rawBase64 = parts[1];
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        
        const candidateModels = ['gemini-2.0-flash', 'gemini-flash-latest', 'gemini-2.5-flash'];

        const imagePart = {
            inlineData: {
                data: rawBase64,
                mimeType: detectedMime
            }
        };

        const prompt = `You are an expert AI Decision Engine for eRevive, an AI-powered E-Waste Management Platform.
Analyze the provided image of an electronic device or e-waste item and return ONLY a valid JSON object matching this structure:

{
  "deviceName": "Specific product model or descriptive name (e.g., Apple iPhone 11 Pro, Dell XPS 13, Logitech MX Master 3)",
  "brand": "Manufacturer or brand name (e.g., Apple, Samsung, Dell, Sony, Unknown)",
  "category": "Broad e-waste category (e.g., Smartphone, Laptop, Tablet, Audio, Smartwatch, Monitor, Gaming Console, Accessory, Component, Other)",
  "condition": "Estimated physical condition from visible appearance (Like New | Good | Fair | Poor | Broken)",
  "confidence": Integer percentage between 0 and 100 representing certainty of identification,
  "estimatedValue": {
      "min": Estimated minimum resale/reuse value in INR (Integer, e.g. 65000),
      "max": Estimated maximum resale/reuse value in INR (Integer, e.g. 72000),
      "currency": "INR"
  },
  "recommendation": "Intelligent action recommendation (SELL | DONATE | RECYCLE | STORE)",
  "reason": "Detailed 1-2 sentence explanation considering device category, visible physical condition, estimated market value, potential reuse, and environmental benefit.",
  "ecoImpact": {
      "carbonSavedKg": Estimated CO2 saved in Kg if reused or recycled (Number/Integer),
      "ewastePreventedKg": Estimated e-waste diverted from landfill in Kg (Number),
      "treesEquivalent": Equivalent trees saved (Integer)
  }
}

Decision Logic Guidance for recommendation:
- SELL: High commercial resale value, functional condition (Like New / Good / Excellent).
- DONATE: Functional condition (Good / Fair) suitable for community reuse, digital inclusion.
- RECYCLE: Non-functional / obsolete / broken state (Poor / Broken) best for raw material recovery.
- STORE: Low current market demand or personal backup utility.

Special Instructions:
1. If the image is not an electronic device, gadget, or e-waste item, return:
{
  "deviceName": "Unknown Device",
  "brand": "Unknown",
  "category": "Unknown",
  "condition": "Unknown",
  "confidence": 0,
  "estimatedValue": { "min": 0, "max": 0, "currency": "INR" },
  "recommendation": "STORE",
  "reason": "No electronic device or e-waste item was detected in the provided image.",
  "ecoImpact": { "carbonSavedKg": 0, "ewastePreventedKg": 0, "treesEquivalent": 0 }
}
2. Ensure strict JSON format without any markdown formatting or surrounding backticks.`;

        let lastError = null;
        let responseText = null;

        for (const modelName of candidateModels) {
            try {
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    generationConfig: {
                        temperature: 0.2,
                        topP: 0.8,
                        topK: 40,
                        maxOutputTokens: 1024,
                        responseMimeType: 'application/json'
                    }
                });

                const result = await model.generateContent([prompt, imagePart]);
                const response = await result.response;
                responseText = response.text();
                if (responseText) break;
            } catch (err) {
                lastError = err;
                console.warn(`Gemini Vision model '${modelName}' attempt failed: ${err.message.split('\n')[0]}`);
            }
        }

        if (!responseText) {
            throw lastError || new Error('All candidate Gemini Vision models failed');
        }

        try {
            // Sanitize potential markdown block syntax if present
            const cleanJsonText = responseText
                .replace(/^```json\s*/i, '')
                .replace(/^```\s*/i, '')
                .replace(/\s*```$/i, '')
                .trim();

            const parsedResult = JSON.parse(cleanJsonText);

            const deviceName = String(parsedResult.deviceName || 'Unknown Device').trim();
            const brand = String(parsedResult.brand || 'Unknown').trim();
            const category = String(parsedResult.category || 'Other').trim();
            const condition = String(parsedResult.condition || 'Fair').trim();
            const confidence = Math.max(0, Math.min(100, parseInt(parsedResult.confidence, 10) || 0));

            // Compute/normalize decision defaults
            const defaults = calculateAIDecisionDefaults({
                deviceName,
                category,
                condition,
                estimatedValue: parsedResult.estimatedValue,
                recommendation: parsedResult.recommendation,
                reason: parsedResult.reason,
                ecoImpact: parsedResult.ecoImpact
            });

            return {
                deviceName,
                brand,
                category,
                condition,
                confidence,
                estimatedValue: defaults.estimatedValue,
                recommendation: defaults.recommendation,
                reason: defaults.reason,
                ecoImpact: defaults.ecoImpact
            };
        } catch (error) {
            console.error('Gemini Vision Service Error:', error);
            if (error.message && error.message.includes('API_KEY')) {
                throw new Error('Invalid or unauthenticated Gemini API key');
            }
            if (error instanceof SyntaxError) {
                throw new Error('Failed to parse AI Vision model output response');
            }
            throw new Error(error.message || 'Gemini Vision AI engine failed to analyze image');
        }
    }
}

module.exports = GeminiVisionService;
