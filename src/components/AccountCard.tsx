import { Pressable, StyleSheet, Text } from "react-native";

import { navigationTheme } from "../navigation/root-stack";
import { Card } from "../ui/Card";
import { Row } from "../ui/Row";
import { Spacer } from "../ui/Spacer";

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
    <Card>
      <Text style={styles.kicker}>Authenticated as</Text>
      <Text style={styles.accountValue}>{email ?? "Unknown email"}</Text>
      <Spacer.Vertical size={12} />
      {actions.length > 0 ? (
        <Row gap={12}>
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
        </Row>
      ) : null}
    </Card>
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
