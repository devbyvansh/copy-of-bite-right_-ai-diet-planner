
export interface UserProfile {
  age: number | null;
  weight: number | null;
  height: number | null;
  gender: 'Male' | 'Female' | 'Other' | '';
  activityLevel: 'Sedentary' | 'Lightly Active' | 'Moderately Active' | 'Very Active' | '';
  cuisines: string[];
  allergies: string[];
  dietGoals: string[];
}

export interface Meal {
  name: string;
  calories: number;
  description: string;
  imagePrompt?: string;
  imageUrl?: string;
}

export interface DayPlan {
  breakfast: Meal;
  lunch: Meal;
  snacks: Meal;
  dinner: Meal;
}

export type WeeklyPlan = {
  [day in 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday']: DayPlan;
};

export interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string[];
  nutrition: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
  healthTips: string[];
}

export interface RecipeCustomizationOptions {
  ingredientsToSwap: string;
  cookingTime: 'Any' | '< 15 mins' | '< 30 mins' | '< 1 hour';
  complexity: 'Any' | 'Quick & Easy' | 'Intermediate' | 'Gourmet';
}

// New Types for Workout Plan
export interface Workout {
  name: string;
  duration: string; // e.g., "30 minutes", "1 hour"
  intensity: 'Low' | 'Medium' | 'High';
  description: string; // Detailed steps or focus of the workout
}

export interface DailyWorkoutPlan {
  morning?: Workout;
  afternoon?: Workout;
  evening?: Workout;
}

export type WeeklyWorkoutPlan = {
  [day in 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday']: DailyWorkoutPlan;
};
