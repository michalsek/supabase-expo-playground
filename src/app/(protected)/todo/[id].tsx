import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { Screen } from "../../../components/Screen";
import { navigationTheme } from "../../../navigation/root-stack";

export default function TodoDetailsScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  return (
    <Screen
      title={`Todo ${id ?? "unknown"}`}
      subtitle="This dynamic route is protected by auth and still reads the id from Expo Router."
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
  label: {
    color: navigationTheme.colors.muted,
    fontSize: 14,
    textTransform: "uppercase",
  },
  value: {
    color: navigationTheme.colors.text,
    fontSize: 28,
    fontWeight: "800",
  },
});
