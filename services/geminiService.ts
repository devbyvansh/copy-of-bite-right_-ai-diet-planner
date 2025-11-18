
import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { UserProfile, WeeklyPlan, Meal, Recipe, RecipeCustomizationOptions, WeeklyWorkoutPlan } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const mealSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "Name of the meal." },
    calories: { type: Type.NUMBER, description: "Estimated calories for the meal." },
    description: { type: Type.STRING, description: "A short, enticing health description of the meal." },
  },
  required: ['name', 'calories', 'description'],
};

const dayPlanSchema = {
  type: Type.OBJECT,
  properties: {
    breakfast: mealSchema,
    lunch: mealSchema,
    snacks: mealSchema,
    dinner: mealSchema,
  },
  required: ['breakfast', 'lunch', 'snacks', 'dinner'],
};

const weeklyPlanSchema = {
  type: Type.OBJECT,
  properties: {
    Monday: dayPlanSchema,
    Tuesday: dayPlanSchema,
    Wednesday: dayPlanSchema,
    Thursday: dayPlanSchema,
    Friday: dayPlanSchema,
    Saturday: dayPlanSchema,
    Sunday: dayPlanSchema,
  },
  required: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
};

export const generateWeeklyPlan = async (profile: UserProfile): Promise<WeeklyPlan> => {
  const prompt = `
    Create a personalized 7-day weekly meal plan for a user with the following profile:
    - Age: ${profile.age}
    - Weight: ${profile.weight} kg
    - Height: ${profile.height} cm
    - Gender: ${profile.gender}
    - Activity Level: ${profile.activityLevel}
    - Preferred Cuisines: ${profile.cuisines.join(', ') || 'Any'}
    - Allergies or dietary restrictions: ${profile.allergies.join(', ') || 'None'}
    - Diet Goals: ${profile.dietGoals.join(', ')}

    For each day (Monday to Sunday), provide a healthy and balanced meal for Breakfast, Lunch, Snacks, and Dinner.
    Ensure the meals align with the user's goals, preferences, and restrictions.
    Provide the output in a structured JSON format.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: weeklyPlanSchema,
    },
  });

  const parsedResponse = JSON.parse(response.text);
  return parsedResponse as WeeklyPlan;
};

const smartPantryMealSchema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "Name of the meal." },
      calories: { type: Type.NUMBER, description: "Estimated calories for the meal." },
      description: { type: Type.STRING, description: "A short nutritional note about the meal." },
      imagePrompt: { type: Type.STRING, description: "A simple, clear prompt for an image generation model to create a photorealistic image of the meal. E.g., 'A bowl of oatmeal with fresh bananas and blueberries'." },
    },
    required: ['name', 'calories', 'description', 'imagePrompt'],
};


export const generatePantryMeal = async (pantryItems: string): Promise<Meal> => {
    const prompt = `
        Given the following ingredients available in a pantry: "${pantryItems}", suggest a single, simple, and healthy meal. 
        Provide the meal name, estimated calories, a short nutritional note, and a simple, clear prompt to generate a photorealistic image of the meal.
        The image prompt should be descriptive and concise.
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: smartPantryMealSchema,
        }
    });

    const parsedResponse = JSON.parse(response.text);
    return parsedResponse as Meal;
};

export const generateImageForMeal = async (imagePrompt: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: imagePrompt }],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:image/png;base64,${base64ImageBytes}`;
        }
    }
    throw new Error("Image generation failed.");
};


const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "The name of the recipe." },
    ingredients: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of ingredients with quantities." },
    instructions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Step-by-step cooking instructions." },
    nutrition: {
      type: Type.OBJECT,
      properties: {
        calories: { type: Type.STRING },
        protein: { type: Type.STRING },
        carbs: { type: Type.STRING },
        fat: { type: Type.STRING },
      },
      required: ['calories', 'protein', 'carbs', 'fat'],
    },
    healthTips: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A few health tips related to the meal." },
  },
  required: ['name', 'ingredients', 'instructions', 'nutrition', 'healthTips'],
};

export const getRecipeDetails = async (
  mealName: string,
  customizations?: Partial<RecipeCustomizationOptions>
): Promise<Recipe> => {
  let prompt = `Provide a detailed recipe for "${mealName}".`;

  if (customizations) {
    const customParts: string[] = [];
    if (customizations.ingredientsToSwap) {
      customParts.push(`Please modify it with the following ingredient constraints: ${customizations.ingredientsToSwap}. For example, if asked to swap an ingredient, replace it with a suitable alternative. If asked to avoid an ingredient, remove it and adjust the recipe accordingly.`);
    }
    if (customizations.cookingTime && customizations.cookingTime !== 'Any') {
      customParts.push(`The total cooking time should be ${customizations.cookingTime}.`);
    }
    if (customizations.complexity && customizations.complexity !== 'Any') {
      customParts.push(`The meal complexity should be "${customizations.complexity}".`);
    }

    if (customParts.length > 0) {
      prompt += ` ${customParts.join(' ')}`;
    }
  }

  prompt += `\n\nInclude a list of ingredients, step-by-step instructions, nutritional information (calories, protein, carbs, fat), and some relevant health tips.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: recipeSchema,
    },
  });

  const parsedResponse = JSON.parse(response.text);
  return parsedResponse as Recipe;
};

// New schemas for workout plan
const workoutSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "Name of the workout." },
        duration: { type: Type.STRING, description: "Duration of the workout, e.g., '30 minutes'." },
        intensity: { type: Type.STRING, description: "Intensity level: Low, Medium, or High." },
        description: { type: Type.STRING, description: "A detailed description of the workout including exercises and steps." },
    },
    required: ['name', 'duration', 'intensity', 'description'],
};

const dailyWorkoutPlanSchema = {
    type: Type.OBJECT,
    properties: {
        morning: { ...workoutSchema, nullable: true },
        afternoon: { ...workoutSchema, nullable: true },
        evening: { ...workoutSchema, nullable: true },
    },
};

const weeklyWorkoutPlanSchema = {
    type: Type.OBJECT,
    properties: {
        Monday: dailyWorkoutPlanSchema,
        Tuesday: dailyWorkoutPlanSchema,
        Wednesday: dailyWorkoutPlanSchema,
        Thursday: dailyWorkoutPlanSchema,
        Friday: dailyWorkoutPlanSchema,
        Saturday: dailyWorkoutPlanSchema,
        Sunday: dailyWorkoutPlanSchema,
    },
    required: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
};

export const generateWeeklyWorkoutPlan = async (profile: UserProfile): Promise<WeeklyWorkoutPlan> => {
    const prompt = `
      Create a personalized 7-day weekly workout plan for a user with the following profile:
      - Age: ${profile.age}
      - Gender: ${profile.gender}
      - Activity Level: ${profile.activityLevel}
      - Primary Goals: ${profile.dietGoals.join(', ')}
  
      For each day (Monday to Sunday), provide a suitable workout plan. This can include a workout for the morning, afternoon, or evening. It's not necessary to have a workout for every slot, but provide a balanced week. For example, include rest days or lighter activity days.
      Focus on workouts that align with the user's goals (e.g., cardio for weight loss, strength training for muscle gain).
      For each workout, provide a name, duration, intensity (Low, Medium, High), and a detailed description of the exercises.
      Provide the output in a structured JSON format.
    `;
  
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: weeklyWorkoutPlanSchema,
      },
    });
  
    const parsedResponse = JSON.parse(response.text);
    return parsedResponse as WeeklyWorkoutPlan;
};
