import { StyleSheet, Text } from "react-native";

import { navigationTheme } from "../navigation/root-stack";
import { Column } from "../ui/Column";
import { Screen } from "../ui/Screen";
import { LoadingView } from "./LoadingView";

type AuthGateProps = {
  description: string;
  title: string;
};

export function AuthGate({ description, title }: AuthGateProps) {
  return (
    <Screen edges={["top", "bottom", "left", "right"]}>
      <Column gap={12}>
        <Text style={styles.title}>{title}</Text>
        <LoadingView message={description} />
      </Column>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: navigationTheme.colors.text,
    fontSize: 22,
    fontWeight: "800",
  },
});
