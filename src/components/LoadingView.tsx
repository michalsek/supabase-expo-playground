import { ActivityIndicator, StyleSheet, Text } from "react-native";

import { navigationTheme } from "../navigation/root-stack";
import { Card } from "../ui/Card";

type LoadingViewProps = {
  message: string;
};

export function LoadingView({ message }: LoadingViewProps) {
  return (
    <Card padding={20} style={styles.card}>
      <ActivityIndicator color={navigationTheme.colors.accent} size="large" />
      <Text style={styles.message}>{message}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    borderRadius: 24,
  },
  message: {
    color: navigationTheme.colors.muted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
});
