import React, { useState } from 'react';
import type { RecipeCustomizationOptions } from '../types';
import { CloseIcon } from './IconComponents';
import LoadingSpinner from './LoadingSpinner';

interface RecipeCustomizationModalProps {
  mealName: string;
  onClose: () => void;
  onGenerate: (customizations: RecipeCustomizationOptions) => void;
  isLoading: boolean;
}

const cookingTimeOptions: RecipeCustomizationOptions['cookingTime'][] = ['Any', '< 15 mins', '< 30 mins', '< 1 hour'];
const complexityOptions: RecipeCustomizationOptions['complexity'][] = ['Any', 'Quick & Easy', 'Intermediate', 'Gourmet'];

const RecipeCustomizationModal: React.FC<RecipeCustomizationModalProps> = ({ mealName, onClose, onGenerate, isLoading }) => {
  const [customizations, setCustomizations] = useState<RecipeCustomizationOptions>({
    ingredientsToSwap: '',
    cookingTime: 'Any',
    complexity: 'Any',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(customizations);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-40">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition">
          <CloseIcon className="w-8 h-8" />
        </button>

        <div className="p-8">
          <h2 className="text-3xl font-bold text-text mb-2">Customize Recipe</h2>
          <p className="text-lg font-semibold text-primary-dark mb-8">{mealName}</p>

          {isLoading ? (
            <LoadingSpinner message="Generating your customized recipe..." />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="ingredients" className="block text-sm font-bold text-text mb-2">Swap or Avoid Ingredients</label>
                <input
                  type="text"
                  id="ingredients"
                  value={customizations.ingredientsToSwap}
                  onChange={(e) => setCustomizations({ ...customizations, ingredientsToSwap: e.target.value })}
                  placeholder="e.g., 'swap chicken for tofu', 'no nuts'"
                  className="w-full px-4 py-3 bg-secondary border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-text mb-2">Preferred Cooking Time</label>
                <div className="flex flex-wrap gap-2">
                  {cookingTimeOptions.map(option => (
                    <button type="button" key={option} onClick={() => setCustomizations({ ...customizations, cookingTime: option })} className={`px-4 py-2 rounded-lg font-semibold text-sm flex-grow transition ${customizations.cookingTime === option ? 'bg-primary text-white shadow' : 'bg-secondary text-gray-700 hover:bg-gray-300'}`}>{option}</button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-text mb-2">Meal Complexity</label>
                <div className="flex flex-wrap gap-2">
                  {complexityOptions.map(option => (
                    <button type="button" key={option} onClick={() => setCustomizations({ ...customizations, complexity: option })} className={`px-4 py-2 rounded-lg font-semibold text-sm flex-grow transition ${customizations.complexity === option ? 'bg-primary text-white shadow' : 'bg-secondary text-gray-700 hover:bg-gray-300'}`}>{option}</button>
                  ))}
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-all duration-300 shadow-md hover:shadow-lg">
                  Generate Customized Recipe
                </button>
                <button 
                  type="button" 
                  onClick={() => onGenerate({ ingredientsToSwap: '', cookingTime: 'Any', complexity: 'Any' })}
                  className="w-full bg-secondary text-primary-dark font-semibold py-3 px-6 rounded-md hover:bg-primary/20 transition-colors">
                  Get Original Recipe
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCustomizationModal;