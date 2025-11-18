import React, { useState, useCallback } from 'react';
import type { UserProfile, WeeklyPlan, Meal, Recipe, RecipeCustomizationOptions, WeeklyWorkoutPlan, Workout } from './types';
import { generateWeeklyPlan, generatePantryMeal, generateImageForMeal, getRecipeDetails, generateWeeklyWorkoutPlan } from './services/geminiService';
import UserProfileForm from './components/UserProfileForm';
import SmartPantry from './components/SmartPantry';
import MealPlan from './components/MealPlan';
import RecipeModal from './components/RecipeModal';
import LoadingSpinner from './components/LoadingSpinner';
import RecipeCustomizationModal from './components/RecipeCustomizationModal';
import { LogoIcon } from './components/IconComponents';
import WorkoutPlan from './components/WorkoutPlan';
import WorkoutDetailModal from './components/WorkoutDetailModal';

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    age: 30, weight: 70, height: 175, gender: 'Male', activityLevel: 'Moderately Active',
    cuisines: [], allergies: [], dietGoals: ['Balanced Diet']
  });
  const [smartPantryQuery, setSmartPantryQuery] = useState('');
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null);
  const [weeklyWorkoutPlan, setWeeklyWorkoutPlan] = useState<WeeklyWorkoutPlan | null>(null);
  const [smartPantryResult, setSmartPantryResult] = useState<Meal | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPantryLoading, setIsPantryLoading] = useState(false);
  const [isRecipeLoading, setIsRecipeLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mealForCustomization, setMealForCustomization] = useState<string | null>(null);
  
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setWeeklyPlan(null);
    setWeeklyWorkoutPlan(null);
    try {
      // Generate both plans in parallel
      const [mealPlan, workoutPlan] = await Promise.all([
        generateWeeklyPlan(userProfile),
        generateWeeklyWorkoutPlan(userProfile)
      ]);
      setWeeklyPlan(mealPlan);
      setWeeklyWorkoutPlan(workoutPlan);
    } catch (err) {
      setError('Failed to generate your health plan. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePantrySubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPantryLoading(true);
    setError(null);
    setSmartPantryResult(null);
    try {
      const meal = await generatePantryMeal(smartPantryQuery);
      setSmartPantryResult(meal);
      if(meal.imagePrompt) {
        generateImageForMeal(meal.imagePrompt)
          .then(imageUrl => {
            setSmartPantryResult(prev => prev ? {...prev, imageUrl} : null);
          })
          .catch(err => console.error("Image generation failed:", err));
      }
    } catch (err) {
      setError('Failed to generate meal suggestion. Please try again.');
      console.error(err);
    } finally {
      setIsPantryLoading(false);
    }
  }, [smartPantryQuery]);
  
  const handleGetRecipe = (mealName: string) => {
    setMealForCustomization(mealName);
  };

  const handleGetWorkoutDetails = (workout: Workout) => {
    setSelectedWorkout(workout);
  };

  const handleCloseCustomizationModal = () => {
    setMealForCustomization(null);
  };

  const handleGenerateCustomizedRecipe = async (customizations: RecipeCustomizationOptions) => {
    if (!mealForCustomization) return;
    
    setIsRecipeLoading(true);
    setError(null);
    setSelectedRecipe(null);
    
    try {
        const recipe = await getRecipeDetails(mealForCustomization, customizations);
        setSelectedRecipe(recipe);
        handleCloseCustomizationModal();
    } catch (err) {
        setError('Failed to fetch recipe details. Please try again.');
        console.error(err);
    } finally {
        setIsRecipeLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen text-text font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center">
              <LogoIcon className="w-10 h-10 text-primary-dark" />
              <h1 className="text-3xl font-extrabold text-text ml-3 tracking-tight">
                BITE-RIGHT
              </h1>
            </div>
            <p className="text-sm font-semibold text-text-secondary uppercase tracking-widest mt-1">
              AI-Powered Diet Recommendation System
            </p>
            <p className="text-md text-primary-dark mt-2 italic">
              "Take care of your body. It's the only place you have to live."
            </p>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <UserProfileForm profile={userProfile} setProfile={setUserProfile} onSubmit={handleProfileSubmit} isLoading={isLoading} />

        {error && <div className="my-8 p-4 text-center bg-red-100 text-red-700 rounded-lg">{error}</div>}

        {isLoading && <div className="mt-12"><LoadingSpinner message="Building your personalized health plan..." /></div>}
        
        {weeklyPlan && <MealPlan plan={weeklyPlan} onGetRecipe={handleGetRecipe} />}
        
        {weeklyWorkoutPlan && <WorkoutPlan plan={weeklyWorkoutPlan} onGetDetails={handleGetWorkoutDetails} />}

        <SmartPantry
            query={smartPantryQuery}
            setQuery={setSmartPantryQuery}
            result={smartPantryResult}
            onSubmit={handlePantrySubmit}
            onGetRecipe={handleGetRecipe}
            isLoading={isPantryLoading}
        />

        {mealForCustomization && (
            <RecipeCustomizationModal
                mealName={mealForCustomization}
                onClose={handleCloseCustomizationModal}
                onGenerate={handleGenerateCustomizedRecipe}
                isLoading={isRecipeLoading}
            />
        )}

        <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
        <WorkoutDetailModal workout={selectedWorkout} onClose={() => setSelectedWorkout(null)} />
      </main>

       <footer className="text-center py-10 text-text-secondary border-t border-gray-200 mt-16">
          <p>&copy; {new Date().getFullYear()} BiteRight. Personalized health at your fingertips.</p>
       </footer>
    </div>
  );
};

export default App;
