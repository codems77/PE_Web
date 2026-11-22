"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, useEffect, useState, type ReactNode } from "react";
import { useAuthStore } from "../stores/auth-store";

export const AuthReadyContext = createContext(false);

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    Promise.resolve(useAuthStore.persist?.rehydrate()).finally(() => setAuthReady(true));
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthReadyContext.Provider value={authReady}>{children}</AuthReadyContext.Provider>
    </QueryClientProvider>
  );
}
