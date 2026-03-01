import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "@/constants/storage";
import { useEffect, useState } from "react";
import { Appearance, useColorScheme as useRNColorScheme } from "react-native";

export function useThemeToggle() {
  const systemColorScheme = useRNColorScheme();
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.THEME).then((value) => {
      if (value === "light" || value === "dark") {
        setTheme(value);
        Appearance.setColorScheme(value);
      } else {
        setTheme(systemColorScheme ?? "light");
      }
    });
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    await AsyncStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    Appearance.setColorScheme(newTheme);
  };

  const currentTheme = theme ?? systemColorScheme ?? "light";

  return {
    theme: currentTheme,
    toggleTheme,
    isDark: currentTheme === "dark",
  };
}
