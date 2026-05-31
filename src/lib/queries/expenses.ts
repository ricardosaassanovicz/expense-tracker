"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { ExpenseWithCategory } from "@/lib/supabase/types";

import { queryKeys } from "./keys";

export function useMonthExpenses(start: string, end: string) {
  return useQuery({
    queryKey: queryKeys.expensesByMonth(start, end),
    queryFn: async (): Promise<ExpenseWithCategory[]> => {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("expenses")
        .select("*, category:categories(id,name,color)")
        .gte("date", start)
        .lte("date", end)
        .order("date", { ascending: false });
      if (error) throw error;
      return (data as ExpenseWithCategory[]) ?? [];
    },
  });
}

type CreateExpenseInput = {
  amount: number; // centavos
  description: string;
  date: string; // ISO yyyy-mm-dd
  category_id: string | null;
};

export function useCreateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateExpenseInput) => {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Sessão expirada. Faça login novamente.");

      const { error } = await supabase.from("expenses").insert({
        user_id: user.id,
        amount: input.amount,
        description: input.description.trim(),
        date: input.date,
        category_id: input.category_id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}
