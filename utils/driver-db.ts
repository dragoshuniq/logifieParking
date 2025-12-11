import dayjs from "@/utils/dayjs-config";
import * as SQLite from "expo-sqlite";

export enum ActivityType {
  DRIVING = "DRIVING",
  OTHER_WORK = "OTHER_WORK",
  BREAK = "BREAK",
  REST = "REST",
  AVAILABILITY = "AVAILABILITY",
}

export interface Activity {
  id?: number;
  startDateTime: number;
  endDateTime: number;
  duration: number;
  type: ActivityType;
  createdAt?: number;
  updatedAt?: number;
}

export interface WeeklyRestDeficit {
  id?: number;
  weekStart: number;
  weekEnd: number;
  deficitHours: number;
  compensatedHours: number;
  mustCompensateBy: number;
  createdAt?: number;
  updatedAt?: number;
}

/**
 * Initialize database schema
 * Call this once when the app starts or use SQLiteProvider's onInit
 */
export const initializeSchema = async (db: SQLite.SQLiteDatabase) => {
  // Enable WAL mode for better performance and concurrency
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    
    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      startDateTime INTEGER NOT NULL,
      endDateTime INTEGER NOT NULL,
      duration REAL NOT NULL,
      type TEXT NOT NULL,
      createdAt INTEGER DEFAULT (strftime('%s', 'now') * 1000),
      updatedAt INTEGER DEFAULT (strftime('%s', 'now') * 1000)
    );
    
    CREATE TABLE IF NOT EXISTS weekly_rest_deficits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      weekStart INTEGER NOT NULL,
      weekEnd INTEGER NOT NULL,
      deficitHours REAL NOT NULL,
      compensatedHours REAL DEFAULT 0,
      mustCompensateBy INTEGER NOT NULL,
      createdAt INTEGER DEFAULT (strftime('%s', 'now') * 1000),
      updatedAt INTEGER DEFAULT (strftime('%s', 'now') * 1000)
    );
    
    CREATE INDEX IF NOT EXISTS idx_activities_start ON activities(startDateTime);
    CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(type);
    CREATE INDEX IF NOT EXISTS idx_deficits_week ON weekly_rest_deficits(weekStart);
  `);
};

export const addActivity = async (
  db: SQLite.SQLiteDatabase,
  activity: Activity
): Promise<number> => {
  const now = Date.now();
  const result = await db.runAsync(
    "INSERT INTO activities (startDateTime, endDateTime, duration, type, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
    activity.startDateTime,
    activity.endDateTime,
    activity.duration,
    activity.type,
    now,
    now
  );
  return result.lastInsertRowId;
};

export const updateActivity = async (
  db: SQLite.SQLiteDatabase,
  activity: Activity
): Promise<void> => {
  const now = Date.now();
  await db.runAsync(
    "UPDATE activities SET startDateTime = ?, endDateTime = ?, duration = ?, type = ?, updatedAt = ? WHERE id = ?",
    activity.startDateTime,
    activity.endDateTime,
    activity.duration,
    activity.type,
    now,
    activity.id!
  );
};

export const deleteActivity = async (
  db: SQLite.SQLiteDatabase,
  id: number
): Promise<void> => {
  await db.runAsync("DELETE FROM activities WHERE id = ?", id);
};

export const getActivitiesByDate = async (
  db: SQLite.SQLiteDatabase,
  date: Date
): Promise<Activity[]> => {
  const startOfDay = dayjs(date).startOf("day").valueOf();
  const endOfDay = dayjs(date).endOf("day").valueOf();

  const result = await db.getAllAsync<Activity>(
    "SELECT * FROM activities WHERE startDateTime >= ? AND startDateTime <= ? ORDER BY startDateTime",
    startOfDay,
    endOfDay
  );
  return result;
};

export const getActivitiesByDateRange = async (
  db: SQLite.SQLiteDatabase,
  startDate: Date,
  endDate: Date
): Promise<Activity[]> => {
  const start = dayjs(startDate).startOf("day").valueOf();
  const end = dayjs(endDate).endOf("day").valueOf();

  const result = await db.getAllAsync<Activity>(
    "SELECT * FROM activities WHERE startDateTime >= ? AND startDateTime <= ? ORDER BY startDateTime",
    start,
    end
  );
  return result;
};

export const getAllActivities = async (
  db: SQLite.SQLiteDatabase
): Promise<Activity[]> => {
  const result = await db.getAllAsync<Activity>(
    "SELECT * FROM activities ORDER BY startDateTime DESC"
  );
  return result;
};

export const addWeeklyRestDeficit = async (
  db: SQLite.SQLiteDatabase,
  deficit: WeeklyRestDeficit
): Promise<number> => {
  const now = Date.now();
  const result = await db.runAsync(
    "INSERT INTO weekly_rest_deficits (weekStart, weekEnd, deficitHours, compensatedHours, mustCompensateBy, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
    deficit.weekStart,
    deficit.weekEnd,
    deficit.deficitHours,
    deficit.compensatedHours || 0,
    deficit.mustCompensateBy,
    now,
    now
  );
  return result.lastInsertRowId;
};

export const updateWeeklyRestDeficit = async (
  db: SQLite.SQLiteDatabase,
  deficit: WeeklyRestDeficit
): Promise<void> => {
  const now = Date.now();
  await db.runAsync(
    "UPDATE weekly_rest_deficits SET compensatedHours = ?, updatedAt = ? WHERE id = ?",
    deficit.compensatedHours,
    now,
    deficit.id!
  );
};

export const getWeeklyRestDeficits = async (
  db: SQLite.SQLiteDatabase
): Promise<WeeklyRestDeficit[]> => {
  const result = await db.getAllAsync<WeeklyRestDeficit>(
    "SELECT * FROM weekly_rest_deficits WHERE compensatedHours < deficitHours ORDER BY mustCompensateBy ASC"
  );
  return result;
};

export const getWeeklyRestDeficitsByDateRange = async (
  db: SQLite.SQLiteDatabase,
  startDate: Date,
  endDate: Date
): Promise<WeeklyRestDeficit[]> => {
  const start = dayjs(startDate).valueOf();
  const end = dayjs(endDate).valueOf();
  const result = await db.getAllAsync<WeeklyRestDeficit>(
    "SELECT * FROM weekly_rest_deficits WHERE weekStart >= ? AND weekEnd <= ? ORDER BY weekStart",
    start,
    end
  );
  return result;
};
