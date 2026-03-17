import { Link, type Href } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useState } from "react";

import { navigationTheme } from "../navigation/root-stack";

type AuthFormProps = {
  alternateHref: Href;
  alternateLabel: string;
  alternatePrompt: string;
  errorMessage?: string | null;
  isSubmitting: boolean;
  onSubmit: (credentials: { email: string; password: string }) => Promise<void>;
  submitLabel: string;
  subtitle: string;
  successMessage?: string | null;
  title: string;
};

export function AuthForm({
  alternateHref,
  alternateLabel,
  alternatePrompt,
  errorMessage,
  isSubmitting,
  onSubmit,
  submitLabel,
  subtitle,
  successMessage,
  title,
}: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isDisabled =
    isSubmitting || email.trim().length === 0 || password.length === 0;

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={navigationTheme.colors.muted}
            style={styles.input}
            textContentType="emailAddress"
            value={email}
          />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            autoCapitalize="none"
            autoComplete="password"
            onChangeText={setPassword}
            placeholder="At least 6 characters"
            placeholderTextColor={navigationTheme.colors.muted}
            secureTextEntry
            style={styles.input}
            textContentType="password"
            value={password}
          />
        </View>
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        {successMessage ? (
          <Text style={styles.success}>{successMessage}</Text>
        ) : null}
        <Pressable
          disabled={isDisabled}
          onPress={() =>
            onSubmit({ email: email.trim().toLowerCase(), password })
          }
          style={[styles.primaryAction, isDisabled && styles.primaryActionMuted]}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#f7fffd" />
          ) : (
            <Text style={styles.primaryActionLabel}>{submitLabel}</Text>
          )}
        </Pressable>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>{alternatePrompt}</Text>
        <Link href={alternateHref} style={styles.footerLink}>
          {alternateLabel}
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: navigationTheme.colors.card,
    borderColor: navigationTheme.colors.border,
    borderRadius: 24,
    borderWidth: 1,
    gap: 16,
    padding: 20,
  },
  error: {
    color: "#b42318",
    fontSize: 14,
    lineHeight: 20,
  },
  fieldGroup: {
    gap: 8,
  },
  footer: {
    alignItems: "center",
    gap: 4,
  },
  footerLink: {
    color: navigationTheme.colors.accent,
    fontSize: 15,
    fontWeight: "700",
  },
  footerText: {
    color: navigationTheme.colors.muted,
    fontSize: 15,
  },
  header: {
    gap: 8,
  },
  input: {
    backgroundColor: "#fffaf1",
    borderColor: navigationTheme.colors.border,
    borderRadius: 16,
    borderWidth: 1,
    color: navigationTheme.colors.text,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  label: {
    color: navigationTheme.colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  primaryAction: {
    alignItems: "center",
    backgroundColor: navigationTheme.colors.accent,
    borderRadius: 18,
    minHeight: 52,
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  primaryActionLabel: {
    color: "#f7fffd",
    fontSize: 16,
    fontWeight: "700",
  },
  primaryActionMuted: {
    opacity: 0.6,
  },
  subtitle: {
    color: navigationTheme.colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  success: {
    color: "#0f766e",
    fontSize: 14,
    lineHeight: 20,
  },
  title: {
    color: navigationTheme.colors.text,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  wrapper: {
    gap: 16,
  },
});
