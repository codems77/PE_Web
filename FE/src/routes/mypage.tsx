import { createFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "../pages/member/profile-page";
import { AccountPage } from "../components/auth/account-page";

export const Route = createFileRoute("/mypage")({
  validateSearch: (search: Record<string, unknown>): { updated?: boolean } => ({ updated: search.updated === true || search.updated === "true" }),
  component: () => <AccountPage><ProfilePage /></AccountPage>,
});
