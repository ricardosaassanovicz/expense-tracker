"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatCents } from "@/lib/utils-app/currency";
import type { ExpenseWithCategory } from "@/lib/supabase/types";

type Bucket = {
  categoryId: string;
  name: string;
  color: string;
  total: number;
  count: number;
};

const UNCATEGORIZED_ID = "__uncategorized__";

function aggregate(expenses: ExpenseWithCategory[]): {
  buckets: Bucket[];
  total: number;
} {
  const map = new Map<string, Bucket>();
  let total = 0;

  for (const e of expenses) {
    total += e.amount;
    const id = e.category?.id ?? UNCATEGORIZED_ID;
    const cur =
      map.get(id) ??
      {
        categoryId: id,
        name: e.category?.name ?? "Sem categoria",
        color: e.category?.color ?? "#94a3b8",
        total: 0,
        count: 0,
      };
    cur.total += e.amount;
    cur.count += 1;
    map.set(id, cur);
  }

  const buckets = Array.from(map.values()).sort((a, b) => b.total - a.total);
  return { buckets, total };
}

export function CategoryBreakdown({
  expenses,
}: {
  expenses: ExpenseWithCategory[];
}) {
  const { buckets, total } = aggregate(expenses);

  if (buckets.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Sem gastos neste mês ainda.
          <br />
          Toque no botão <span className="font-semibold">+</span> para registrar
          o primeiro.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="py-0">
      <CardContent className="space-y-4 py-4">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Por categoria
        </h2>
        <ul className="space-y-4">
          {buckets.map((b) => {
            const pct = total === 0 ? 0 : Math.round((b.total / total) * 100);
            return (
              <li key={b.categoryId} className="space-y-1.5">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="size-3 shrink-0 rounded-full"
                      style={{ backgroundColor: b.color }}
                      aria-hidden
                    />
                    <span className="truncate font-medium">{b.name}</span>
                    <span className="text-xs text-muted-foreground">
                      · {b.count}
                    </span>
                  </div>
                  <div className="text-right text-sm">
                    <div className="font-semibold tabular-nums">
                      {formatCents(b.total)}
                    </div>
                    <div className="text-[11px] text-muted-foreground tabular-nums">
                      {pct}%
                    </div>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-[width]"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: b.color,
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
