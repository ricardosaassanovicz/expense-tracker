"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatCents } from "@/lib/utils-app/currency";
import { shortDate } from "@/lib/utils-app/date";
import type { ExpenseWithCategory } from "@/lib/supabase/types";

export function ExpenseList({ expenses }: { expenses: ExpenseWithCategory[] }) {
  if (expenses.length === 0) return null;

  return (
    <Card>
      <CardContent className="py-2">
        <h2 className="px-1 pt-2 pb-1 font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Últimos gastos
        </h2>
        <ul className="divide-y">
          {expenses.slice(0, 25).map((e) => (
            <li
              key={e.id}
              className="flex items-center justify-between gap-3 py-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="size-3 shrink-0 rounded-full"
                  style={{ backgroundColor: e.category?.color ?? "#94a3b8" }}
                  aria-hidden
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {e.description || e.category?.name || "Gasto"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {e.category?.name ?? "Sem categoria"} · {shortDate(e.date)}
                  </p>
                </div>
              </div>
              <div className="font-semibold tabular-nums">
                {formatCents(e.amount)}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
