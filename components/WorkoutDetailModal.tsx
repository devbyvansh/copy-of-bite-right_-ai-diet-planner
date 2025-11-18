import React from 'react';
import type { Workout } from '../types';
import { CloseIcon } from './IconComponents';

interface WorkoutDetailModalProps {
  workout: Workout | null;
  onClose: () => void;
}

const WorkoutDetailModal: React.FC<WorkoutDetailModalProps> = ({ workout, onClose }) => {
  if (!workout) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-gray-800 transition z-10">
          <CloseIcon className="w-8 h-8" />
        </button>

        <div className="p-10 md:p-12">
          <h2 className="text-4xl font-extrabold text-blue-800 mb-2">{workout.name}</h2>
          <div className="flex items-center gap-4 text-text-secondary mb-8">
            <span className="font-semibold">{workout.duration}</span>
            <span className="text-gray-300">|</span>
            <span className={`font-bold px-2 py-0.5 rounded-full text-sm ${workout.intensity === 'High' ? 'bg-red-100 text-red-700' : workout.intensity === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                {workout.intensity} Intensity
            </span>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-text mb-4">Workout Description</h3>
            <p className="text-text-secondary text-base whitespace-pre-line leading-relaxed">{workout.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetailModal;
