import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../auth/AuthProvider";
import { AccountCard } from "../../components/AccountCard";
import { navigationTheme } from "../../navigation/root-stack";
import { Card } from "../../ui/Card";
import { Row } from "../../ui/Row";
import { Screen } from "../../ui/Screen";
import { Spacer } from "../../ui/Spacer";

export default function SettingsScreen() {
  const { refreshSession, session, signOut, user } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshSummary, setRefreshSummary] = useState<string | null>(null);

  const accessTokenExpiresAt = formatTimestamp(session?.expires_at);
  const accessTokenIssuedAt =
    session?.expires_at !== undefined
      ? formatTimestamp(session.expires_at - session.expires_in)
      : "Unavailable";
  const accessTokenLifetime = formatDuration(
    session?.expires_at !== undefined
      ? session.expires_at - Math.floor(Date.now() / 1000)
      : null,
  );

  const handleRefreshSession = async () => {
    setIsRefreshing(true);
    setRefreshSummary(null);

    const previousAccessToken = session?.access_token ?? null;
    const previousRefreshToken = session?.refresh_token ?? null;
    const { data, error } = await refreshSession();

    if (error) {
      setRefreshSummary(`Refresh failed: ${error.message}`);
      setIsRefreshing(false);
      return;
    }

    const nextSession = data.session;
    const accessTokenState = describeTokenRotation(
      previousAccessToken,
      nextSession?.access_token ?? null,
      "Access token",
    );
    const refreshTokenState = describeTokenRotation(
      previousRefreshToken,
      nextSession?.refresh_token ?? null,
      "Refresh token",
    );
    const expiryState =
      nextSession?.expires_at !== undefined
        ? `New access token lifetime ${formatDuration(nextSession.expires_at - Math.floor(Date.now() / 1000))}.`
        : null;

    setRefreshSummary(
      [accessTokenState, refreshTokenState, expiryState]
        .filter((value): value is string => value !== null)
        .join(" "),
    );
    setIsRefreshing(false);
  };

  return (
    <Screen>
      <Card gap={10}>
        <Text style={styles.label}>User id</Text>
        <Text style={styles.value}>{user?.id ?? "Unavailable"}</Text>
      </Card>
      <Spacer.Vertical size={20} />
      <AccountCard
        email={user?.email}
        actions={[{ label: "Sign out", onPress: () => void signOut() }]}
      />
      <Spacer.Vertical size={20} />
      <Card gap={12}>
        <Text style={styles.label}>Supabase auth debug</Text>
        <DebugField label="Token type" value={session?.token_type ?? "Unavailable"} />
        <DebugField
          label="Access token preview"
          value={previewToken(session?.access_token)}
          selectable
        />
        <DebugField
          label="Access token length"
          value={String(session?.access_token.length ?? 0)}
        />
        <DebugField label="Access token issued at" value={accessTokenIssuedAt} />
        <DebugField label="Access token expires at" value={accessTokenExpiresAt} />
        <DebugField
          label="Access token time left"
          value={accessTokenLifetime}
        />
        <DebugField
          label="Session expires_in"
          value={
            session?.expires_in !== undefined
              ? `${session.expires_in} seconds`
              : "Unavailable"
          }
        />
        <DebugField
          label="Refresh token preview"
          value={previewToken(session?.refresh_token)}
          selectable
        />
        <DebugField
          label="Refresh token length"
          value={String(session?.refresh_token.length ?? 0)}
        />
        <DebugField
          label="Refresh token expiry"
          value="Supabase does not expose a refresh-token expiration timestamp in the session. The auth client treats refresh tokens as one-time-use tokens that rotate when refreshed."
        />
        {refreshSummary ? (
          <Text style={styles.refreshSummary}>{refreshSummary}</Text>
        ) : null}
        <Row gap={12}>
          <Pressable
            disabled={isRefreshing || session === null}
            onPress={() => void handleRefreshSession()}
            style={[
              styles.action,
              styles.secondaryAction,
              (isRefreshing || session === null) && styles.actionMuted,
            ]}
          >
            <Text style={styles.secondaryActionLabel}>
              {isRefreshing ? "Refreshing..." : "Refresh session"}
            </Text>
          </Pressable>
        </Row>
      </Card>
    </Screen>
  );
}

function DebugField({
  label,
  selectable = false,
  value,
}: {
  label: string;
  selectable?: boolean;
  value: string;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text selectable={selectable} style={styles.fieldValue}>
        {value}
      </Text>
    </View>
  );
}

function describeTokenRotation(
  previousToken: string | null,
  nextToken: string | null,
  label: string,
) {
  if (!nextToken) {
    return `${label} is unavailable after refresh.`;
  }

  if (!previousToken) {
    return `${label} was issued by the refresh call.`;
  }

  if (previousToken === nextToken) {
    return `${label} did not rotate.`;
  }

  return `${label} rotated.`;
}

function formatDuration(totalSeconds: number | null) {
  if (totalSeconds === null) {
    return "Unavailable";
  }

  if (totalSeconds <= 0) {
    return `Expired ${formatDurationParts(Math.abs(totalSeconds))} ago`;
  }

  return `${formatDurationParts(totalSeconds)} remaining`;
}

function formatDurationParts(totalSeconds: number) {
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;
  const parts = [
    days > 0 ? `${days}d` : null,
    hours > 0 ? `${hours}h` : null,
    minutes > 0 ? `${minutes}m` : null,
    days === 0 && hours === 0 ? `${seconds}s` : null,
  ].filter((value): value is string => value !== null);

  return parts.join(" ");
}

function formatTimestamp(timestampInSeconds?: number | null) {
  if (!timestampInSeconds) {
    return "Unavailable";
  }

  const date = new Date(timestampInSeconds * 1000);

  return `${date.toLocaleString()} (${date.toISOString()})`;
}

function previewToken(token?: string | null) {
  if (!token) {
    return "Unavailable";
  }

  if (token.length <= 24) {
    return token;
  }

  return `${token.slice(0, 16)}...${token.slice(-8)}`;
}

const styles = StyleSheet.create({
  action: {
    alignItems: "center",
    borderRadius: 4,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  actionMuted: {
    opacity: 0.6,
  },
  field: {
    gap: 4,
  },
  fieldLabel: {
    color: navigationTheme.colors.muted,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  fieldValue: {
    color: navigationTheme.colors.text,
    fontSize: 15,
    lineHeight: 21,
  },
  label: {
    color: navigationTheme.colors.muted,
    fontSize: 14,
    textTransform: "uppercase",
  },
  refreshSummary: {
    color: navigationTheme.colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  secondaryAction: {
    borderColor: navigationTheme.colors.border,
    borderWidth: 1,
  },
  secondaryActionLabel: {
    color: navigationTheme.colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  value: {
    color: navigationTheme.colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
});
