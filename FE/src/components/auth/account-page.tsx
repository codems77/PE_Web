import type { ReactNode } from "react";
import "./account.css";

export function AccountPage({ children }: { children: ReactNode }) {
  return <main className="account-page">{children}</main>;
}
