import React, { useState } from 'react';
import { JobSector, UserProfile } from '../types';
import { Send, ChevronRight } from 'lucide-react';

interface ProfileFormProps {
  onSubmit: (profile: UserProfile) => void;
  isLoading: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ onSubmit, isLoading }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({
    age: '',
    education: '',
    experience: '',
    preferredSector: '',
    budget: ''
  });

  const handleChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => setStep(prev => prev + 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(profile);
  };

  const inputClass = "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nepalRed focus:border-nepalRed outline-none bg-white transition-all";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm max-w-lg w-full mx-auto">
      <div className="mb-6 border-b pb-4">
        <h3 className="text-xl font-bold text-gray-800">तपाईंको विवरण भर्नुहोस्</h3>
        <p className="text-sm text-gray-500">सहि जानकारी दिनु भएमा सहि सल्लाह पाउनुहुनेछ।</p>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className={labelClass}>तपाईंको उमेर (Age)?</label>
              <input 
                type="number" 
                placeholder="Ex: 28" 
                className={inputClass}
                value={profile.age}
                onChange={(e) => handleChange('age', e.target.value)}
                autoFocus
              />
            </div>
            <div>
              <label className={labelClass}>तपाईंको पढाइ (Education)?</label>
              <select 
                className={inputClass}
                value={profile.education}
                onChange={(e) => handleChange('education', e.target.value)}
              >
                <option value="">Select Education</option>
                <option value="Below SLC">SLC भन्दा कम (Below SLC)</option>
                <option value="SLC/SEE">SLC / SEE Pass</option>
                <option value="+2 Pass">+2 Pass</option>
                <option value="Bachelor">Bachelor Pass</option>
              </select>
            </div>
            <button 
              type="button" 
              onClick={handleNext}
              disabled={!profile.age || !profile.education}
              className="w-full bg-nepalBlue text-white py-3 rounded-lg font-bold hover:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
            >
              Next <ChevronRight size={18} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className={labelClass}>कामको अनुभव (Experience)?</label>
              <input 
                type="text" 
                placeholder="Ex: 2 years house painter, or No experience" 
                className={inputClass}
                value={profile.experience}
                onChange={(e) => handleChange('experience', e.target.value)}
                autoFocus
              />
            </div>
            <div>
              <label className={labelClass}>कुन काम खोज्दै हुनुहुन्छ (Preferred Job)?</label>
              <select 
                className={inputClass}
                value={profile.preferredSector}
                onChange={(e) => handleChange('preferredSector', e.target.value)}
              >
                <option value="">Select Job Type</option>
                {Object.values(JobSector).map(sector => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 mt-4">
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="w-1/3 bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200"
              >
                Back
              </button>
              <button 
                type="button" 
                onClick={handleNext}
                disabled={!profile.experience || !profile.preferredSector}
                className="w-2/3 bg-nepalBlue text-white py-3 rounded-lg font-bold hover:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Next <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className={labelClass}>बजेट कति छ (Budget in Lakhs)?</label>
              <div className="relative">
                 <span className="absolute left-3 top-3.5 text-gray-500 font-bold">Rs.</span>
                 <input 
                  type="number" 
                  placeholder="Ex: 5" 
                  className={`${inputClass} pl-12`}
                  value={profile.budget}
                  onChange={(e) => handleChange('budget', e.target.value)}
                  autoFocus
                />
                 <span className="absolute right-3 top-3.5 text-gray-500">Lakhs</span>
              </div>
              <p className="text-xs text-red-500 mt-1">* कृपया सत्य बजेट लेख्नुहोला</p>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                type="button" 
                onClick={() => setStep(2)}
                className="w-1/3 bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200"
              >
                Back
              </button>
              <button 
                type="submit" 
                disabled={isLoading || !profile.budget}
                className="w-2/3 bg-nepalRed text-white py-3 rounded-lg font-bold hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? 'Processing...' : 'सल्लाह लिनुहोस्'} <Send size={18} />
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
