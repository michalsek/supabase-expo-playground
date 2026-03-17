import type { JSX } from "react";
import type { ViewProps } from "react-native";

export type SpacerAxis = "horizontal" | "vertical";

export type SpacerProps = ViewProps & {
  axis?: SpacerAxis;
  size?: number;
};

export type SpacerDirectionalProps = Omit<SpacerProps, "axis">;

export type SpacerComponent = ((props: SpacerProps) => JSX.Element) & {
  Horizontal: (props: SpacerDirectionalProps) => JSX.Element;
  Vertical: (props: SpacerDirectionalProps) => JSX.Element;
};
