import { createFileRoute, Outlet, Navigate, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth-store";
import { AccountPage } from "../../components/auth/account-page";
export const Route = createFileRoute("/(authenticated)/_auth")({
  beforeLoad: () => { if (!useAuthStore.getState().accessToken) throw redirect({ to: "/login" }); },
  component: AuthLayout,
});
function AuthLayout() {
  const token = useAuthStore(s => s.accessToken);
  // Also react when an API response expires the current session.
  if (!token) return <Navigate to="/login" replace />;
  return <AccountPage><Outlet /></AccountPage>;
}
