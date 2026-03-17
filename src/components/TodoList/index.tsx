import type { Tables } from "../../database/types";

export { EmptyList } from "./EmptyList";
export { ListItem } from "./ListItem";
export { TodoList } from "./TodoList";

export type TodoListItemData = Pick<
  Tables<"todos">,
  | "archived"
  | "created_at"
  | "description"
  | "id"
  | "priority"
  | "status"
  | "title"
>;

export type TodoListProps = {
  todos: TodoListItemData[];
};
