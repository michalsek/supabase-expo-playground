import { Stack, useFocusEffect, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useCallback, useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { useAuth } from "../../auth/AuthProvider";
import { ErrorView } from "../../components/ErrorView";
import { LoadingView } from "../../components/LoadingView";
import { TodoList, type TodoListItemData } from "../../components/TodoList";
import { navigationTheme } from "../../navigation/root-stack";
import { routes } from "../../navigation/routes";
import { supabase } from "../../supabase/client";
import { Row } from "../../ui/Row";
import { Screen } from "../../ui/Screen";

export default function TodosScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [todos, setTodos] = useState<TodoListItemData[]>([]);

  const loadTodos = useCallback(
    async (options?: { silent?: boolean }) => {
      if (!user) {
        setTodos([]);
        setErrorMessage(null);
        setIsLoading(false);

        return;
      }

      const isSilent = options?.silent ?? false;

      setErrorMessage(null);

      if (isSilent) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const { data, error } = await supabase
        .from("todos")
        .select(
          "id, title, description, priority, status, archived, created_at",
        )
        .eq("user_id", user.id)
        .eq("archived", false)
        .order("created_at", { ascending: false });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setTodos(data ?? []);
      }

      setIsLoading(false);
      setIsRefreshing(false);
    },
    [user],
  );

  useFocusEffect(
    useCallback(() => {
      void loadTodos({ silent: todos.length > 0 });
    }, [loadTodos, todos.length]),
  );

  const content = useMemo(() => {
    if (isLoading) {
      return <LoadingView message="Loading todos from Supabase..." />;
    }

    if (errorMessage) {
      return (
        <ErrorView
          actionLabel="Try again"
          message={errorMessage}
          onAction={() => void loadTodos()}
          title="Could not load todos"
        />
      );
    }

    return <TodoList todos={todos} />;
  }, [todos, isRefreshing, errorMessage, loadTodos]);

  return (
    <>
      <Screen
        edges={["bottom", "left", "right"]}
        scrollable={false}
        disablePadding
      >
        {content}
      </Screen>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Row gap={6}>
              <Pressable
                accessibilityLabel="Create a todo"
                hitSlop={10}
                onPress={() => router.push(routes.todoNew)}
                style={styles.headerButton}
              >
                <SymbolView
                  name={{
                    android: "add_circle",
                    ios: "plus.circle.fill",
                    web: "add_circle",
                  }}
                  size={19}
                  tintColor={navigationTheme.colors.text}
                  weight="semibold"
                />
              </Pressable>
              <Pressable
                accessibilityLabel="Open settings"
                hitSlop={10}
                onPress={() => router.push(routes.settings)}
                style={styles.headerButton}
              >
                <SymbolView
                  name={{
                    android: "settings",
                    ios: "gearshape.fill",
                    web: "settings",
                  }}
                  size={18}
                  tintColor={navigationTheme.colors.text}
                  weight="semibold"
                />
              </Pressable>
            </Row>
          ),
          title: "Todos",
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    alignItems: "center",
    borderRadius: 999,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
});
