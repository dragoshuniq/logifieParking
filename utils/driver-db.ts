import * as SQLite from "expo-sqlite";

export type ActivityType = "driving" | "work" | "break" | "rest";

export interface Activity {
  id?: number;
  date: string;
  startTime?: string;
  endTime?: string;
  duration: number;
  type: ActivityType;
  createdAt?: string;
  updatedAt?: string;
}

let db: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async () => {
  if (db) return db;

  db = await SQLite.openDatabaseAsync("driver_hours.db");

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      startTime TEXT,
      endTime TEXT,
      duration REAL NOT NULL,
      type TEXT NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(date);
    CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(type);
  `);

  return db;
};

export const addActivity = async (
  activity: Activity
): Promise<number> => {
  const database = await initDatabase();
  const result = await database.runAsync(
    "INSERT INTO activities (date, startTime, endTime, duration, type) VALUES (?, ?, ?, ?, ?)",
    activity.date,
    activity.startTime || null,
    activity.endTime || null,
    activity.duration,
    activity.type
  );
  return result.lastInsertRowId;
};

export const updateActivity = async (
  activity: Activity
): Promise<void> => {
  const database = await initDatabase();
  await database.runAsync(
    "UPDATE activities SET date = ?, startTime = ?, endTime = ?, duration = ?, type = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
    activity.date,
    activity.startTime || null,
    activity.endTime || null,
    activity.duration,
    activity.type,
    activity.id!
  );
};

export const deleteActivity = async (id: number): Promise<void> => {
  const database = await initDatabase();
  await database.runAsync("DELETE FROM activities WHERE id = ?", id);
};

export const getActivitiesByDate = async (
  date: string
): Promise<Activity[]> => {
  const database = await initDatabase();
  const result = await database.getAllAsync<Activity>(
    "SELECT * FROM activities WHERE date = ? ORDER BY startTime, createdAt",
    date
  );
  return result;
};

export const getActivitiesByDateRange = async (
  startDate: string,
  endDate: string
): Promise<Activity[]> => {
  const database = await initDatabase();
  const result = await database.getAllAsync<Activity>(
    "SELECT * FROM activities WHERE date BETWEEN ? AND ? ORDER BY date, startTime, createdAt",
    startDate,
    endDate
  );
  return result;
};

export const getAllActivities = async (): Promise<Activity[]> => {
  const database = await initDatabase();
  const result = await database.getAllAsync<Activity>(
    "SELECT * FROM activities ORDER BY date DESC, startTime DESC, createdAt DESC"
  );
  return result;
};
