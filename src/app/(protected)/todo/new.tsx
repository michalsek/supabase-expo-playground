import { useRouter } from "expo-router";
import { startTransition, useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";

import { useAuth } from "../../../auth/AuthProvider";
import { Screen } from "../../../ui/Screen";
import { Card } from "../../../ui/Card";
import { Column } from "../../../ui/Column";
import type { TablesInsert } from "../../../database/types";
import { navigationTheme } from "../../../navigation/root-stack";
import { routes } from "../../../navigation/routes";
import { supabase } from "../../../supabase/client";

function normalizeTextInput(value: string) {
  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function toPriority(value: string) {
  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed)) {
    return 3;
  }

  return Math.min(Math.max(parsed, 1), 5);
}

export default function NewTodoScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notes, setNotes] = useState("");
  const [priorityText, setPriorityText] = useState("3");
  const [title, setTitle] = useState("");

  const handleSubmit = useCallback(async () => {
    if (!user) {
      setErrorMessage("You need an authenticated session to create todos.");

      return;
    }

    const normalizedTitle = title.trim();

    if (normalizedTitle.length === 0) {
      setErrorMessage("Title is required.");

      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const payload: TablesInsert<"todos"> = {
      description: normalizeTextInput(description),
      kind: "simple",
      notes: normalizeTextInput(notes),
      priority: toPriority(priorityText),
      status: "pending",
      title: normalizedTitle,
      user_id: user.id,
    };

    const { data, error } = await supabase
      .from("todos")
      .insert(payload)
      .select("id")
      .single();

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);

      return;
    }

    startTransition(() => {
      router.replace(routes.todoDetails(data.id));
    });
  }, [description, notes, priorityText, router, title, user]);

  const isDisabled = isSubmitting || title.trim().length === 0;

  return (
    <Screen
      subtitle="Create a new row in your Supabase `todos` table."
      title="Create a todo"
    >
      <Column gap={16}>
        <Card gap={10} padding={20} style={styles.card}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            onChangeText={setTitle}
            placeholder="Plan launch checklist"
            placeholderTextColor={navigationTheme.colors.muted}
            style={styles.input}
            value={title}
          />
        </Card>

        <Card gap={10} padding={20} style={styles.card}>
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
        </Card>

        <Card gap={10} padding={20} style={styles.card}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            multiline
            onChangeText={setNotes}
            placeholder="Optional notes"
            placeholderTextColor={navigationTheme.colors.muted}
            style={[styles.input, styles.textArea]}
            textAlignVertical="top"
            value={notes}
          />
        </Card>

        <Card gap={10} padding={20} style={styles.card}>
          <Text style={styles.label}>Priority</Text>
          <TextInput
            keyboardType="number-pad"
            onChangeText={setPriorityText}
            placeholder="1-5"
            placeholderTextColor={navigationTheme.colors.muted}
            style={styles.input}
            value={priorityText}
          />
          <Text style={styles.helperText}>
            Priority is clamped to the `1-5` range before insert.
          </Text>
        </Card>

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        <Pressable
          disabled={isDisabled}
          onPress={() => void handleSubmit()}
          style={[styles.primaryAction, isDisabled && styles.primaryActionMuted]}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#f7fffd" />
          ) : (
            <Text style={styles.primaryActionLabel}>Create todo</Text>
          )}
        </Pressable>

        <Pressable
          disabled={isSubmitting}
          onPress={() => router.back()}
          style={[styles.secondaryAction, isSubmitting && styles.primaryActionMuted]}
        >
          <Text style={styles.secondaryActionLabel}>Cancel</Text>
        </Pressable>
      </Column>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
  },
  errorText: {
    color: "#b42318",
    fontSize: 14,
    lineHeight: 20,
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
  secondaryAction: {
    alignItems: "center",
    borderColor: navigationTheme.colors.border,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  secondaryActionLabel: {
    color: navigationTheme.colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  textArea: {
    minHeight: 120,
  },
});
