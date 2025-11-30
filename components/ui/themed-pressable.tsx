import { Pressable, type PressableProps } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";

export type ThemedPressableProps = PressableProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedPressable({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedPressableProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return (
    <Pressable
      style={(state) => [
        { backgroundColor },
        typeof style === "function" ? style(state) : style,
      ]}
      {...otherProps}
    />
  );
}
