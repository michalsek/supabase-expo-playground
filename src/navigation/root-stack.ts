export const navigationTheme = {
  colors: {
    accent: "#0f766e",
    background: "#f4efe6",
    border: "#d9d0c2",
    card: "#fffdf8",
    muted: "#6f665b",
    text: "#1d1b18",
  },
} as const;

export const rootStackScreenOptions = {
  animation: "slide_from_right",
  contentStyle: {
    backgroundColor: navigationTheme.colors.background,
  },
  headerBackTitle: "Back",
  headerLargeTitle: false,
  headerShadowVisible: false,
  headerStyle: {
    backgroundColor: navigationTheme.colors.card,
  },
  headerTintColor: navigationTheme.colors.text,
  headerTitleStyle: {
    color: navigationTheme.colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
} as const;

export const rootScreens = {
  index: {
    headerShown: false,
    title: "Home",
  },
  "todo/[id]": {
    title: "Todo details",
  },
  "todo/new": {
    presentation: "modal",
    title: "New todo",
  },
} as const;
