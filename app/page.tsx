import { currentUser } from "@/lib/currentUser";
import { redirect } from "next/navigation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/login");
  }

  // Panel montażysty został trwale wyłączony – użytkownicy nie-admin trafiają na stronę logowania
  redirect(user.role === "ADMIN" ? "/panel-admin" : "/login");
}
