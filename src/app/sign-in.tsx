import { Redirect } from "expo-router";
import { useState } from "react";

import { useAuth } from "../auth/AuthProvider";
import { AuthForm } from "../components/AuthForm";
import { AuthGate } from "../components/AuthGate";
import { Screen } from "../components/Screen";
import { routes } from "../navigation/routes";

export default function SignInScreen() {
  const { isLoading, session, signIn } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) {
    return (
      <AuthGate
        description="Restoring your previous session before showing the sign-in screen."
        title="Checking session"
      />
    );
  }

  if (session) {
    return <Redirect href={routes.todos} />;
  }

  async function handleSubmit(credentials: {
    email: string;
    password: string;
  }) {
    setErrorMessage(null);
    setIsSubmitting(true);

    const { error } = await signIn(credentials);

    if (error) {
      setErrorMessage(error.message);
    }

    setIsSubmitting(false);
  }

  return (
    <Screen edges={["top", "bottom", "left", "right"]}>
      <AuthForm
        alternateHref={routes.signUp}
        alternateLabel="Create one"
        alternatePrompt="Need an account?"
        errorMessage={errorMessage}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        submitLabel="Sign in"
        subtitle="Use your Supabase email and password to access the protected todo routes."
        title="Welcome back"
      />
    </Screen>
  );
}
