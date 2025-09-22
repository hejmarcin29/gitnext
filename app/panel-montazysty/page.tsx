import { currentUser } from "@/lib/currentUser";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/LogoutButton";
import { prisma } from "@/lib/prisma";
import { MontazeList } from "./MontazeList";
import { AddPomiarDialog } from "@/components/pomiary/AddPomiarDialog";

export default async function Page() {
  const user = await currentUser();
  if (!user) redirect("/login");

  // Pobierz montaże przypisane do montażysty
  const montaze = await prisma.montaz.findMany({
    where: { montazystaId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Panel montażysty</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <LogoutButton />
        </div>
      </div>

      <MontazeList initialMontaze={montaze} />
    </main>
  );
}
