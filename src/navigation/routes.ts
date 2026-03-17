export const routes = {
  home: "/" as const,
  todoNew: "/todo/new" as const,
  todoDetails: (id: string | number) =>
    ({
      pathname: "/todo/[id]" as const,
      params: { id: String(id) },
    }) as const,
};
