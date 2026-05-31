import { redirect } from "next/navigation";

import { HistoryView } from "./history-view";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Histórico — Bolso",
};

export default async function HistoryPage() {
  if (!isSupabaseConfigured) redirect("/");

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return <HistoryView />;
}
