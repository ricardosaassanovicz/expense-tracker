"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useCategories } from "@/lib/queries/categories";
import { useMonthExpenses } from "@/lib/queries/expenses";
import { formatCents } from "@/lib/utils-app/currency";
import { currentMonthRange, shortDate } from "@/lib/utils-app/date";

export function HistoryView() {
  const { data: categories = [] } = useCategories();

  const [startDate, setStartDate] = useState(() => currentMonthRange().start);
  const [endDate, setEndDate] = useState(() => currentMonthRange().end);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: expenses = [], isLoading } = useMonthExpenses(
    startDate || currentMonthRange().start,
    endDate || currentMonthRange().end
  );

  const filteredExpenses = useMemo(() => {
    if (selectedCategory === "all") return expenses;
    if (selectedCategory === "none") return expenses.filter((e) => !e.category?.id);
    return expenses.filter((e) => e.category?.id === selectedCategory);
  }, [expenses, selectedCategory]);

  const total = filteredExpenses.reduce((acc, e) => acc + e.amount, 0);

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-background/80 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <Button
            render={<Link href="/" />}
            nativeButton={false}
            variant="ghost"
            size="icon"
            aria-label="Voltar"
          >
            <ArrowLeft className="size-5" />
          </Button>
          <h1 className="font-heading text-lg font-semibold tracking-tight">
            Histórico
          </h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-md flex-1 space-y-4 px-4 py-4">
        <Card>
          <CardContent className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="start">Data Inicial</Label>
                <Input
                  id="start"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="end">Data Final</Label>
                <Input
                  id="end"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="category">Categoria</Label>
              <select
                id="category"
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">Todas as categorias</option>
                <option value="none">Sem categoria</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between px-1">
          <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Total do período
          </h2>
          <span className="font-heading text-lg font-bold tabular-nums">
            {formatCents(total)}
          </span>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Carregando gastos...
            </CardContent>
          </Card>
        ) : filteredExpenses.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Nenhum gasto encontrado para os filtros aplicados.
            </CardContent>
          </Card>
        ) : (
          <Card className="py-0">
            <CardContent className="py-2">
              <ul className="divide-y">
                {filteredExpenses.map((e) => (
                  <li
                    key={e.id}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="size-3 shrink-0 rounded-full"
                        style={{
                          backgroundColor: e.category?.color ?? "#94a3b8",
                        }}
                        aria-hidden
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {e.description || e.category?.name || "Gasto"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {e.category?.name ?? "Sem categoria"} ·{" "}
                          {shortDate(e.date)}
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
        )}
      </main>
    </div>
  );
}
