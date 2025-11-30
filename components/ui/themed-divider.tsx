import { StyleSheet, View, type ViewProps } from "react-native";
import { useThemeColor } from "@/hooks/use-theme-color";

export type ThemedDividerProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  orientation?: "horizontal" | "vertical";
  thickness?: number;
};

export function ThemedDivider({
  style,
  lightColor,
  darkColor,
  orientation = "horizontal",
  thickness = 1,
  ...rest
}: ThemedDividerProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "default"
  );

  return (
    <View
      style={[
        styles.divider,
        {
          backgroundColor,
          ...(orientation === "horizontal"
            ? { height: thickness, width: "100%" }
            : { width: thickness, height: "100%" }),
        },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  divider: {
    opacity: 0.2,
  },
});

