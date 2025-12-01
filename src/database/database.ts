import * as SQLite from "expo-sqlite";
import { SymptomReport } from "../models/SymptomReport";

const DATABASE_NAME = "guttracker.db";

/**
 * פותח/יוצר את בסיס הנתונים
 */
export const openDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  return db;
};

/**
 * מאתחל את הטבלאות בבסיס הנתונים
 */
export const initDatabase = async (): Promise<void> => {
  const db = await openDatabase();

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS symptom_reports (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      reported_at TEXT NOT NULL,
      
      bloating INTEGER NOT NULL,
      constipation INTEGER NOT NULL,
      pain INTEGER NOT NULL,
      
      stool_frequency INTEGER NOT NULL,
      stool_quality INTEGER,
      
      appetite INTEGER NOT NULL,
      stress_level INTEGER NOT NULL,
      water_cups INTEGER NOT NULL,
      
      meals_since_last_report TEXT,
      physical_activity_since_last_report TEXT,
      
      sleep_hours REAL,
      sleep_reported_today INTEGER NOT NULL,
      
      notes TEXT,
      
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  console.log("✅ Database initialized successfully");
};

/**
 * יוצר דיווח תסמינים חדש
 */
export const createReport = async (report: SymptomReport): Promise<void> => {
  const db = await openDatabase();

  // SQL להכנסת דיווח
  await db.runAsync(
    `INSERT INTO symptom_reports (
      id, user_id, reported_at,
      bloating, constipation, pain,
      stool_frequency, stool_quality,
      appetite, stress_level, water_cups,
      meals_since_last_report, physical_activity_since_last_report,
      sleep_hours, sleep_reported_today,
      notes,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      report.id,
      report.userId,
      report.reportedAt.toISOString(),
      report.bloating,
      report.constipation,
      report.pain,
      report.stoolFrequency,
      report.stoolQuality ?? null,
      report.appetite,
      report.stressLevel,
      report.waterCups,
      report.mealsSinceLastReport ?? null,
      report.physicalActivitySinceLastReport ?? null,
      report.sleepHours ?? null,
      report.sleepReportedToday ? 1 : 0, // boolean → 0/1
      report.notes ?? null,
      report.createdAt.toISOString(),
      report.updatedAt.toISOString(),
    ]
  );

  console.log("✅ Report created:", report.id);
};
