import type { PropsWithChildren, ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";

import { navigationTheme } from "../navigation/root-stack";

type ScreenProps = PropsWithChildren<{
  edges?: Edge[];
  title: string;
  subtitle?: string;
  footer?: ReactNode;
}>;

export function Screen({
  children,
  edges = ["bottom", "left", "right"],
  footer,
  subtitle,
  title,
}: ScreenProps) {
  return (
    <SafeAreaView edges={edges} style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <View style={styles.body}>{children}</View>
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: 16,
  },
  content: {
    gap: 24,
    padding: 24,
    paddingBottom: 40,
  },
  footer: {
    gap: 12,
  },
  header: {
    gap: 8,
  },
  screen: {
    backgroundColor: navigationTheme.colors.background,
    flex: 1,
  },
  subtitle: {
    color: navigationTheme.colors.muted,
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    color: navigationTheme.colors.text,
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
});
