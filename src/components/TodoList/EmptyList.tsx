import { StyleSheet, Text, View } from "react-native";

import { navigationTheme } from "../../navigation/root-stack";

type EmptyListProps = {
  message?: string;
  title?: string;
};

export function EmptyList({
  message = "Create your first todo and it will appear here immediately.",
  title = "No todos yet",
}: EmptyListProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    gap: 12,
    padding: 24,
    flex: 1,
    paddingTop: 120,
  },
  message: {
    color: navigationTheme.colors.muted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  title: {
    color: navigationTheme.colors.text,
    fontSize: 20,
    fontWeight: "700",
  },
});
