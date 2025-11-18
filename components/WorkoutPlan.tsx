import React from 'react';
import type { WeeklyWorkoutPlan, Workout } from '../types';

interface WorkoutPlanProps {
  plan: WeeklyWorkoutPlan;
  onGetDetails: (workout: Workout) => void;
}

const WorkoutCard: React.FC<{ workout: Workout; timeOfDay: string, onGetDetails: (workout: Workout) => void }> = ({ workout, timeOfDay, onGetDetails }) => (
  <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 h-full flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    <div>
      <div className="flex justify-between items-start">
        <p className="text-sm font-bold uppercase text-blue-600 tracking-wider">{timeOfDay}</p>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${workout.intensity === 'High' ? 'bg-red-100 text-red-700' : workout.intensity === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
          {workout.intensity}
        </span>
      </div>
      <h4 className="font-bold text-lg text-text mt-2">{workout.name}</h4>
      <p className="text-sm font-semibold text-text-secondary mt-1">{workout.duration}</p>
      <p className="text-sm text-text-secondary mt-3 leading-relaxed line-clamp-3">{workout.description}</p>
    </div>
    <button 
      onClick={() => onGetDetails(workout)}
      className="mt-4 w-full text-sm bg-gray-100 text-blue-700 font-bold py-2.5 px-3 rounded-md hover:bg-blue-100/60 transition-colors"
    >
      View Details
    </button>
  </div>
);

const WorkoutPlan: React.FC<WorkoutPlanProps> = ({ plan, onGetDetails }) => {
  const days = Object.keys(plan) as (keyof WeeklyWorkoutPlan)[];

  return (
    <div className="mt-16">
      <h2 className="text-5xl font-extrabold text-center text-text mb-12">Your 7-Day Workout Plan</h2>
      <div className="space-y-12">
        {days.map(day => {
          const dailyWorkouts = plan[day];
          const workouts = Object.entries(dailyWorkouts).filter(([, workout]) => workout != null);

          if (workouts.length === 0) {
            return (
              <div key={day} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                <h3 className="text-3xl font-bold text-blue-800 mb-6">{day}</h3>
                <div className="text-center py-10">
                  <p className="text-lg font-semibold text-text-secondary">Rest Day</p>
                  <p className="text-gray-500">Enjoy your break and let your body recover!</p>
                </div>
              </div>
            );
          }
          
          return (
            <div key={day} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
              <h3 className="text-3xl font-bold text-blue-800 mb-6">{day}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {workouts.map(([time, workout]) => (
                  <WorkoutCard key={time} workout={workout as Workout} timeOfDay={time} onGetDetails={onGetDetails} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkoutPlan;
