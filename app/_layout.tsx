import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { StatusBar } from "expo-status-bar";
import { SheetProvider } from "react-native-actions-sheet";
import "react-native-reanimated";

import { CustomDrawerContent } from "@/components/drawer/custom-drawer-content";
import { PersistGate } from "@/components/ui/persist-gate";
import { useColorScheme } from "@/hooks/use-color-scheme";
import "@/providers/i18n";
import { ONE_WEEK, queryClient } from "@/providers/query";
import "@/providers/sheet.register";
import { Drawer } from "expo-router/drawer";
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
              <Drawer drawerContent={() => <CustomDrawerContent />}>
                <Drawer.Screen
                  name="(tabs)"
                  options={{ headerShown: false }}
                />
              </Drawer>
            </SafeAreaProvider>
            <StatusBar style="auto" />
          </SheetProvider>
        </ThemeProvider>
      </PersistGate>
    </PersistQueryClientProvider>
  );
}
