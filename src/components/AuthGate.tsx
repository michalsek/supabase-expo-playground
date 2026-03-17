import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { Screen } from "./Screen";
import { navigationTheme } from "../navigation/root-stack";

type AuthGateProps = {
  description: string;
  title: string;
};

export function AuthGate({ description, title }: AuthGateProps) {
  return (
    <Screen edges={["top", "bottom", "left", "right"]}>
      <View style={styles.card}>
        <ActivityIndicator color={navigationTheme.colors.accent} size="large" />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: navigationTheme.colors.card,
    borderColor: navigationTheme.colors.border,
    borderRadius: 24,
    borderWidth: 1,
    gap: 12,
    padding: 24,
  },
  description: {
    color: navigationTheme.colors.muted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  title: {
    color: navigationTheme.colors.text,
    fontSize: 22,
    fontWeight: "800",
  },
});
