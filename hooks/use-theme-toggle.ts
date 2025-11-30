import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme as useRNColorScheme } from "react-native";
import { useEffect, useState } from "react";
import { Appearance } from "react-native";

const THEME_STORAGE_KEY = "@theme";

export function useThemeToggle() {
  const systemColorScheme = useRNColorScheme();
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((value) => {
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
    await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    Appearance.setColorScheme(newTheme);
  };

  const currentTheme = theme ?? systemColorScheme ?? "light";

  return {
    theme: currentTheme,
    toggleTheme,
    isDark: currentTheme === "dark",
  };
}

