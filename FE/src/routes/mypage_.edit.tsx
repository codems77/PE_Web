import { createFileRoute } from "@tanstack/react-router";
import { EditProfilePage } from "../pages/member/edit-profile-page";
import { AccountPage } from "../components/auth/account-page";

export const Route = createFileRoute("/mypage_/edit")({
  component: () => <AccountPage><EditProfilePage /></AccountPage>,
});
