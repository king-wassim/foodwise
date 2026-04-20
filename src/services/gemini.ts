import { GoogleGenAI, Type } from "@google/genai";
import { FoodAnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Validation schema for API responses
const validateResponse = (data: unknown): data is FoodAnalysisResult => {
  if (!data || typeof data !== 'object') return false;
  const obj = data as any;
  return (
    typeof obj.itemName === 'string' &&
    typeof obj.portionEstimate === 'string' &&
    obj.nutrition &&
    typeof obj.nutrition.calories === 'number' &&
    typeof obj.nutrition.protein === 'number' &&
    typeof obj.nutrition.carbs === 'number' &&
    typeof obj.nutrition.fat === 'number' &&
    obj.allergens &&
    Array.isArray(obj.allergens.detected) &&
    Array.isArray(obj.allergens.warnings) &&
    typeof obj.summary === 'string'
  );
};

const ANALYSIS_SCHEMA = {
  /**
   * Analyzes a meal image for nutritional content and allergen information
   * @param {string} base64Image - Base64 encoded image data
   * @returns {Promise<FoodAnalysisResult>} Structured analysis results
   * @throws {Error} If API call fails or response is invalid
   */
  type: Type.OBJECT,
  properties: {
    itemName: { type: Type.STRING },
    portionEstimate: { type: Type.STRING },
    nutrition: {
      type: Type.OBJECT,
      properties: {
        calories: { type: Type.NUMBER },
        protein: { type: Type.NUMBER },
        carbs: { type: Type.NUMBER },
        fat: { type: Type.NUMBER },
        fiber: { type: Type.NUMBER },
        sugar: { type: Type.NUMBER },
        sodium: { type: Type.NUMBER },
      },
      required: ["calories", "protein", "carbs", "fat"],
    },
    allergens: {
      type: Type.OBJECT,
      properties: {
        detected: { type: Type.ARRAY, items: { type: Type.STRING } },
        warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
        suitability: {
          type: Type.OBJECT,
          properties: {
            glutenFree: { type: Type.BOOLEAN },
            vegan: { type: Type.BOOLEAN },
            diabeticSafe: { type: Type.BOOLEAN },
          },
        },
      },
    },
    summary: { type: Type.STRING },
  },
  required: ["itemName", "portionEstimate", "nutrition", "allergens", "summary"],
};

export async function analyzeMealImage(base64Image: string): Promise<FoodAnalysisResult> {
  if (!base64Image) {
    throw new Error('Image data is required');
  }
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured. Please set GEMINI_API_KEY in .env.local');
  }

  try {
    const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { text: "Analyze this meal image. Identify the food, estimate portion size, calories, and nutritional breakdown. Also check for common allergens and dietary suitability (gluten-free, vegan, diabetic-safe)." },
          { inlineData: { data: base64Image, mimeType: "image/jpeg" } }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: ANALYSIS_SCHEMA,
    }
  });

    const parsed = JSON.parse(response.text || "{}");
    if (!validateResponse(parsed)) {
      throw new Error('Invalid response format from Gemini API');
    }
    return parsed;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Meal analysis failed: ${error.message}`);
    }
    throw new Error('Meal analysis failed: Unknown error');
  }
}

/**
 * Analyzes an ingredient label image via OCR
 * @param {string} base64Image - Base64 encoded label image
 * @returns {Promise<FoodAnalysisResult>} Extracted nutrition and allergen data
 * @throws {Error} If OCR or API call fails
 */
export async function analyzeLabelImage(base64Image: string): Promise<FoodAnalysisResult> {
  if (!base64Image) {
    throw new Error('Label image is required');
  }
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured. Please set GEMINI_API_KEY in .env.local');
  }

  try {
    const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { text: "Perform OCR on this ingredient label. Extract nutritional values and identify all ingredients. Flag any allergens and determine dietary suitability." },
          { inlineData: { data: base64Image, mimeType: "image/jpeg" } }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: ANALYSIS_SCHEMA,
    }
  });

    const parsed = JSON.parse(response.text || "{}");
    if (!validateResponse(parsed)) {
      throw new Error('Invalid response format from Gemini API');
    }
    return parsed;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Label analysis failed: ${error.message}`);
    }
    throw new Error('Label analysis failed: Unknown error');
  }
}

/**
 * Analyzes a voice log text description of food
 * @param {string} voiceText - Description of the meal/food
 * @returns {Promise<FoodAnalysisResult>} Estimated nutrition data
 * @throws {Error} If API call fails or text is invalid
 */
export async function analyzeVoiceLog(voiceText: string): Promise<FoodAnalysisResult> {
  if (!voiceText || voiceText.trim().length === 0) {
    throw new Error('Food description is required');
  }
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured. Please set GEMINI_API_KEY in .env.local');
  }

  try {
    const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this food log: "${voiceText}". Estimate calories and nutrition based on the description.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: ANALYSIS_SCHEMA,
    }
  });

    const parsed = JSON.parse(response.text || "{}");
    if (!validateResponse(parsed)) {
      throw new Error('Invalid response format from Gemini API');
    }
    return parsed;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Voice analysis failed: ${error.message}`);
    }
    throw new Error('Voice analysis failed: Unknown error');
  }
}
