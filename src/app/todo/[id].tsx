import { Link, useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Screen } from "../../components/Screen";
import { navigationTheme } from "../../navigation/root-stack";

export default function TodoDetailsScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  return (
    <Screen
      title={`Todo ${id ?? "unknown"}`}
      subtitle="This dynamic route reads the id parameter from Expo Router and is ready for data loading once you connect your store or backend."
    >
      <View style={styles.card}>
        <Text style={styles.label}>Route parameter</Text>
        <Text style={styles.value}>{id ?? "missing"}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: navigationTheme.colors.card,
    borderColor: navigationTheme.colors.border,
    borderRadius: 24,
    borderWidth: 1,
    gap: 10,
    padding: 20,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
  },
  label: {
    color: navigationTheme.colors.muted,
    fontSize: 14,
    textTransform: "uppercase",
  },
  primaryAction: {
    alignItems: "center",
    backgroundColor: navigationTheme.colors.accent,
    borderRadius: 18,
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  primaryActionLabel: {
    color: "#f7fffd",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryAction: {
    alignItems: "center",
    borderColor: navigationTheme.colors.border,
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  secondaryActionLabel: {
    color: navigationTheme.colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  value: {
    color: navigationTheme.colors.text,
    fontSize: 28,
    fontWeight: "800",
  },
});
