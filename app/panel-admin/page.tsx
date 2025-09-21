import { LogoutButton } from "@/components/LogoutButton";
import { requireAdmin } from "@/lib/guards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersTab } from "./tabs/UsersTab";
import { MontazeTab } from "./tabs/MontazeTab";

export default async function Page() {
  await requireAdmin();
  
  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Panel administratora</h1>
        <LogoutButton />
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Użytkownicy</TabsTrigger>
          <TabsTrigger value="montaze">Montaże</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <UsersTab />
        </TabsContent>

        <TabsContent value="montaze" className="space-y-4">
          <MontazeTab />
        </TabsContent>
      </Tabs>
    </main>
  );
}
