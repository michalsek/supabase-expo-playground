import type { PropsWithChildren } from "react";
import type { ViewProps, ViewStyle } from "react-native";

export type ColumnProps = PropsWithChildren<
  ViewProps & {
    align?: ViewStyle["alignItems"];
    gap?: number;
    justify?: ViewStyle["justifyContent"];
  }
>;
