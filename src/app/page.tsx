import { redirect } from "next/navigation";

import { Dashboard } from "./dashboard";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function HomePage() {
  if (!isSupabaseConfigured) {
    return (
      <main className="flex min-h-dvh items-center justify-center px-6">
        <div className="max-w-md space-y-3 text-center">
          <h1 className="font-heading text-xl font-bold">
            Configure o Supabase
          </h1>
          <p className="text-sm text-muted-foreground">
            Crie um arquivo <code>.env.local</code> a partir de{" "}
            <code>.env.local.example</code> com a URL e a anon key do seu
            projeto Supabase para usar o app.
          </p>
        </div>
      </main>
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return <Dashboard />;
}
