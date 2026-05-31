import { redirect } from "next/navigation";

import { CategoriesView } from "./categories-view";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Categorias — Bolso",
};

export default async function CategoriesPage() {
  if (!isSupabaseConfigured) redirect("/");

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return <CategoriesView />;
}
