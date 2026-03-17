import { StyleSheet, View } from "react-native";
import type { ViewStyle } from "react-native";

import { navigationTheme } from "../../navigation/root-stack";
import type { CardProps } from "./types";

export default function Card({
  children,
  gap,
  padding,
  style,
  ...props
}: CardProps) {
  const spacingStyle: ViewStyle = {};

  if (gap !== undefined) {
    spacingStyle.gap = gap;
  }

  if (padding !== undefined) {
    spacingStyle.padding = padding;
  }

  return (
    <View {...props} style={[styles.card, spacingStyle, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: navigationTheme.colors.card,
    borderColor: navigationTheme.colors.border,
    borderWidth: 1,
    gap: 12,
    padding: 12,
  },
});
