import { Pressable, StyleSheet, Text, View } from "react-native";

import { navigationTheme } from "../navigation/root-stack";

type AccountCardAction = {
  disabled?: boolean;
  label: string;
  onPress: () => void;
};

type AccountCardProps = {
  actions?: AccountCardAction[];
  email?: string | null;
};

export function AccountCard({ actions = [], email }: AccountCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.kicker}>Authenticated as</Text>
      <Text style={styles.accountValue}>{email ?? "Unknown email"}</Text>
      <View style={{ height: 12 }} />
      {actions.length > 0 ? (
        <View style={styles.actionRow}>
          {actions.map((action) => (
            <Pressable
              disabled={action.disabled}
              key={action.label}
              onPress={action.onPress}
              style={[
                secondaryActionStyle,
                action.disabled && styles.actionMuted,
              ]}
            >
              <Text style={styles.secondaryActionLabel}>{action.label}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  accountValue: {
    color: navigationTheme.colors.text,
    fontSize: 20,
    fontWeight: "700",
  },
  action: {
    alignItems: "center",
    borderRadius: 4,
    flex: 1,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  actionMuted: {
    opacity: 0.6,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  card: {
    backgroundColor: navigationTheme.colors.card,
    borderColor: navigationTheme.colors.border,
    borderWidth: 1,
    gap: 12,
    padding: 12,
  },
  kicker: {
    color: navigationTheme.colors.accent,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
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

const secondaryActionStyle = StyleSheet.flatten([
  styles.action,
  styles.secondaryAction,
]);
