import React from 'react';
import { CountryInfo } from '../types';

interface CountryCardProps {
  country: CountryInfo;
}

export const CountryCard: React.FC<CountryCardProps> = ({ country }) => {
  const getBadgeColor = (feasibility: string) => {
    switch (feasibility) {
      case 'Very Good': return 'bg-green-100 text-green-800 border-green-200';
      case 'Good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  return (
    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <span className="text-xl">{country.flag}</span> {country.name}
        </h3>
        <span className={`text-xs px-2 py-1 rounded-full border font-semibold ${getBadgeColor(country.feasibility)}`}>
          {country.feasibility}
        </span>
      </div>
      <div className="text-xs text-gray-500">
        <p className="font-medium mb-1">Top Jobs:</p>
        <div className="flex flex-wrap gap-1">
          {country.jobs.map(job => (
            <span key={job} className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px]">
              {job}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
