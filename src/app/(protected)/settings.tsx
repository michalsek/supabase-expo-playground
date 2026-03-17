import { StyleSheet, Text } from "react-native";
import { useAuth } from "../../auth/AuthProvider";
import { AccountCard } from "../../components/AccountCard";
import { navigationTheme } from "../../navigation/root-stack";
import { Card } from "../../ui/Card";
import { Screen } from "../../ui/Screen";
import { Spacer } from "../../ui/Spacer";

export default function SettingsScreen() {
  const { signOut, user } = useAuth();

  return (
    <Screen>
      <Card gap={10}>
        <Text style={styles.label}>User id</Text>
        <Text style={styles.value}>{user?.id ?? "Unavailable"}</Text>
      </Card>
      <Spacer.Vertical size={20} />
      <AccountCard
        email={user?.email}
        actions={[{ label: "Sign out", onPress: () => void signOut() }]}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: {
    color: navigationTheme.colors.muted,
    fontSize: 14,
    textTransform: "uppercase",
  },
  value: {
    color: navigationTheme.colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
});
