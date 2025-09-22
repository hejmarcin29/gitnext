"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const search = useSearchParams();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      toast.error(data?.error ?? "Błąd logowania");
      return;
    }
    toast.success("Zalogowano");
    const next = search.get("next") || data?.to || "/dashboard";
    router.replace(next);
  }

  return (
    <main className="min-h-dvh grid place-items-center p-4 sm:p-6 bg-background">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 sm:space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-xl sm:text-2xl font-semibold">Logowanie</h1>
          <p className="text-sm text-muted-foreground">Zaloguj się do systemu B2B</p>
        </div>
        <div className="space-y-4">
          <Input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="h-11 sm:h-10"
          />
          <Input 
            type="password" 
            placeholder="Hasło" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="h-11 sm:h-10"
          />
        </div>
        <Button 
          disabled={loading} 
          className="w-full h-11 sm:h-10 text-base sm:text-sm font-medium"
        >
          {loading ? "Logowanie..." : "Zaloguj się"}
        </Button>
      </form>
    </main>
  );
}
