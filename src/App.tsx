import "react-native-gesture-handler";
import "react-native-reanimated";

import { ExpoRoot } from "expo-router";
import { ctx } from "expo-router/_ctx";
import Head from "expo-router/head";
import { StatusBar } from "expo-status-bar";
import { setBackgroundColorAsync } from "expo-system-ui";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { navigationTheme } from "./navigation/root-stack";

export default function App() {
  useEffect(() => {
    console.log("Worker is available?", global.Worker ? "Yes" : "No");
    void setBackgroundColorAsync(navigationTheme.colors.background);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Head.Provider>
          <StatusBar style="dark" />
          <ExpoRoot context={ctx} />
        </Head.Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
