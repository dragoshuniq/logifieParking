import { SQLiteProvider } from "expo-sqlite";
import { ReactNode } from "react";

export const DATABASE_NAME = "driver_hours.db";

type Props = {
  children: ReactNode;
};

export function DriverDatabaseProvider({ children }: Props) {
  return (
    <SQLiteProvider databaseName={DATABASE_NAME} useSuspense>
      {children}
    </SQLiteProvider>
  );
}
