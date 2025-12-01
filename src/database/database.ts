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

/**
 * ממיר שורה מ-SQLite למבנה SymptomReport
 */
const rowToReport = (row: any): SymptomReport => {
  return {
    id: row.id,
    userId: row.user_id,
    reportedAt: new Date(row.reported_at),

    bloating: row.bloating,
    constipation: row.constipation,
    pain: row.pain,

    stoolFrequency: row.stool_frequency,
    stoolQuality: row.stool_quality,

    appetite: row.appetite,
    stressLevel: row.stress_level,
    waterCups: row.water_cups,

    mealsSinceLastReport: row.meals_since_last_report,
    physicalActivitySinceLastReport: row.physical_activity_since_last_report,

    sleepHours: row.sleep_hours,
    sleepReportedToday: row.sleep_reported_today === 1,

    notes: row.notes,

    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
};

/**
 * מחזיר את כל הדיווחים של משתמש
 */
export const getAllReports = async (
  userId: string
): Promise<SymptomReport[]> => {
  const db = await openDatabase();

  const result = await db.getAllAsync(
    `SELECT * FROM symptom_reports 
     WHERE user_id = ? 
     ORDER BY reported_at DESC`,
    [userId]
  );

  // המרת כל השורות למבנה SymptomReport
  return result.map(rowToReport);
};

/**
 * מחזיר דיווח בודד לפי ID
 */
export const getReportById = async (
  reportId: string
): Promise<SymptomReport | null> => {
  const db = await openDatabase();

  const result = await db.getFirstAsync(
    `SELECT * FROM symptom_reports WHERE id = ?`,
    [reportId]
  );

  // אם לא נמצא - מחזיר null
  if (!result) {
    return null;
  }

  return rowToReport(result);
};

/**
 * מעדכן דיווח קיים
 */
export const updateReport = async (report: SymptomReport): Promise<void> => {
  const db = await openDatabase();

  await db.runAsync(
    `UPDATE symptom_reports SET
      user_id = ?,
      reported_at = ?,
      bloating = ?,
      constipation = ?,
      pain = ?,
      stool_frequency = ?,
      stool_quality = ?,
      appetite = ?,
      stress_level = ?,
      water_cups = ?,
      meals_since_last_report = ?,
      physical_activity_since_last_report = ?,
      sleep_hours = ?,
      sleep_reported_today = ?,
      notes = ?,
      updated_at = ?
    WHERE id = ?`,
    [
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
      report.sleepReportedToday ? 1 : 0,
      report.notes ?? null,
      report.updatedAt.toISOString(),
      report.id, // ← WHERE id = ?
    ]
  );

  console.log("✅ Report updated:", report.id);
};

/**
 * מוחק דיווח לפי ID
 */
export const deleteReport = async (reportId: string): Promise<void> => {
  const db = await openDatabase();

  await db.runAsync(`DELETE FROM symptom_reports WHERE id = ?`, [reportId]);

  console.log("✅ Report deleted:", reportId);
};
