import { Stack, useRouter } from "expo-router";
import { startTransition, useCallback, useState } from "react";

import { useAuth } from "../../../auth/AuthProvider";
import {
  createTodoFormValues,
  normalizeTextInput,
  TodoForm,
  toPriority,
  type TodoFormValues,
} from "../../../components/TodoForm";
import type { TablesInsert } from "../../../database/types";
import { routes } from "../../../navigation/routes";
import { supabase } from "../../../supabase/client";
import { Screen } from "../../../ui";

export default function NewTodoScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<TodoFormValues>(() =>
    createTodoFormValues(),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChangeValue = useCallback(
    (field: keyof TodoFormValues, value: string) => {
      setErrorMessage(null);
      setFormValues((current) => ({ ...current, [field]: value }));
    },
    [],
  );

  const handleSubmit = useCallback(async () => {
    if (!user) {
      setErrorMessage("You need an authenticated session to create todos.");

      return;
    }

    const normalizedTitle = formValues.title.trim();

    if (normalizedTitle.length === 0) {
      setErrorMessage("Title is required.");

      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const payload: TablesInsert<"todos"> = {
      description: normalizeTextInput(formValues.description),
      kind: "simple",
      notes: normalizeTextInput(formValues.notes),
      priority: toPriority(formValues.priorityText),
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
  }, [formValues, router, user]);

  const isDisabled = isSubmitting || formValues.title.trim().length === 0;

  return (
    <>
      <Screen>
        <TodoForm
          errorMessage={errorMessage}
          helperText="Priority is clamped to the `1-5` range before insert."
          isSubmitting={isSubmitting}
          onCancel={() => router.back()}
          onChangeValue={handleChangeValue}
          onSubmit={() => void handleSubmit()}
          submitDisabled={isDisabled}
          submitLabel="Create todo"
          values={formValues}
        />
      </Screen>
      <Stack.Screen options={{ title: "New todo" }} />
    </>
  );
}
