import { Link, Redirect } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

import { useAuth } from "../auth/AuthProvider";
import { Screen } from "../ui/Screen";
import { Column } from "../ui/Column";
import { Spacer } from "../ui/Spacer";
import { navigationTheme } from "../navigation/root-stack";
import { routes } from "../navigation/routes";

export default function HomeScreen() {
  const { session } = useAuth();

  if (session) {
    return <Redirect href={routes.todos} />;
  }

  return (
    <Screen edges={["top", "bottom", "left", "right"]} scrollable={false}>
      <Column gap={10}>
        <Text style={styles.heroTitle}>Supabase Auth</Text>
      </Column>
      <Spacer.Vertical />
      <Column gap={12}>
        <Link asChild href={routes.signIn}>
          <Pressable style={primaryActionStyle}>
            <Text style={styles.primaryActionLabel}>Sign in</Text>
          </Pressable>
        </Link>
        <Link asChild href={routes.signUp}>
          <Pressable style={secondaryActionStyle}>
            <Text style={styles.secondaryActionLabel}>Sign up</Text>
          </Pressable>
        </Link>
      </Column>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroTitle: {
    color: navigationTheme.colors.text,
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  action: {
    alignItems: "center",
    borderRadius: 4,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  primaryAction: {
    backgroundColor: navigationTheme.colors.accent,
  },
  primaryActionLabel: {
    color: "#f7fffd",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryAction: {
    borderColor: navigationTheme.colors.border,
    borderWidth: 1,
  },
  secondaryActionLabel: {
    color: navigationTheme.colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
});

const primaryActionStyle = StyleSheet.flatten([
  styles.action,
  styles.primaryAction,
]);

const secondaryActionStyle = StyleSheet.flatten([
  styles.action,
  styles.secondaryAction,
]);
