import { Redirect } from "expo-router";
import { useState } from "react";

import { useAuth } from "../auth/AuthProvider";
import { emailConfirmationRedirectUrl } from "../auth/redirect";
import { AuthForm } from "../components/AuthForm";
import { AuthGate } from "../components/AuthGate";
import { Screen } from "../ui/Screen";
import { routes } from "../navigation/routes";

export default function SignUpScreen() {
  const { isLoading, session, signUp } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (isLoading) {
    return (
      <AuthGate
        description="Restoring your previous session before showing the sign-up screen."
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
    setSuccessMessage(null);
    setIsSubmitting(true);

    const { data, error } = await signUp({
      ...credentials,
      options: {
        emailRedirectTo: emailConfirmationRedirectUrl,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    setSuccessMessage(
      data.session
        ? "Account created. Redirecting into the app."
        : "Account created. Check your email if confirmation is enabled for this project.",
    );
    setIsSubmitting(false);
  }

  return (
    <Screen edges={["top", "bottom", "left", "right"]}>
      <AuthForm
        alternateHref={routes.signIn}
        alternateLabel="Sign in"
        alternatePrompt="Already have an account?"
        errorMessage={errorMessage}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        submitLabel="Create account"
        subtitle="Create an email/password account backed by Supabase Auth."
        successMessage={successMessage}
        title="Create your account"
      />
    </Screen>
  );
}
