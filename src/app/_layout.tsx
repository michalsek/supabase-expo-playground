import { Stack } from "expo-router";

import { rootScreens, rootStackScreenOptions } from "../navigation/root-stack";

export default function RootLayout() {
  return (
    <Stack screenOptions={rootStackScreenOptions}>
      <Stack.Screen name="index" options={rootScreens.index} />
      <Stack.Screen name="todo/new" options={rootScreens["todo/new"]} />
      <Stack.Screen name="todo/[id]" options={rootScreens["todo/[id]"]} />
    </Stack>
  );
}
