import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useMemo } from "react";
import { navigationTheme } from "../../navigation/root-stack";
import type { ScreenProps } from "./types";

export default function Screen({
  children,
  edges = ["bottom", "left", "right"],
  subtitle,
  title,
  scrollable = true,
  disablePadding = false,
}: ScreenProps) {
  const header =
    title || subtitle ? (
      <View style={styles.header}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    ) : null;

  const contentStyle = disablePadding
    ? styles.contentWithoutPadding
    : styles.content;

  const content = useMemo(() => {
    if (scrollable) {
      return (
        <ScrollView
          style={contentStyle}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {header}
          <View style={styles.body}>{children}</View>
        </ScrollView>
      );
    }

    return (
      <View style={contentStyle}>
        {header}
        <View style={styles.body}>{children}</View>
      </View>
    );
  }, [scrollable, contentStyle, header, children]);

  return (
    <SafeAreaView edges={edges} style={styles.screen}>
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  contentWithoutPadding: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
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
