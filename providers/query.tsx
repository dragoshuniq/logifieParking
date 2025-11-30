import { QueryClient } from "@tanstack/react-query";

export const ONE_MINUTE = 1000 * 60;
export const ONE_HOUR = ONE_MINUTE * 60;
export const ONE_DAY = ONE_HOUR * 24;
export const TWO_WEEKS = ONE_DAY * 14;

export const DEFAULT_GC_TIME = ONE_DAY;
export const DEFAULT_STALE_TIME = ONE_MINUTE * 5;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: DEFAULT_GC_TIME,
      staleTime: DEFAULT_STALE_TIME,
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
