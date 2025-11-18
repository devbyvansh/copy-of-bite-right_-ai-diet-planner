import React from 'react';
import type { Meal } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface SmartPantryProps {
  query: string;
  setQuery: (query: string) => void;
  result: Meal | null;
  onSubmit: (e: React.FormEvent) => void;
  onGetRecipe: (mealName: string) => void;
  isLoading: boolean;
}

const SmartPantry: React.FC<SmartPantryProps> = ({ query, setQuery, result, onSubmit, onGetRecipe, isLoading }) => {
  return (
    <div className="bg-white p-10 rounded-2xl shadow-lg max-w-4xl mx-auto mt-16 border border-gray-200">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold text-text mb-2">Smart Pantry</h2>
        <p className="text-lg text-text-secondary">Have ingredients? Get a meal idea instantly.</p>
      </div>
      
      <form onSubmit={onSubmit}>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., I have oats, banana, eggs, and milk at home. Suggest a breakfast."
          className="w-full h-28 px-4 py-3 bg-secondary border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition mb-4 resize-none"
          required
        />
        <button type="submit" disabled={isLoading} className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-all duration-300 shadow-md hover:shadow-lg disabled:bg-gray-400">
          {isLoading ? 'Thinking...' : 'Get Meal Idea'}
        </button>
      </form>

      {isLoading && <LoadingSpinner message="Generating meal idea..." />}
      
      {result && !isLoading && (
        <div className="mt-10 p-6 bg-secondary rounded-xl border border-gray-200">
          <h3 className="text-2xl font-bold text-text mb-5 text-center">Your Meal Suggestion</h3>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-shrink-0">
              {result.imageUrl ? (
                <img src={result.imageUrl} alt={result.name} className="w-48 h-48 object-cover rounded-lg shadow-md" />
              ) : (
                <div className="w-48 h-48 bg-gray-300 rounded-lg flex items-center justify-center animate-pulse">
                    <span className="text-gray-500">Generating image...</span>
                </div>
              )}
            </div>
            <div className="flex-grow">
              <h4 className="text-2xl font-bold text-primary-dark">{result.name}</h4>
              <p className="text-lg font-semibold text-text-secondary mt-1">{result.calories} Calories</p>
              <p className="text-text mt-4 text-base">{result.description}</p>
              <button onClick={() => onGetRecipe(result.name)} className="mt-5 bg-primary-dark text-white font-semibold py-2 px-6 rounded-lg hover:bg-primary-dark/80 transition-all duration-300 shadow hover:shadow-md">
                Get Recipe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartPantry;