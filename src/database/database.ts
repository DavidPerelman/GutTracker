import * as SQLite from "expo-sqlite";

const DATABASE_NAME = "guttracker.db";

export const openDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  return db;
};
