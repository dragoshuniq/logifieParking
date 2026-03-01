import { initializeSchema } from "@/utils/driver-db";
import * as SQLite from "expo-sqlite";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export const DATABASE_NAME = "driver_hours.db";

const DatabaseContext = createContext<SQLite.SQLiteDatabase | null>(null);

type Props = {
  children: ReactNode;
};

export function DriverDatabaseProvider({ children }: Props) {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  useEffect(() => {
    let mounted = true;

    async function setupDatabase() {
      const database = await SQLite.openDatabaseAsync(DATABASE_NAME);
      await initializeSchema(database);

      if (mounted) {
        setDb(database);
      }
    }

    setupDatabase();

    return () => {
      mounted = false;
    };
  }, []);

  if (!db) {
    return null; // or a loading component
  }

  return (
    <DatabaseContext.Provider value={db}>{children}</DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const db = useContext(DatabaseContext);
  if (!db) {
    throw new Error("useDatabase must be used within DriverDatabaseProvider");
  }
  return db;
}
