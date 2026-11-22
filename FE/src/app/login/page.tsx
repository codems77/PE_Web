import { AccountPage } from "../../components/auth/account-page";
import { SessionGate } from "../../components/auth/session-gate";
import { LoginPage } from "../../screens/auth/login-page";

export default function Page() {
  return <AccountPage><SessionGate mode="guest"><LoginPage /></SessionGate></AccountPage>;
}
