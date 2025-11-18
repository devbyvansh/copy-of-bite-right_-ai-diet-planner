import React from 'react';
import type { UserProfile } from '../types';
import MultiSelectInput from './MultiSelectInput';

interface UserProfileFormProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const activityLevels: UserProfile['activityLevel'][] = ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active'];
const genders: UserProfile['gender'][] = ['Male', 'Female', 'Other'];

const UserProfileForm: React.FC<UserProfileFormProps> = ({ profile, setProfile, onSubmit, isLoading }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value ? Number(value) : null });
  };
  
  const predefinedCuisines = ['Italian', 'Mexican', 'Chinese', 'Indian', 'Japanese', 'Mediterranean'];
  const predefinedAllergies = ['Peanuts', 'Dairy', 'Gluten', 'Shellfish', 'Soy'];
  const predefinedGoals = ['Weight Loss', 'Weight Gain', 'Muscle Gain', 'Balanced Diet', 'High Protein', 'Low Carb', 'Low Sugar'];

  return (
    <div className="bg-white p-10 rounded-2xl shadow-lg max-w-4xl mx-auto border border-gray-200">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-text mb-2">Create Your Profile</h2>
        <p className="text-lg text-text-secondary">Tell us about yourself to generate a personalized health plan.</p>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="age" className="block text-sm font-bold text-text mb-2">Age</label>
            <input type="number" name="age" id="age" value={profile.age || ''} onChange={handleChange} required className="w-full px-4 py-3 bg-secondary border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition" />
          </div>
          <div>
            <label htmlFor="weight" className="block text-sm font-bold text-text mb-2">Weight (kg)</label>
            <input type="number" name="weight" id="weight" value={profile.weight || ''} onChange={handleChange} required className="w-full px-4 py-3 bg-secondary border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition" />
          </div>
          <div>
            <label htmlFor="height" className="block text-sm font-bold text-text mb-2">Height (cm)</label>
            <input type="number" name="height" id="height" value={profile.height || ''} onChange={handleChange} required className="w-full px-4 py-3 bg-secondary border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <label className="block text-sm font-bold text-text mb-3">Gender</label>
                <div className="flex space-x-2">
                {genders.map(g => (
                    <button type="button" key={g} onClick={() => setProfile({ ...profile, gender: g })} className={`px-4 py-3 rounded-lg font-semibold w-full transition text-base ${profile.gender === g ? 'bg-primary text-white shadow-md' : 'bg-secondary text-gray-700 hover:bg-gray-300'}`}>{g}</button>
                ))}
                </div>
            </div>
            <div>
                <label className="block text-sm font-bold text-text mb-3">Activity Level</label>
                <div className="flex flex-wrap gap-2">
                    {activityLevels.map(level => (
                        <button type="button" key={level} onClick={() => setProfile({ ...profile, activityLevel: level })} className={`px-4 py-2 rounded-lg font-semibold text-sm flex-grow transition ${profile.activityLevel === level ? 'bg-primary text-white shadow' : 'bg-secondary text-gray-700 hover:bg-gray-300'}`}>{level}</button>
                    ))}
                </div>
            </div>
        </div>

        <MultiSelectInput label="Preferred Cuisines" placeholder="Type a cuisine..." predefinedOptions={predefinedCuisines} selectedItems={profile.cuisines} setSelectedItems={(items) => setProfile({...profile, cuisines: items})} />
        <MultiSelectInput label="Allergies & Restrictions" placeholder="e.g., Lactose" predefinedOptions={predefinedAllergies} selectedItems={profile.allergies} setSelectedItems={(items) => setProfile({...profile, allergies: items})} />
        <MultiSelectInput label="Diet & Health Goals" placeholder="e.g., Improve energy" predefinedOptions={predefinedGoals} selectedItems={profile.dietGoals} setSelectedItems={(items) => setProfile({...profile, dietGoals: items})} />
        
        <div className="pt-6">
          <button type="submit" disabled={isLoading} className="w-full bg-primary text-white font-bold text-lg py-4 px-6 rounded-lg hover:bg-primary-dark transition-all duration-300 shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:-translate-y-1">
            {isLoading ? 'Generating Your Plan...' : 'Generate My Health Plan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfileForm;
