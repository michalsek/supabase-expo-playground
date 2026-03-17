export const routes = {
  home: "/" as const,
  confirmation: "/confirmation" as const,
  signIn: "/sign-in" as const,
  signUp: "/sign-up" as const,
  todos: "/todos" as const,
  todoNew: "/todo/new" as const,
  todoDetails: (id: string | number) =>
    ({
      pathname: "/todo/[id]" as const,
      params: { id: String(id) },
    }) as const,
};
