import { create } from "zustand";
import { persist } from "zustand/middleware";
export const useAuthStore = create<{ accessToken: string | null; setAccessToken: (token: string | null) => void }>()(
  persist((set) => ({ accessToken: null, setAccessToken: (accessToken) => set({ accessToken }) }), { name: "umcine-auth-store" }),
);
// The server verifies the token; decoding only supplies the member ID for the ratings URL.
export function getMemberId(token: string | null): number | null {
  try {
    const payload = JSON.parse(atob(token!.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    const id = Number(payload.sub);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
  } catch { return null; }
}
