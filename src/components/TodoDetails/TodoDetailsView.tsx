import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Tables } from "../../database/types";
import { navigationTheme } from "../../navigation/root-stack";
import { Column, Row } from "../../ui";
import { todoFormStyles } from "../TodoForm";

type Todo = Tables<"todos">;

type TodoDetailsViewProps = {
  onEdit: () => void;
  successMessage?: string | null;
  todo: Todo;
};

export function TodoDetailsView({
  onEdit,
  successMessage,
  todo,
}: TodoDetailsViewProps) {
  return (
    <Column gap={16}>
      <ReadOnlyField label="Title" value={todo.title} />
      <ReadOnlyField
        label="Description"
        mutedFallback="No description yet"
        value={todo.description}
      />
      <ReadOnlyField
        label="Notes"
        mutedFallback="No notes yet"
        value={todo.notes}
      />

      <Row gap={12}>
        <MetaField label="Priority" value={String(todo.priority)} />
        <MetaField label="Status" value={todo.status} />
      </Row>

      <MetaField label="Archived" value={todo.archived ? "Yes" : "No"} />

      {successMessage ? (
        <Text style={styles.successText}>{successMessage}</Text>
      ) : null}

      <Pressable onPress={onEdit} style={todoFormStyles.primaryAction}>
        <Text style={todoFormStyles.primaryActionLabel}>Edit todo</Text>
      </Pressable>
    </Column>
  );
}

type ReadOnlyFieldProps = {
  label: string;
  mutedFallback?: string;
  value: string | null;
};

function ReadOnlyField({
  label,
  mutedFallback,
  value,
}: ReadOnlyFieldProps) {
  const content = value?.trim() ? value : mutedFallback ?? "Not provided";

  return (
    <Column gap={8}>
      <Text style={todoFormStyles.label}>{label}</Text>
      <Text style={[styles.readOnlyValue, !value?.trim() && styles.readOnlyMuted]}>
        {content}
      </Text>
    </Column>
  );
}

type MetaFieldProps = {
  label: string;
  value: string;
};

function MetaField({ label, value }: MetaFieldProps) {
  return (
    <Column gap={4} style={styles.metaField}>
      <Text style={todoFormStyles.label}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </Column>
  );
}

const styles = StyleSheet.create({
  metaField: {
    flex: 1,
  },
  metaValue: {
    color: navigationTheme.colors.text,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
    textTransform: "capitalize",
  },
  readOnlyMuted: {
    color: navigationTheme.colors.muted,
  },
  readOnlyValue: {
    color: navigationTheme.colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
  successText: {
    color: "#0f766e",
    fontSize: 14,
    lineHeight: 20,
  },
});
