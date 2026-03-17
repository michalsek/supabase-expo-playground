import { FlatList, StyleSheet } from "react-native";

import { EmptyList } from "./EmptyList";
import { ListItem } from "./ListItem";
import type { TodoListProps } from "./index";

export function TodoList({ todos }: TodoListProps) {
  return (
    <FlatList
      contentContainerStyle={styles.content}
      data={todos}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={EmptyList}
      renderItem={({ item }) => <ListItem todo={item} />}
      showsVerticalScrollIndicator={false}
      style={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    gap: 16,
    paddingBottom: 40,
  },
  list: {
    flex: 1,
  },
});
