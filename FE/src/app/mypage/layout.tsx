import type { ReactNode } from "react";
import { AccountPage } from "../../components/auth/account-page";
import { SessionGate } from "../../components/auth/session-gate";

export default function Layout({ children }: { children: ReactNode }) {
  return <AccountPage><SessionGate mode="member">{children}</SessionGate></AccountPage>;
}
