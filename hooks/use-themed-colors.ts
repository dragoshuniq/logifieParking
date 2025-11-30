import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type ColorKey = keyof typeof Colors.light & keyof typeof Colors.dark;

type ColorMap<T extends ColorKey[]> = {
  [K in T[number]]: (typeof Colors)["light"][K];
};

export function useThemedColors<T extends ColorKey[]>(
  ...colorNames: T
): ColorMap<T> {
  const colorScheme = useColorScheme() ?? "light";
  return colorNames.reduce((acc, name) => {
    return {
      ...acc,
      [name]: Colors[colorScheme][name],
    };
  }, {} as ColorMap<T>);
}
