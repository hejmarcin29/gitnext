import { requireAdmin } from "@/lib/guards";
import { getSession } from "@/lib/session";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MobileNavigation } from "@/components/ui/mobile-navigation";
import { UsersTab } from "./tabs/UsersTab";
import { ClientsTab } from "./tabs/ClientsTab";

export default async function Page({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdmin();
  const session = await getSession();
  const sp = searchParams ? await searchParams : undefined;
  const tab = typeof sp?.tab === 'string' ? sp.tab : 'users';
  
  return (
    <main className="p-4 sm:p-6">
      {/* Header with responsive navigation */}
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Panel administratora</h1>
        <MobileNavigation role="ADMIN" userEmail={session?.user.email || ""} />
      </div>

      {/* Responsive tabs */}
  <Tabs defaultValue={tab === 'clients' ? 'clients' : 'users'} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:grid-cols-none">
          <TabsTrigger value="users" className="text-sm">Użytkownicy</TabsTrigger>
          <TabsTrigger value="clients" className="text-sm">Klienci</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <UsersTab />
        </TabsContent>
        <TabsContent value="clients" className="space-y-4">
          <ClientsTab />
        </TabsContent>
      </Tabs>
    </main>
  );
}
