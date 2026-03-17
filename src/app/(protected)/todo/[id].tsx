import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { useAuth } from "../../../auth/AuthProvider";
import { ErrorView } from "../../../components/ErrorView";
import { LoadingView } from "../../../components/LoadingView";
import { Screen } from "../../../ui/Screen";
import type { Enums, Tables, TablesUpdate } from "../../../database/types";
import { navigationTheme } from "../../../navigation/root-stack";
import { routes } from "../../../navigation/routes";
import { supabase } from "../../../supabase/client";

type Todo = Tables<"todos">;
type TodoStatus = Enums<"todo_status">;

const todoStatusOptions: TodoStatus[] = ["pending", "done", "cancelled"];

function normalizeTextInput(value: string) {
  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function toPriority(value: string, fallback: number) {
  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed)) {
    return fallback;
  }

  return Math.min(Math.max(parsed, 1), 5);
}

export default function TodoDetailsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [archived, setArchived] = useState(false);
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notes, setNotes] = useState("");
  const [priorityText, setPriorityText] = useState("3");
  const [status, setStatus] = useState<TodoStatus>("pending");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [todo, setTodo] = useState<Todo | null>(null);

  const syncForm = useCallback((nextTodo: Todo) => {
    setArchived(nextTodo.archived);
    setDescription(nextTodo.description ?? "");
    setNotes(nextTodo.notes ?? "");
    setPriorityText(String(nextTodo.priority));
    setStatus(nextTodo.status);
    setTitle(nextTodo.title);
    setTodo(nextTodo);
  }, []);

  const loadTodo = useCallback(async () => {
    if (!id || !user) {
      setErrorMessage("Missing todo id or session.");
      setIsLoading(false);

      return;
    }

    setErrorMessage(null);
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
      setErrorMessage("This todo does not exist or you do not have access to it.");
      setTodo(null);
    } else {
      syncForm(data);
    }

    setIsLoading(false);
  }, [id, syncForm, user]);

  useFocusEffect(
    useCallback(() => {
      void loadTodo();
    }, [loadTodo]),
  );

  const handleSave = useCallback(async () => {
    if (!todo || !user) {
      setErrorMessage("The todo is not ready to save.");

      return;
    }

    const normalizedTitle = title.trim();

    if (normalizedTitle.length === 0) {
      setErrorMessage("Title is required.");

      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const nextStatus = status;
    const nextCompletedAt =
      nextStatus === "done"
        ? todo.completed_at ?? new Date().toISOString()
        : null;

    const payload: TablesUpdate<"todos"> = {
      archived,
      completed_at: nextCompletedAt,
      description: normalizeTextInput(description),
      notes: normalizeTextInput(notes),
      priority: toPriority(priorityText, todo.priority),
      status: nextStatus,
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
      syncForm(data);
      setSuccessMessage("Changes saved.");
    }

    setIsSaving(false);
  }, [
    archived,
    description,
    notes,
    priorityText,
    status,
    syncForm,
    title,
    todo,
    user,
  ]);

  const screenTitle = todo?.title ?? (id ? `Todo ${id}` : "Todo details");

  return (
    <Screen
      subtitle="Update the row stored in your Supabase `todos` table."
      title={screenTitle}
    >
      {isLoading ? <LoadingView message="Loading todo details..." /> : null}

      {!isLoading && !todo ? (
        <ErrorView
          actionLabel="Back to todos"
          message={
            errorMessage ?? "The requested todo could not be loaded."
          }
          onAction={() => router.replace(routes.todos)}
          title="Todo unavailable"
        />
      ) : null}

      {!isLoading && todo ? (
        <View style={styles.form}>
          <View style={styles.card}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              onChangeText={setTitle}
              placeholder="Ship onboarding copy"
              placeholderTextColor={navigationTheme.colors.muted}
              style={styles.input}
              value={title}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              multiline
              onChangeText={setDescription}
              placeholder="Short context for this todo"
              placeholderTextColor={navigationTheme.colors.muted}
              style={[styles.input, styles.textArea]}
              textAlignVertical="top"
              value={description}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              multiline
              onChangeText={setNotes}
              placeholder="Optional implementation notes"
              placeholderTextColor={navigationTheme.colors.muted}
              style={[styles.input, styles.textArea]}
              textAlignVertical="top"
              value={notes}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Priority</Text>
            <TextInput
              keyboardType="number-pad"
              onChangeText={setPriorityText}
              placeholder="1-5"
              placeholderTextColor={navigationTheme.colors.muted}
              style={styles.input}
              value={priorityText}
            />
            <Text style={styles.helperText}>Saved as a number between 1 and 5.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.segmentRow}>
              {todoStatusOptions.map((option) => {
                const isActive = option === status;

                return (
                  <Pressable
                    key={option}
                    onPress={() => setStatus(option)}
                    style={[
                      styles.segmentButton,
                      isActive && styles.segmentButtonActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.segmentLabel,
                        isActive && styles.segmentLabelActive,
                      ]}
                    >
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Pressable
            onPress={() => setArchived((current) => !current)}
            style={[styles.card, styles.toggleCard]}
          >
            <View>
              <Text style={styles.label}>Archived</Text>
              <Text style={styles.helperText}>
                Archived todos disappear from the main list.
              </Text>
            </View>
            <View
              style={[
                styles.togglePill,
                archived && styles.togglePillActive,
              ]}
            >
              <Text
                style={[
                  styles.toggleLabel,
                  archived && styles.toggleLabelActive,
                ]}
              >
                {archived ? "Yes" : "No"}
              </Text>
            </View>
          </Pressable>

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          {successMessage ? (
            <Text style={styles.successText}>{successMessage}</Text>
          ) : null}

          <Pressable
            disabled={isSaving}
            onPress={() => void handleSave()}
            style={[primaryActionStyle, isSaving && styles.primaryActionMuted]}
          >
            {isSaving ? (
              <ActivityIndicator color="#f7fffd" />
            ) : (
              <Text style={styles.primaryActionLabel}>Save changes</Text>
            )}
          </Pressable>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: navigationTheme.colors.card,
    borderColor: navigationTheme.colors.border,
    borderRadius: 24,
    borderWidth: 1,
    gap: 10,
    padding: 20,
  },
  errorText: {
    color: "#b42318",
    fontSize: 14,
    lineHeight: 20,
  },
  errorTitle: {
    color: navigationTheme.colors.text,
    fontSize: 20,
    fontWeight: "700",
  },
  form: {
    gap: 16,
  },
  helperText: {
    color: navigationTheme.colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  input: {
    backgroundColor: "#fffaf1",
    borderColor: navigationTheme.colors.border,
    borderRadius: 16,
    borderWidth: 1,
    color: navigationTheme.colors.text,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  label: {
    color: navigationTheme.colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  primaryAction: {
    alignItems: "center",
    backgroundColor: navigationTheme.colors.accent,
    borderRadius: 18,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  primaryActionLabel: {
    color: "#f7fffd",
    fontSize: 16,
    fontWeight: "700",
  },
  primaryActionMuted: {
    opacity: 0.6,
  },
  segmentButton: {
    alignItems: "center",
    borderColor: navigationTheme.colors.border,
    borderRadius: 999,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  segmentButtonActive: {
    backgroundColor: navigationTheme.colors.accent,
    borderColor: navigationTheme.colors.accent,
  },
  segmentLabel: {
    color: navigationTheme.colors.text,
    fontSize: 14,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  segmentLabelActive: {
    color: "#f7fffd",
  },
  segmentRow: {
    flexDirection: "row",
    gap: 10,
  },
  successText: {
    color: "#0f766e",
    fontSize: 14,
    lineHeight: 20,
  },
  textArea: {
    minHeight: 120,
  },
  toggleCard: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  toggleLabel: {
    color: navigationTheme.colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  toggleLabelActive: {
    color: "#f7fffd",
  },
  togglePill: {
    backgroundColor: "#fffaf1",
    borderColor: navigationTheme.colors.border,
    borderRadius: 999,
    borderWidth: 1,
    minWidth: 56,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  togglePillActive: {
    backgroundColor: navigationTheme.colors.accent,
    borderColor: navigationTheme.colors.accent,
  },
});

const primaryActionStyle = StyleSheet.flatten([styles.primaryAction]);
