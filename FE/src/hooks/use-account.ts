import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/account";
import { useAuthStore } from "../stores/auth-store";
export function useMe() {
  const token = useAuthStore(s => s.accessToken);
  return useQuery({ queryKey: ["members", "me", token], queryFn: getMe, enabled: Boolean(token), staleTime: 5 * 60 * 1000, retry: false });
}
