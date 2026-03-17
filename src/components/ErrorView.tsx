import { Pressable, StyleSheet, Text, View } from "react-native";

import { navigationTheme } from "../navigation/root-stack";

type ErrorViewProps = {
  actionLabel?: string;
  message: string;
  onAction?: () => void;
  title: string;
};

export function ErrorView({
  actionLabel,
  message,
  onAction,
  title,
}: ErrorViewProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} style={styles.action}>
          <Text style={styles.actionLabel}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  action: {
    alignItems: "center",
    borderColor: navigationTheme.colors.border,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  actionLabel: {
    color: navigationTheme.colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
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
    color: "#b42318",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  title: {
    color: navigationTheme.colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
});
