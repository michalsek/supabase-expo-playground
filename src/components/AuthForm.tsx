import { Link, type Href } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { useState } from "react";

import { navigationTheme } from "../navigation/root-stack";
import { Card } from "../ui/Card";
import { Column } from "../ui/Column";

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
    <Column gap={16}>
      <Card gap={16} padding={20} style={styles.card}>
        <Column gap={8}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </Column>
        <Column gap={8}>
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
        </Column>
        <Column gap={8}>
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
        </Column>
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
      </Card>
      <Column align="center" gap={4}>
        <Text style={styles.footerText}>{alternatePrompt}</Text>
        <Link href={alternateHref} style={styles.footerLink}>
          {alternateLabel}
        </Link>
      </Column>
    </Column>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
  },
  error: {
    color: "#b42318",
    fontSize: 14,
    lineHeight: 20,
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
});
