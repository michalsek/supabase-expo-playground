import { FlatList, StyleSheet, View } from "react-native";

import { EmptyList } from "./EmptyList";
import { ListItem } from "./ListItem";
import type { TodoListProps } from "./index";

export function TodoList({
  onRefresh,
  refreshing = false,
  todos,
}: TodoListProps) {
  return (
    <FlatList
      contentContainerStyle={styles.content}
      data={todos}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={EmptyList}
      ItemSeparatorComponent={Separator}
      onRefresh={onRefresh}
      renderItem={({ item }) => <ListItem todo={item} />}
      refreshing={refreshing}
      showsVerticalScrollIndicator={false}
      style={styles.list}
    />
  );
}

const Separator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  list: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: "#E1E1E6",
  },
});
