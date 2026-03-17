import * as Linking from "expo-linking";
import { Link, Redirect } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAuth } from "../auth/AuthProvider";
import { emailConfirmationRedirectUrl } from "../auth/redirect";
import { Screen } from "../ui/Screen";
import { navigationTheme } from "../navigation/root-stack";
import { routes } from "../navigation/routes";
import { supabase } from "../supabase/client";

type ConfirmationStatus = "idle" | "processing" | "success" | "error";

function getDeepLinkParams(url: string) {
  const params = new URLSearchParams();
  const [beforeHash, hash = ""] = url.split("#");
  const query = beforeHash.includes("?") ? beforeHash.split("?")[1] : "";

  new URLSearchParams(query).forEach((value, key) => {
    params.set(key, value);
  });

  new URLSearchParams(hash).forEach((value, key) => {
    params.set(key, value);
  });

  return params;
}

export default function ConfirmationScreen() {
  const { session } = useAuth();
  const url = Linking.useLinkingURL();
  const processedUrlRef = useRef<string | null>(null);
  const [message, setMessage] = useState(
    "Open the confirmation link from your email to finish activating your account.",
  );
  const [status, setStatus] = useState<ConfirmationStatus>("idle");

  useEffect(() => {
    if (!url || processedUrlRef.current === url) {
      if (session && status !== "success") {
        setStatus("success");
        setMessage("Your email is confirmed and the app session is ready.");
      }

      return;
    }

    processedUrlRef.current = url;
    const currentUrl = url;
    let isActive = true;

    async function confirmEmail() {
      setStatus("processing");
      setMessage("Confirming your email and restoring the Supabase session.");

      const params = getDeepLinkParams(currentUrl);
      const errorDescription =
        params.get("error_description") ?? params.get("error");

      if (errorDescription) {
        if (!isActive) {
          return;
        }

        setStatus("error");
        setMessage(errorDescription);
        return;
      }

      const code = params.get("code");
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!isActive) {
          return;
        }

        if (error) {
          setStatus("error");
          setMessage(error.message);
          return;
        }

        setStatus("success");
        setMessage(
          "Your email has been confirmed. You can continue into the app.",
        );
        return;
      }

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (!isActive) {
          return;
        }

        if (error) {
          setStatus("error");
          setMessage(error.message);
          return;
        }

        setStatus("success");
        setMessage(
          "Your email has been confirmed. You can continue into the app.",
        );
        return;
      }

      if (!isActive) {
        return;
      }

      setStatus(session ? "success" : "idle");
      setMessage(
        session
          ? "Your email is already confirmed and your session is active."
          : `No confirmation payload was found. Make sure Supabase redirects to ${emailConfirmationRedirectUrl}.`,
      );
    }

    void confirmEmail();

    return () => {
      isActive = false;
    };
  }, [session, status, url]);

  const isSuccess = status === "success";
  const isError = status === "error";

  if (session) {
    return <Redirect href={routes.todos} />;
  }

  return (
    <Screen edges={["top", "bottom", "left", "right"]}>
      <View style={styles.card}>
        <Text style={styles.kicker}>Email callback</Text>
        <Text style={styles.title}>
          {status === "processing"
            ? "Confirming your account"
            : isSuccess
              ? "Email confirmed"
              : isError
                ? "Confirmation failed"
                : "Awaiting confirmation"}
        </Text>
        <Text style={styles.description}>{message}</Text>
      </View>
      <View style={styles.actions}>
        {session ? (
          <Link asChild href={routes.todos}>
            <Pressable style={primaryActionStyle}>
              <Text style={styles.primaryActionLabel}>Continue to app</Text>
            </Pressable>
          </Link>
        ) : (
          <Link asChild href={routes.signIn}>
            <Pressable style={primaryActionStyle}>
              <Text style={styles.primaryActionLabel}>Go to sign in</Text>
            </Pressable>
          </Link>
        )}
        <Link asChild href={routes.home}>
          <Pressable style={secondaryActionStyle}>
            <Text style={styles.secondaryActionLabel}>Back to home</Text>
          </Pressable>
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: 12,
  },
  card: {
    backgroundColor: navigationTheme.colors.card,
    borderColor: navigationTheme.colors.border,
    borderRadius: 24,
    borderWidth: 1,
    gap: 12,
    padding: 20,
  },
  description: {
    color: navigationTheme.colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  kicker: {
    color: navigationTheme.colors.accent,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  primaryAction: {
    alignItems: "center",
    backgroundColor: navigationTheme.colors.accent,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  primaryActionLabel: {
    color: "#f7fffd",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryAction: {
    alignItems: "center",
    borderColor: navigationTheme.colors.border,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  secondaryActionLabel: {
    color: navigationTheme.colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  title: {
    color: navigationTheme.colors.text,
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.6,
  },
});

const primaryActionStyle = StyleSheet.flatten([styles.primaryAction]);
const secondaryActionStyle = StyleSheet.flatten([styles.secondaryAction]);
