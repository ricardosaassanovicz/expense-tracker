"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryBreakdown } from "@/components/expense/category-breakdown";
import { ExpenseFormDrawer } from "@/components/expense/expense-form-drawer";
import { ExpenseList } from "@/components/expense/expense-list";

import { useMonthExpenses } from "@/lib/queries/expenses";
import { formatCents } from "@/lib/utils-app/currency";
import { currentMonthLabel, currentMonthRange } from "@/lib/utils-app/date";

export function Dashboard() {
  const [open, setOpen] = useState(false);

  const range = useMemo(() => currentMonthRange(), []);
  const { data: expenses = [], isLoading } = useMonthExpenses(
    range.start,
    range.end,
  );

  const monthLabel = currentMonthLabel();
  const total = expenses.reduce((acc, e) => acc + e.amount, 0);

  return (
    <div className="flex min-h-dvh flex-col pb-28">
      <AppHeader title="Bolso" />

      <main className="mx-auto w-full max-w-md flex-1 space-y-4 px-4 py-4">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="space-y-1 py-5">
            <p className="text-xs uppercase tracking-wide opacity-80">
              Total gasto · {monthLabel}
            </p>
            <p className="font-heading text-3xl font-bold tabular-nums">
              {formatCents(total)}
            </p>
            <p className="text-xs opacity-80">
              {expenses.length}{" "}
              {expenses.length === 1 ? "registro" : "registros"}
            </p>
          </CardContent>
        </Card>

        {isLoading ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Carregando gastos...
            </CardContent>
          </Card>
        ) : (
          <>
            <CategoryBreakdown expenses={expenses} />
            <ExpenseList expenses={expenses} />
          </>
        )}
      </main>

      <Button
        aria-label="Novo gasto"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-1/2 z-20 h-14 w-14 -translate-x-1/2 rounded-full shadow-lg shadow-black/15"
      >
        <Plus className="size-6" />
      </Button>

      <ExpenseFormDrawer open={open} onOpenChange={setOpen} />
    </div>
  );
}
