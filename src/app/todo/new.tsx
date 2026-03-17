import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Screen } from "../../components/Screen";
import { navigationTheme } from "../../navigation/root-stack";

const draftChecklist = [
  "title",
  "description",
  "priority",
  "due date",
] as const;

export default function NewTodoScreen() {
  return (
    <Screen
      title="Create a todo"
      subtitle="This screen is wired as the initial placeholder for your creation flow. Replace the checklist with a real form when you're ready."
    >
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Suggested fields</Text>
        {draftChecklist.map((item) => (
          <View key={item} style={styles.row}>
            <View style={styles.bullet} />
            <Text style={styles.rowLabel}>{item}</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  action: {
    alignItems: "center",
    backgroundColor: navigationTheme.colors.text,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  actionLabel: {
    color: navigationTheme.colors.card,
    fontSize: 16,
    fontWeight: "700",
  },
  bullet: {
    backgroundColor: navigationTheme.colors.accent,
    borderRadius: 99,
    height: 8,
    width: 8,
  },
  card: {
    backgroundColor: navigationTheme.colors.card,
    borderColor: navigationTheme.colors.border,
    borderRadius: 24,
    borderWidth: 1,
    gap: 14,
    padding: 20,
  },
  cardTitle: {
    color: navigationTheme.colors.text,
    fontSize: 20,
    fontWeight: "700",
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  rowLabel: {
    color: navigationTheme.colors.text,
    fontSize: 16,
  },
});
