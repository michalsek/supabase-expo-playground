import { Link, Redirect } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAuth } from "../auth/AuthProvider";
import { Screen } from "../components/Screen";
import { navigationTheme } from "../navigation/root-stack";
import { routes } from "../navigation/routes";

export default function HomeScreen() {
  const { session } = useAuth();

  if (session) {
    return <Redirect href={routes.todos} />;
  }

  return (
    <Screen edges={["top", "bottom", "left", "right"]} scrollable={false}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Supabase Auth</Text>
      </View>
      <View style={styles.spacer} />
      <View style={styles.actions}>
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
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: 10,
  },
  heroTitle: {
    color: navigationTheme.colors.text,
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  spacer: {
    flex: 1,
  },
  action: {
    alignItems: "center",
    borderRadius: 4,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  actions: {
    gap: 12,
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
