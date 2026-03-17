import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useCallback, useState } from "react";

import { useAuth } from "../../../auth/AuthProvider";
import { ErrorView } from "../../../components/ErrorView";
import { LoadingView } from "../../../components/LoadingView";
import {
  TodoDetailsEdit,
  type EditTodoValues,
} from "../../../components/TodoDetails/TodoDetailsEdit";
import { TodoDetailsView } from "../../../components/TodoDetails/TodoDetailsView";
import { normalizeTextInput, toPriority } from "../../../components/TodoForm";
import type { Tables, TablesUpdate } from "../../../database/types";
import { routes } from "../../../navigation/routes";
import { supabase } from "../../../supabase/client";
import { Screen } from "../../../ui/Screen";

type Todo = Tables<"todos">;

export default function TodoDetailsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [todo, setTodo] = useState<Todo | null>(null);

  const syncTodo = useCallback((nextTodo: Todo) => {
    setTodo(nextTodo);
  }, []);

  const loadTodo = useCallback(async () => {
    if (!id || !user) {
      setErrorMessage("Missing todo id or session.");
      setIsLoading(false);

      return;
    }

    setErrorMessage(null);
    setIsEditing(false);
    setSuccessMessage(null);
    setIsLoading(true);

    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      setErrorMessage(error.message);
    } else if (!data) {
      setErrorMessage(
        "This todo does not exist or you do not have access to it.",
      );
      setTodo(null);
    } else {
      syncTodo(data);
    }

    setIsLoading(false);
  }, [id, syncTodo, user]);

  useFocusEffect(
    useCallback(() => {
      void loadTodo();
    }, [loadTodo]),
  );

  const handleStartEditing = useCallback(() => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsEditing(true);
  }, []);

  const handleCancelEditing = useCallback(() => {
    setErrorMessage(null);
    setIsEditing(false);
  }, []);

  const handleSave = useCallback(
    async (values: EditTodoValues) => {
      if (!todo || !user) {
        setErrorMessage("The todo is not ready to save.");

        return;
      }

      const normalizedTitle = values.title.trim();

      if (normalizedTitle.length === 0) {
        setErrorMessage("Title is required.");

        return;
      }

      setErrorMessage(null);
      setIsSaving(true);
      setSuccessMessage(null);

      const nextCompletedAt =
        values.status === "done"
          ? (todo.completed_at ?? new Date().toISOString())
          : null;

      const payload: TablesUpdate<"todos"> = {
        archived: values.archived,
        completed_at: nextCompletedAt,
        description: normalizeTextInput(values.description),
        notes: normalizeTextInput(values.notes),
        priority: toPriority(values.priorityText, todo.priority),
        status: values.status,
        title: normalizedTitle,
      };

      const { data, error } = await supabase
        .from("todos")
        .update(payload)
        .eq("id", todo.id)
        .eq("user_id", user.id)
        .select("*")
        .single();

      if (error) {
        setErrorMessage(error.message);
      } else {
        syncTodo(data);
        setIsEditing(false);
        setSuccessMessage("Changes saved.");
      }

      setIsSaving(false);
    },
    [syncTodo, todo, user],
  );

  const screenTitle = todo?.title ?? (id ? `Todo ${id}` : "Todo details");

  return (
    <>
      <Screen title={screenTitle}>
        {isLoading ? <LoadingView message="Loading todo details..." /> : null}

        {!isLoading && !todo ? (
          <ErrorView
            actionLabel="Back to todos"
            message={errorMessage ?? "The requested todo could not be loaded."}
            onAction={() => router.replace(routes.todos)}
            title="Todo unavailable"
          />
        ) : null}

        {!isLoading && todo ? (
          isEditing ? (
            <TodoDetailsEdit
              errorMessage={errorMessage}
              isSaving={isSaving}
              onCancel={handleCancelEditing}
              onSave={handleSave}
              todo={todo}
            />
          ) : (
            <TodoDetailsView
              onEdit={handleStartEditing}
              successMessage={successMessage}
              todo={todo}
            />
          )
        ) : null}
      </Screen>
      <Stack.Screen
        options={{ title: isEditing ? "Edit todo" : "Todo details" }}
      />
    </>
  );
}
