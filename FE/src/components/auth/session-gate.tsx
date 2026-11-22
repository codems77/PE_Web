"use client";

import { useRouter } from "next/navigation";
import { useContext, useEffect, type ReactNode } from "react";
import { AuthReadyContext } from "../../app/providers";
import { useAuthStore } from "../../stores/auth-store";

export function SessionGate({ children, mode }: { children: ReactNode; mode: "guest" | "member" }) {
  const ready = useContext(AuthReadyContext);
  const signedIn = Boolean(useAuthStore((state) => state.accessToken));
  const router = useRouter();
  const redirectTo = mode === "member" && !signedIn ? "/login" : mode === "guest" && signedIn ? "/" : null;

  useEffect(() => {
    if (ready && redirectTo) router.replace(redirectTo);
  }, [ready, redirectTo, router]);

  return ready && !redirectTo ? children : <p role="status">로그인 상태 확인 중...</p>;
}
