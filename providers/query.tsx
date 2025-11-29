import { QueryClient } from "@tanstack/react-query";

export const PERSIST_TIME = 1000 * 60 * 60 * 24 * 14; // 14 days

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: PERSIST_TIME,
      staleTime: PERSIST_TIME,
    },
  },
});
