import { createFileRoute } from "@tanstack/react-router";
import { SignupPage } from "../pages/auth/signup-page";
import { AccountPage } from "../components/auth/account-page";

export const Route = createFileRoute("/signup")({
  component: () => <AccountPage><SignupPage /></AccountPage>,
});
