export interface NutritionData {
    /** Total caloric energy in kilocalories */
  calories: number;
    /** Protein content in grams */
  protein: number;
    /** Carbohydrates content in grams */
  carbs: number;
    /** Total fat content in grams */
  fat: number;
    /** Dietary fiber in grams (optional) */
  fiber?: number;
    /** Added/total sugars in grams (optional) */
  sugar?: number;
    /** Sodium content in milligrams (optional) */
  sodium?: number;
}

export interface AllergenInfo {
    /** List of detected allergens in the food */
  detected: string[];
    /** Warnings about potential cross-contamination or risks */
  warnings: string[];
    /** Dietary suitability flags */
  suitability: {
      /** Is the food gluten-free? */
    glutenFree: boolean;
      /** Is the food suitable for vegan diets? */
    vegan: boolean;
      /** Is the food suitable for diabetic diets? */
    diabeticSafe: boolean;
      /** Allow additional custom dietary restrictions */
    [key: string]: boolean;
  };
}

export interface FoodAnalysisResult {
    /** Name/description of the food item */
  itemName: string;
    /** Estimated portion size (e.g., "medium", "1 cup", "200g") */
  portionEstimate: string;
    /** Nutritional breakdown of the food */
  nutrition: NutritionData;
    /** Allergen information and dietary compatibility */
  allergens: AllergenInfo;
    /** Detailed text summary of the analysis */
  summary: string;
}

export interface HistoryItem extends FoodAnalysisResult {
    /** Unique identifier for the history entry */
  id: string;
    /** Timestamp when the analysis was performed */
  timestamp: number;
}

/** Supported analysis modes for user input */
export type AnalysisMode = 'meal' | 'label' | 'voice' | 'history';
