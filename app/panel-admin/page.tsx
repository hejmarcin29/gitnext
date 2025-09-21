import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Page() {
  const s = await getSession();
  if (!s) redirect("/login");
  if (s.user.role !== "ADMIN") redirect("/panel-montazysty");
  return <main className="p-6">Panel ADMIN</main>;
}
