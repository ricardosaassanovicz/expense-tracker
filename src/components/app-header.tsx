"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Tags, List } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AppHeader({ title }: { title: string }) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Falha ao sair. Tente novamente.");
      return;
    }
    router.replace("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-background/80 px-4 py-3 backdrop-blur">
      <h1 className="font-heading text-lg font-semibold tracking-tight">
        {title}
      </h1>
      <div className="flex items-center gap-1">
        <Button
          render={<Link href="/historico" />}
          nativeButton={false}
          variant="ghost"
          size="icon"
          aria-label="Histórico"
        >
          <List className="size-5" />
        </Button>
        <Button
          render={<Link href="/categorias" />}
          nativeButton={false}
          variant="ghost"
          size="icon"
          aria-label="Categorias"
        >
          <Tags className="size-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Sair"
          onClick={handleLogout}
        >
          <LogOut className="size-5" />
        </Button>
      </div>
    </header>
  );
}
