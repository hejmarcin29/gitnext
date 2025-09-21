import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/LogoutButton";

export default async function Page() {
  const s = await getSession();
  if (!s) redirect("/login");
  if (s.user.role !== "ADMIN") redirect("/panel-montazysty");
  return (
    <main className="p-6">
      <div className="flex justify-between items-center">
        <h1>Panel ADMIN</h1>
        <LogoutButton />
      </div>
    </main>
  );
}
