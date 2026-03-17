import type { PropsWithChildren } from "react";
import type { Edge } from "react-native-safe-area-context";

export type ScreenProps = PropsWithChildren<{
  edges?: Edge[];
  title?: string;
  subtitle?: string;
  scrollable?: boolean;
  disablePadding?: boolean;
}>;
