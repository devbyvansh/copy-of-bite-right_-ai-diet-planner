import React from 'react';
import type { Recipe } from '../types';
import { CloseIcon } from './IconComponents';

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose }) => {
  if (!recipe) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-gray-800 transition z-10">
          <CloseIcon className="w-8 h-8" />
        </button>

        <div className="p-10 md:p-14">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-primary-dark mb-6">{recipe.name}</h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center my-8 bg-secondary p-4 rounded-xl border border-gray-200">
              <div className="p-2"><p className="font-bold text-lg text-text">{recipe.nutrition.calories}</p><p className="text-sm text-text-secondary">Calories</p></div>
              <div className="p-2"><p className="font-bold text-lg text-text">{recipe.nutrition.protein}</p><p className="text-sm text-text-secondary">Protein</p></div>
              <div className="p-2"><p className="font-bold text-lg text-text">{recipe.nutrition.carbs}</p><p className="text-sm text-text-secondary">Carbs</p></div>
              <div className="p-2"><p className="font-bold text-lg text-text">{recipe.nutrition.fat}</p><p className="text-sm text-text-secondary">Fat</p></div>
          </div>

          <div className="mb-10">
            <h3 className="text-2xl font-bold text-text mb-4">Ingredients</h3>
            <ul className="list-disc list-inside space-y-2 text-text-secondary text-base pl-2">
              {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
            </ul>
          </div>

          <div className="mb-10">
            <h3 className="text-2xl font-bold text-text mb-4">Instructions</h3>
            <ol className="list-decimal list-inside space-y-4 text-text-secondary text-base pl-2">
              {recipe.instructions.map((step, i) => <li key={i} className="pl-2">{step}</li>)}
            </ol>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-text mb-4">Health Tips</h3>
            <ul className="list-disc list-inside space-y-2 text-text-secondary text-base pl-2">
              {recipe.healthTips.map((tip, i) => <li key={i}>{tip}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;