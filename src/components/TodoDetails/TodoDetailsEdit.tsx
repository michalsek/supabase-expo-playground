import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Tables } from "../../database/types";
import { navigationTheme } from "../../navigation/root-stack";
import { Column, Row } from "../../ui";
import {
  createTodoFormValues,
  TodoForm,
  todoFormStyles,
  todoStatusOptions,
  type TodoFormValues,
  type TodoStatus,
} from "../TodoForm";

type Todo = Tables<"todos">;

export type EditTodoValues = TodoFormValues & {
  archived: boolean;
  status: TodoStatus;
};

type TodoDetailsEditProps = {
  errorMessage?: string | null;
  isSaving: boolean;
  onCancel: () => void;
  onSave: (values: EditTodoValues) => void | Promise<void>;
  todo: Todo;
};

function createEditTodoValues(todo: Todo): EditTodoValues {
  return {
    ...createTodoFormValues(todo),
    archived: todo.archived,
    status: todo.status,
  };
}

export function TodoDetailsEdit({
  errorMessage,
  isSaving,
  onCancel,
  onSave,
  todo,
}: TodoDetailsEditProps) {
  const [localError, setLocalError] = useState<string | null>(null);
  const [visibleErrorMessage, setVisibleErrorMessage] = useState<string | null>(
    errorMessage ?? null,
  );
  const [values, setValues] = useState(() => createEditTodoValues(todo));

  useEffect(() => {
    setLocalError(null);
    setValues(createEditTodoValues(todo));
  }, [todo]);

  useEffect(() => {
    setVisibleErrorMessage(errorMessage ?? null);
  }, [errorMessage]);

  const handleChangeValue = useCallback(
    (field: keyof TodoFormValues, value: string) => {
      setLocalError(null);
      setVisibleErrorMessage(null);
      setValues((current) => ({ ...current, [field]: value }));
    },
    [],
  );

  const handleSetStatus = useCallback((status: TodoStatus) => {
    setLocalError(null);
    setVisibleErrorMessage(null);
    setValues((current) => ({ ...current, status }));
  }, []);

  const handleToggleArchived = useCallback(() => {
    setLocalError(null);
    setVisibleErrorMessage(null);
    setValues((current) => ({ ...current, archived: !current.archived }));
  }, []);

  const handleSubmit = useCallback(() => {
    if (values.title.trim().length === 0) {
      setLocalError("Title is required.");

      return;
    }

    void onSave(values);
  }, [onSave, values]);

  const isSubmitDisabled = isSaving || values.title.trim().length === 0;

  return (
    <TodoForm
      errorMessage={localError ?? visibleErrorMessage}
      isSubmitting={isSaving}
      onCancel={onCancel}
      onChangeValue={handleChangeValue}
      onSubmit={handleSubmit}
      submitDisabled={isSubmitDisabled}
      submitLabel="Save changes"
      values={values}
    >
      <Column gap={16}>
        <Text style={todoFormStyles.label}>Status</Text>
        <Row gap={10}>
          {todoStatusOptions.map((option) => {
            const isActive = option === values.status;

            return (
              <Pressable
                key={option}
                onPress={() => handleSetStatus(option)}
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
        </Row>

        <Text style={todoFormStyles.label}>Archived</Text>
        <Pressable onPress={handleToggleArchived} style={styles.toggleRow}>
          <Text style={styles.toggleDescription}>
            Archived todos disappear from the main list.
          </Text>
          <View
            style={[
              styles.toggleValue,
              values.archived && styles.toggleValueActive,
            ]}
          >
            <Text
              style={[
                styles.toggleValueLabel,
                values.archived && styles.toggleValueLabelActive,
              ]}
            >
              {values.archived ? "Yes" : "No"}
            </Text>
          </View>
        </Pressable>
      </Column>
    </TodoForm>
  );
}

const styles = StyleSheet.create({
  segmentButton: {
    alignItems: "center",
    borderColor: navigationTheme.colors.border,
    borderWidth: 1,
    flex: 1,
    justifyContent: "center",
    minHeight: 52,
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
  toggleDescription: {
    color: navigationTheme.colors.muted,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  toggleRow: {
    alignItems: "center",
    borderColor: navigationTheme.colors.border,
    borderWidth: 1,
    flexDirection: "row",
    gap: 16,
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  toggleValue: {
    alignItems: "center",
    backgroundColor: "#fffaf1",
    borderColor: navigationTheme.colors.border,
    borderWidth: 1,
    justifyContent: "center",
    minWidth: 56,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  toggleValueActive: {
    backgroundColor: navigationTheme.colors.accent,
    borderColor: navigationTheme.colors.accent,
  },
  toggleValueLabel: {
    color: navigationTheme.colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  toggleValueLabelActive: {
    color: "#f7fffd",
  },
});
