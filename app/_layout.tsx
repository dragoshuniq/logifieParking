import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SheetProvider } from "react-native-actions-sheet";
import "react-native-reanimated";

import { PersistGate } from "@/components/ui/persist-gate";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ONE_WEEK, queryClient } from "@/providers/query";
import "@/providers/sheet.register";
import { SafeAreaProvider } from "react-native-safe-area-context";

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: asyncStoragePersister,
        maxAge: ONE_WEEK,
      }}
    >
      <PersistGate>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <SheetProvider>
            <SafeAreaProvider>
              <Stack>
                <Stack.Screen
                  name="(tabs)"
                  options={{ headerShown: false }}
                />
              </Stack>
            </SafeAreaProvider>
            <StatusBar style="auto" />
          </SheetProvider>
        </ThemeProvider>
      </PersistGate>
    </PersistQueryClientProvider>
  );
}
