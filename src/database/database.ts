import * as SQLite from "expo-sqlite";

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
