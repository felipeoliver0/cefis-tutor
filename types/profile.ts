// types/profile.ts
export interface UserProfile {
  age: string;
  learningStyle: string;
  studyTime: string;
  studyPeriod: string;
  subject: string;
}

export interface LearningEnvironment {
  id: string; // ID único (ex: timestamp ou crypto.randomUUID())
  name: string; // Ex: "SQL Mastery"
  profile: UserProfile;
}