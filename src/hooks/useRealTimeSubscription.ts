import { useEffect, useEffectEvent, useRef } from "react";
import { AppState, type AppStateStatus } from "react-native";

import type { Database } from "../database/types";
import { supabase } from "../supabase/client";

type RealTimeEvent = "*" | "INSERT" | "UPDATE" | "DELETE";

type UseRealTimeSubscriptionOptions = {
  channelName: string;
  enabled?: boolean;
  filter?: string;
  onRefresh: (reason: "foreground" | "realtime") => void | Promise<void>;
  resource: {
    event?: RealTimeEvent;
    schema?: "public";
    table: keyof Database["public"]["Tables"];
  };
};

function isForegroundTransition(
  previousAppState: AppStateStatus,
  nextAppState: AppStateStatus,
) {
  return (
    (previousAppState === "background" || previousAppState === "inactive") &&
    nextAppState === "active"
  );
}

export function useRealTimeSubscription({
  channelName,
  enabled = true,
  filter,
  onRefresh,
  resource,
}: UseRealTimeSubscriptionOptions) {
  const appStateRef = useRef(AppState.currentState);
  const refreshResource = useEffectEvent(onRefresh);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: resource.event ?? "*",
          filter,
          schema: resource.schema ?? "public",
          table: resource.table,
        },
        (payload) => {
          if (__DEV__) {
            const newId =
              payload.new && "id" in payload.new ? String(payload.new.id) : null;
            const oldId =
              payload.old && "id" in payload.old ? String(payload.old.id) : null;

            console.log("[realtime] change received", {
              channel: channelName,
              eventType: payload.eventType,
              newId,
              oldId,
              schema: payload.schema,
              table: payload.table,
            });
          }

          void refreshResource("realtime");
        },
      )
      .subscribe((status, error) => {
        if (!__DEV__) {
          return;
        }

        console.log("[realtime] channel status", {
          channel: channelName,
          error: error?.message ?? null,
          status,
        });
      });

    return () => {
      if (__DEV__) {
        console.log("[realtime] removing channel", {
          channel: channelName,
        });
      }

      void supabase.removeChannel(channel);
    };
  }, [channelName, enabled, filter, refreshResource, resource.event, resource.schema, resource.table]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    appStateRef.current = AppState.currentState;

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      const previousAppState = appStateRef.current;
      appStateRef.current = nextAppState;

      if (!isForegroundTransition(previousAppState, nextAppState)) {
        return;
      }

      if (__DEV__) {
        console.log("[realtime] app returned to foreground", {
          channel: channelName,
        });
      }

      void refreshResource("foreground");
    });

    return () => {
      subscription.remove();
    };
  }, [channelName, enabled, refreshResource]);
}
