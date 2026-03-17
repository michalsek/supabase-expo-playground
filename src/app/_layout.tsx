import { Stack } from "expo-router";

import { AuthProvider } from "../auth/AuthProvider";
import { rootScreens, rootStackScreenOptions } from "../navigation/root-stack";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={rootStackScreenOptions}>
        <Stack.Screen name="index" options={rootScreens.index} />
        <Stack.Screen name="confirmation" options={rootScreens.confirmation} />
        <Stack.Screen name="sign-in" options={rootScreens["sign-in"]} />
        <Stack.Screen name="sign-up" options={rootScreens["sign-up"]} />
        <Stack.Screen name="(protected)" options={rootScreens["(protected)"]} />
      </Stack>
    </AuthProvider>
  );
}
