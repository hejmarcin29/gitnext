import { currentUser } from "@/lib/currentUser";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/LogoutButton";
import { prisma } from "@/lib/prisma";
import { MontazeList } from "./MontazeList";

export default async function Page() {
  const user = await currentUser();
  if (!user) redirect("/login");

  // Pobierz montaże przypisane do montażysty
  const montaze = await prisma.montaz.findMany({
    where: { montazystaId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Panel montażysty</h1>
        <LogoutButton />
      </div>

      <MontazeList initialMontaze={montaze} />
    </main>
  );
}
