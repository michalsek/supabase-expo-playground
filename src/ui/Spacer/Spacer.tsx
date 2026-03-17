import { View } from "react-native";
import type { ViewStyle } from "react-native";

import type {
  SpacerComponent,
  SpacerDirectionalProps,
  SpacerProps,
} from "./types";

function BaseSpacer({
  axis = "vertical",
  size,
  style,
  ...props
}: SpacerProps) {
  const spacerStyle: ViewStyle =
    size === undefined
      ? { flex: 1 }
      : axis === "horizontal"
        ? { flexShrink: 0, width: size }
        : { flexShrink: 0, height: size };

  return <View {...props} style={[spacerStyle, style]} />;
}

function HorizontalSpacer(props: SpacerDirectionalProps) {
  return <BaseSpacer axis="horizontal" {...props} />;
}

function VerticalSpacer(props: SpacerDirectionalProps) {
  return <BaseSpacer axis="vertical" {...props} />;
}

const Spacer = Object.assign(BaseSpacer, {
  Horizontal: HorizontalSpacer,
  Vertical: VerticalSpacer,
}) as SpacerComponent;

export default Spacer;
