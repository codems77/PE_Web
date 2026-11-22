import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "../pages/auth/login-page";
import { AccountPage } from "../components/auth/account-page";

export const Route = createFileRoute("/login")({
  component: () => <AccountPage><LoginPage /></AccountPage>,
});
