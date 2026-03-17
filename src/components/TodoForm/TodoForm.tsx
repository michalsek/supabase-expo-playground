import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, Text, TextInput } from "react-native";

import { navigationTheme } from "../../navigation/root-stack";
import { Column } from "../../ui";
import { todoFormStyles, type TodoFormValues } from "./shared";

type TodoFormProps = {
  cancelLabel?: string;
  children?: ReactNode;
  errorMessage?: string | null;
  helperText?: string;
  isSubmitting?: boolean;
  onCancel: () => void;
  onChangeValue: (field: keyof TodoFormValues, value: string) => void;
  onSubmit: () => void;
  submitDisabled?: boolean;
  submitLabel: string;
  values: TodoFormValues;
};

const priorityHelperText =
  "Priority is clamped to the `1-5` range before save.";

export function TodoForm({
  cancelLabel = "Cancel",
  children,
  errorMessage,
  helperText = priorityHelperText,
  isSubmitting = false,
  onCancel,
  onChangeValue,
  onSubmit,
  submitDisabled = false,
  submitLabel,
  values,
}: TodoFormProps) {
  return (
    <Column gap={16}>
      <Text style={todoFormStyles.label}>Title</Text>
      <TextInput
        onChangeText={(value) => onChangeValue("title", value)}
        placeholder="Plan launch checklist"
        placeholderTextColor={navigationTheme.colors.muted}
        returnKeyType="next"
        style={todoFormStyles.input}
        value={values.title}
      />

      <Text style={todoFormStyles.label}>Description</Text>
      <TextInput
        multiline
        onChangeText={(value) => onChangeValue("description", value)}
        placeholder="Short context for this todo"
        placeholderTextColor={navigationTheme.colors.muted}
        returnKeyType="next"
        style={[todoFormStyles.input, todoFormStyles.textArea]}
        textAlignVertical="top"
        value={values.description}
      />

      <Text style={todoFormStyles.label}>Notes</Text>
      <TextInput
        multiline
        onChangeText={(value) => onChangeValue("notes", value)}
        placeholder="Optional notes"
        placeholderTextColor={navigationTheme.colors.muted}
        returnKeyType="next"
        style={[todoFormStyles.input, todoFormStyles.textArea]}
        textAlignVertical="top"
        value={values.notes}
      />

      <Text style={todoFormStyles.label}>Priority</Text>
      <TextInput
        keyboardType="number-pad"
        onChangeText={(value) => onChangeValue("priorityText", value)}
        placeholder="1-5"
        placeholderTextColor={navigationTheme.colors.muted}
        returnKeyType="done"
        style={todoFormStyles.input}
        value={values.priorityText}
      />
      <Text style={todoFormStyles.helperText}>{helperText}</Text>

      {children}

      {errorMessage ? (
        <Text style={todoFormStyles.errorText}>{errorMessage}</Text>
      ) : null}

      <Pressable
        disabled={submitDisabled}
        onPress={onSubmit}
        style={[
          todoFormStyles.primaryAction,
          submitDisabled && todoFormStyles.primaryActionMuted,
        ]}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#f7fffd" />
        ) : (
          <Text style={todoFormStyles.primaryActionLabel}>{submitLabel}</Text>
        )}
      </Pressable>

      <Pressable
        disabled={isSubmitting}
        onPress={onCancel}
        style={[
          todoFormStyles.secondaryAction,
          isSubmitting && todoFormStyles.primaryActionMuted,
        ]}
      >
        <Text style={todoFormStyles.secondaryActionLabel}>{cancelLabel}</Text>
      </Pressable>
    </Column>
  );
}
