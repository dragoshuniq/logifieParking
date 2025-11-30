import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type ColorKey = keyof typeof Colors.light & keyof typeof Colors.dark;

export function useThemedColors<T extends ColorKey>(
  ...colorNames: T[]
) {
  const colorScheme = useColorScheme() ?? "light";
  return colorNames.reduce((acc, name) => {
    return {
      ...acc,
      [name]: Colors[colorScheme][name],
    };
  }, {} as Record<T, (typeof Colors)[typeof colorScheme][T]>);
}
