import type { PropsWithChildren } from "react";
import type { ViewProps, ViewStyle } from "react-native";

export type RowProps = PropsWithChildren<
  ViewProps & {
    align?: ViewStyle["alignItems"];
    gap?: number;
    justify?: ViewStyle["justifyContent"];
    wrap?: ViewStyle["flexWrap"];
  }
>;
