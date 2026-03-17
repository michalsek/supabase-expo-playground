import { StyleSheet, Text, View } from "react-native";

import { navigationTheme } from "../navigation/root-stack";
import { Screen } from "../ui/Screen";
import { LoadingView } from "./LoadingView";

type AuthGateProps = {
  description: string;
  title: string;
};

export function AuthGate({ description, title }: AuthGateProps) {
  return (
    <Screen edges={["top", "bottom", "left", "right"]}>
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <LoadingView message={description} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
  },
  title: {
    color: navigationTheme.colors.text,
    fontSize: 22,
    fontWeight: "800",
  },
});
