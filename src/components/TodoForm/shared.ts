import { StyleSheet } from "react-native";

import type { Enums, Tables } from "../../database/types";
import { navigationTheme } from "../../navigation/root-stack";

type TodoFormSource = Partial<
  Pick<Tables<"todos">, "description" | "notes" | "priority" | "title">
>;

export type TodoStatus = Enums<"todo_status">;

export type TodoFormValues = {
  description: string;
  notes: string;
  priorityText: string;
  title: string;
};

export const todoStatusOptions: TodoStatus[] = ["pending", "done", "cancelled"];

export function createTodoFormValues(
  initialValues?: TodoFormSource,
): TodoFormValues {
  return {
    description: initialValues?.description ?? "",
    notes: initialValues?.notes ?? "",
    priorityText: String(initialValues?.priority ?? 3),
    title: initialValues?.title ?? "",
  };
}

export function normalizeTextInput(value: string) {
  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

export function toPriority(value: string, fallback = 3) {
  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed)) {
    return fallback;
  }

  return Math.min(Math.max(parsed, 1), 5);
}

export const todoFormStyles = StyleSheet.create({
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
