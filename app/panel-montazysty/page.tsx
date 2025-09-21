import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Page() {
  const s = await getSession();
  if (!s) redirect("/login");
  return <main className="p-6">Panel MONTAŻYSTY</main>;
}
