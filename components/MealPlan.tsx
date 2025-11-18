import React from 'react';
import type { WeeklyPlan, Meal } from '../types';

interface MealPlanProps {
  plan: WeeklyPlan;
  onGetRecipe: (mealName: string) => void;
}

const MealCard: React.FC<{ meal: Meal; mealType: string, onGetRecipe: (name: string) => void }> = ({ meal, mealType, onGetRecipe }) => (
  <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 h-full flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    <div>
      <p className="text-sm font-bold uppercase text-primary tracking-wider">{mealType}</p>
      <h4 className="font-bold text-lg text-text mt-2">{meal.name}</h4>
      <p className="text-sm font-semibold text-text-secondary mt-1">{meal.calories} kcal</p>
      <p className="text-sm text-text-secondary mt-3 leading-relaxed">{meal.description}</p>
    </div>
    <button 
      onClick={() => onGetRecipe(meal.name)}
      className="mt-4 w-full text-sm bg-secondary text-primary-dark font-bold py-2.5 px-3 rounded-md hover:bg-primary/20 transition-colors"
    >
      Get Recipe
    </button>
  </div>
);

const MealPlan: React.FC<MealPlanProps> = ({ plan, onGetRecipe }) => {
  const days = Object.keys(plan) as (keyof WeeklyPlan)[];

  return (
    <div className="mt-16">
      <h2 className="text-5xl font-extrabold text-center text-text mb-12">Your 7-Day Meal Plan</h2>
      <div className="space-y-12">
        {days.map(day => (
          <div key={day} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <h3 className="text-3xl font-bold text-primary-dark mb-6">{day}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MealCard meal={plan[day].breakfast} mealType="Breakfast" onGetRecipe={onGetRecipe} />
              <MealCard meal={plan[day].lunch} mealType="Lunch" onGetRecipe={onGetRecipe} />
              <MealCard meal={plan[day].snacks} mealType="Snack" onGetRecipe={onGetRecipe} />
              <MealCard meal={plan[day].dinner} mealType="Dinner" onGetRecipe={onGetRecipe} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealPlan;