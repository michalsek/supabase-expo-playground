import { StyleSheet, View } from "react-native";
import type { ViewStyle } from "react-native";

import type { ColumnProps } from "./types";

export default function Column({
  align,
  children,
  gap,
  justify,
  style,
  ...props
}: ColumnProps) {
  const layoutStyle: ViewStyle = {};

  if (align !== undefined) {
    layoutStyle.alignItems = align;
  }

  if (gap !== undefined) {
    layoutStyle.gap = gap;
  }

  if (justify !== undefined) {
    layoutStyle.justifyContent = justify;
  }

  return (
    <View {...props} style={[styles.column, layoutStyle, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    flexDirection: "column",
  },
});
