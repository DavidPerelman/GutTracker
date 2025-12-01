// src/models/SymptomReport.ts

/**
 * ממשק דיווח תסמינים - מייצג דיווח יומי אחד
 */
export interface SymptomReport {
  // מזהים
  id: string;
  userId: string;
  reportedAt: Date;

  // תסמינים (0-10)
  bloating: number;
  constipation: number;
  pain: number;

  // יציאות
  stoolFrequency: number;
  stoolQuality?: number;

  // מדדים כלליים (חובה)
  appetite: number; // 1-10
  stressLevel: number; // 1-10
  waterCups: number;

  // תזונה ופעילות
  mealsSinceLastReport?: string; // תיאור חופשי של הארוחות
  physicalActivitySinceLastReport?: string;

  // שינה
  sleepHours?: number;
  sleepReportedToday: boolean;

  // הערות
  notes?: string;

  // מטא-דאטה
  createdAt: Date;
  updatedAt: Date;
}
