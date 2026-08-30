export interface SymptomSeverity {
  symptom: string;
  severity: number;
}

export interface FormData {
  fullName: string;
  gender: 'Male' | 'Female' | '';
  currentStateGoals: string[];
  otherGoal: string;
  mostImportantGoal: string;
  currentWeight: string;
  height: string;
  age: string;
  bodyFatCurrent: string;
  bodyFatGoal: string;
  bodyFatDuration: string;
  symptomSeverities: SymptomSeverity[];
  otherSymptom: string;
  symptomDuration: string;
  bloodworkStatus: string;
  testosteroneLevel: string;
  lastLabsDate: string;
  previousAttempts: string[];
  supplementsUsed: string;
  whatTried: string;
  howLongStuck: string;
  whyStoppedWorking: string;
  whyStillLooking: string;
  hoursPerWeek: string;
  currentTrainingProgram: string;
  medicalConditions: string;
  stressSleepSituation: string;
  consequences: string;
  lifeSolved: string;
  howFoundUs: string;
  commitmentLevel: string;
  investmentRange: string;
  wasReferred: string;
  referredBy: string;
  email: string;
  phone: string;
  instagram: string;
}
