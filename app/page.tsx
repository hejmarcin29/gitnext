import { currentUser } from "@/lib/currentUser";
import { redirect } from "next/navigation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/login");
  }

  redirect(user.role === "ADMIN" ? "/panel-admin" : "/panel-montazysty");
}
