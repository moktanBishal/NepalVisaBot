export interface Message {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export enum JobSector {
  CONSTRUCTION = 'Construction',
  FARMING = 'Agriculture/Farm',
  HOSPITALITY = 'Hotel/Restaurant',
  CAREGIVER = 'Caregiver',
  DRIVER = 'Heavy Driver',
  FACTORY = 'Factory',
  SECURITY = 'Security Guard'
}

export interface UserProfile {
  age: string;
  education: string;
  experience: string;
  preferredSector: JobSector | string;
  budget: string;
}

export interface CountryInfo {
  name: string;
  feasibility: 'Very Good' | 'Good' | 'Medium' | 'Hard' | 'Impossible';
  jobs: string[];
  flag: string;
}