import { Redirect, Stack } from "expo-router";

import { useAuth } from "../../auth/AuthProvider";
import { AuthGate } from "../../components/AuthGate";
import {
  protectedScreens,
  rootStackScreenOptions,
} from "../../navigation/root-stack";
import { routes } from "../../navigation/routes";

export default function ProtectedLayout() {
  const { isLoading, session } = useAuth();

  if (isLoading) {
    return (
      <AuthGate
        description="Loading your Supabase session before we expose the protected routes."
        title="Unlocking app"
      />
    );
  }

  if (!session) {
    return <Redirect href={routes.signIn} />;
  }

  return (
    <Stack screenOptions={rootStackScreenOptions}>
      <Stack.Screen name="todos" options={protectedScreens.todos} />
      <Stack.Screen name="settings" options={protectedScreens.settings} />
      <Stack.Screen name="todo/new" options={protectedScreens["todo/new"]} />
      <Stack.Screen name="todo/[id]" options={protectedScreens["todo/[id]"]} />
    </Stack>
  );
}
