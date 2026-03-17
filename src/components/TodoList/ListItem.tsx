import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { navigationTheme } from "../../navigation/root-stack";
import { routes } from "../../navigation/routes";
import { Row } from "../../ui/Row";
import type { TodoListItemData } from "./index";

const statusTone = {
  cancelled: "#b42318",
  done: "#0f766e",
  pending: "#a16207",
} as const;

type ListItemProps = {
  todo: TodoListItemData;
};

export function ListItem({ todo }: ListItemProps) {
  return (
    <Link asChild href={routes.todoDetails(todo.id)}>
      <Pressable style={styles.card}>
        <Row align="flex-start" gap={12} justify="space-between">
          <Text style={styles.cardTitle}>{todo.title}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusTone[todo.status] },
            ]}
          >
            <Text style={styles.statusBadgeLabel}>{todo.status}</Text>
          </View>
        </Row>
        {todo.description ? (
          <Text numberOfLines={2} style={styles.cardDescription}>
            {todo.description}
          </Text>
        ) : (
          <Text style={styles.cardDescriptionMuted}>No description yet</Text>
        )}
        <Row justify="space-between">
          <Text style={styles.cardMeta}>Priority {todo.priority}</Text>
          <Text style={styles.cardMeta}>
            {new Date(todo.created_at).toLocaleDateString()}
          </Text>
        </Row>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: navigationTheme.colors.card,
    padding: 16,
    gap: 8,
  },
  cardDescription: {
    color: navigationTheme.colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  cardDescriptionMuted: {
    color: navigationTheme.colors.muted,
    fontSize: 16,
  },
  cardMeta: {
    color: navigationTheme.colors.muted,
    fontSize: 14,
    fontWeight: "600",
  },
  cardTitle: {
    color: navigationTheme.colors.text,
    flex: 1,
    fontSize: 22,
    fontWeight: "700",
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusBadgeLabel: {
    color: "#fffdf8",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "capitalize",
  },
});
