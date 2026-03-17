import { StyleSheet, Text } from "react-native";

import { navigationTheme } from "../../navigation/root-stack";
import { Column } from "../../ui/Column";

type EmptyListProps = {
  message?: string;
  title?: string;
};

export function EmptyList({
  message = "Create your first todo and it will appear here immediately.",
  title = "No todos yet",
}: EmptyListProps) {
  return (
    <Column align="center" gap={12} style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </Column>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 24,
    paddingTop: 120,
    flex: 1,
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
