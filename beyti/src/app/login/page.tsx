import { redirect } from "next/navigation";

export default function LoginRedirectPage() {
  redirect("/login/user-login");
}
