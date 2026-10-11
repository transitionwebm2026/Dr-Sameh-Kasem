import { redirect } from "next/navigation";

// /admin/dashboard's own layout does the client-side auth check (and sends
// signed-out visitors to /admin/login) — this just forwards into it.
export default function AdminIndexPage() {
  redirect("/admin/dashboard");
}
