import { StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../auth/AuthProvider";
import { AccountCard } from "../../components/AccountCard";
import { Screen } from "../../components/Screen";
import { navigationTheme } from "../../navigation/root-stack";

export default function SettingsScreen() {
  const { signOut, user } = useAuth();

  return (
    <Screen>
      <View style={styles.card}>
        <Text style={styles.label}>User id</Text>
        <Text style={styles.value}>{user?.id ?? "Unavailable"}</Text>
      </View>
      <View style={{ height: 20 }} />
      <AccountCard
        email={user?.email}
        actions={[{ label: "Sign out", onPress: () => void signOut() }]}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: navigationTheme.colors.card,
    borderColor: navigationTheme.colors.border,
    borderWidth: 1,
    gap: 10,
    padding: 12,
  },
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
