import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

  return (
    <SafeAreaView edges={edges} style={styles.screen}>
      {scrollable ? (
        <ScrollView
          contentContainerStyle={contentStyle}
          showsVerticalScrollIndicator={false}
        >
          {header}
          <View style={styles.body}>{children}</View>
        </ScrollView>
      ) : (
        <View style={contentStyle}>
          {header}
          <View style={styles.body}>{children}</View>
        </View>
      )}
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
    paddingBottom: 40,
  },
  contentWithoutPadding: {
    flex: 1,
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
