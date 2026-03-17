import { StyleSheet, View } from "react-native";
import type { ViewStyle } from "react-native";

import type { RowProps } from "./types";

export default function Row({
  align,
  children,
  gap,
  justify,
  style,
  wrap,
  ...props
}: RowProps) {
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

  if (wrap !== undefined) {
    layoutStyle.flexWrap = wrap;
  }

  return (
    <View {...props} style={[styles.row, layoutStyle, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
});
