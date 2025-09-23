import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function Page() {
  const s = await getSession();
  if (!s) redirect("/login");
  // Panel montażysty został trwale wyłączony
  redirect(s.user.role === "ADMIN" ? "/panel-admin" : "/login");
}
