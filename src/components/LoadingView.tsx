import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { navigationTheme } from "../navigation/root-stack";

type LoadingViewProps = {
  message: string;
};

export function LoadingView({ message }: LoadingViewProps) {
  return (
    <View style={styles.card}>
      <ActivityIndicator color={navigationTheme.colors.accent} size="large" />
      <Text style={styles.message}>{message}</Text>
    </View>
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
    padding: 20,
  },
  message: {
    color: navigationTheme.colors.muted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
});
