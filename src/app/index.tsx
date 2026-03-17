import { Link } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

import { Screen } from "../components/Screen";
import { navigationTheme } from "../navigation/root-stack";
import { routes } from "../navigation/routes";

import "../supabase/client";

const previews = [
  {
    href: routes.todoDetails("42"),
    kicker: "Existing item",
    title: "Open todo #42",
    description:
      "Use the dynamic route with a concrete id to render a detail screen.",
  },
  {
    href: routes.todoNew,
    kicker: "Creation flow",
    title: "Create a new todo",
    description:
      "Open the modal-style screen that can later host your todo form.",
  },
] as const;

export default function HomeScreen() {
  return (
    <Screen edges={["top", "bottom", "left", "right"]}>
      {previews.map((preview) => (
        <Link asChild href={preview.href} key={preview.title}>
          <Pressable style={styles.card}>
            <Text style={styles.kicker}>{preview.kicker}</Text>
            <Text style={styles.cardTitle}>{preview.title}</Text>
            <Text style={styles.cardDescription}>{preview.description}</Text>
          </Pressable>
        </Link>
      ))}
      <Link asChild href={routes.todoNew}>
        <Pressable style={primaryActionStyle}>
          <Text style={styles.primaryActionLabel}>Add a todo</Text>
        </Pressable>
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  action: {
    alignItems: "center",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  card: {
    backgroundColor: navigationTheme.colors.card,
    borderColor: navigationTheme.colors.border,
    borderRadius: 24,
    borderWidth: 1,
    gap: 8,
    padding: 20,
  },
  cardDescription: {
    color: navigationTheme.colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  cardTitle: {
    color: navigationTheme.colors.text,
    fontSize: 22,
    fontWeight: "700",
  },
  kicker: {
    color: navigationTheme.colors.accent,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  primaryAction: {
    backgroundColor: navigationTheme.colors.accent,
  },
  primaryActionLabel: {
    color: "#f7fffd",
    fontSize: 16,
    fontWeight: "700",
  },
});

const primaryActionStyle = StyleSheet.flatten([
  styles.action,
  styles.primaryAction,
]);
