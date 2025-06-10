import "@tanstack/react-query";

import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  // queryCache: new QueryCache({
  // 	onError: errorHandler,
  // }),
  // mutationCache: new MutationCache({
  // 	onError: errorHandler,
  // }),

  defaultOptions: {
    queries: {
      retry: 0,
      staleTime: Infinity,
    },
  },
});
