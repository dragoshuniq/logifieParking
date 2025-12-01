import dayjs from "dayjs";
import * as SQLite from "expo-sqlite";

export type ActivityType = "driving" | "work" | "break" | "rest";

export interface Activity {
  id?: number;
  startDateTime: number;
  endDateTime: number;
  duration: number;
  type: ActivityType;
  createdAt?: number;
  updatedAt?: number;
}

let db: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async () => {
  if (db) return db;

  db = await SQLite.openDatabaseAsync("driver_hours.db");

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      startDateTime INTEGER NOT NULL,
      endDateTime INTEGER NOT NULL,
      duration REAL NOT NULL,
      type TEXT NOT NULL,
      createdAt INTEGER DEFAULT (strftime('%s', 'now') * 1000),
      updatedAt INTEGER DEFAULT (strftime('%s', 'now') * 1000)
    );
    
    CREATE INDEX IF NOT EXISTS idx_activities_start ON activities(startDateTime);
    CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(type);
  `);

  return db;
};

export const addActivity = async (
  activity: Activity
): Promise<number> => {
  const database = await initDatabase();
  const now = Date.now();
  const result = await database.runAsync(
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
  activity: Activity
): Promise<void> => {
  const database = await initDatabase();
  const now = Date.now();
  await database.runAsync(
    "UPDATE activities SET startDateTime = ?, endDateTime = ?, duration = ?, type = ?, updatedAt = ? WHERE id = ?",
    activity.startDateTime,
    activity.endDateTime,
    activity.duration,
    activity.type,
    now,
    activity.id!
  );
};

export const deleteActivity = async (id: number): Promise<void> => {
  const database = await initDatabase();
  await database.runAsync("DELETE FROM activities WHERE id = ?", id);
};

export const getActivitiesByDate = async (
  date: Date
): Promise<Activity[]> => {
  const database = await initDatabase();
  const startOfDay = dayjs(date).startOf("day").valueOf();
  const endOfDay = dayjs(date).endOf("day").valueOf();
  
  const result = await database.getAllAsync<Activity>(
    "SELECT * FROM activities WHERE startDateTime >= ? AND startDateTime <= ? ORDER BY startDateTime",
    startOfDay,
    endOfDay
  );
  return result;
};

export const getActivitiesByDateRange = async (
  startDate: Date,
  endDate: Date
): Promise<Activity[]> => {
  const database = await initDatabase();
  const start = dayjs(startDate).startOf("day").valueOf();
  const end = dayjs(endDate).endOf("day").valueOf();
  
  const result = await database.getAllAsync<Activity>(
    "SELECT * FROM activities WHERE startDateTime >= ? AND startDateTime <= ? ORDER BY startDateTime",
    start,
    end
  );
  return result;
};

export const getAllActivities = async (): Promise<Activity[]> => {
  const database = await initDatabase();
  const result = await database.getAllAsync<Activity>(
    "SELECT * FROM activities ORDER BY startDateTime DESC"
  );
  return result;
};
