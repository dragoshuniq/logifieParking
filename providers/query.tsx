import { QueryClient } from "@tanstack/react-query";

export const PERSIST_TIME = 1000 * 60 * 60 * 24 * 14;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: PERSIST_TIME,
      staleTime: PERSIST_TIME,
      retry: (failureCount) => {
        if (failureCount >= 2) {
          return false;
        }
        return true;
      },
      retryDelay: (attemptIndex) =>
        Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnMount: (query) => {
        if (query.state.data) {
          return false;
        }
        return true;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      networkMode: "offlineFirst",
      placeholderData: (previousData: unknown) => previousData,
    },
  },
});
