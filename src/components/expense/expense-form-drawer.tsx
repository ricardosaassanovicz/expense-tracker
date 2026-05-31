"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Sparkles, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useCategories, useCreateCategory } from "@/lib/queries/categories";
import { useCreateExpense } from "@/lib/queries/expenses";
import { digitsToCents, formatMoneyInput } from "@/lib/utils-app/currency";
import { toISODate } from "@/lib/utils-app/date";
import { parsePixText } from "@/lib/utils-app/parse-pix";

type Props = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
};

export function ExpenseFormDrawer({ open, onOpenChange }: Props) {
  const { data: categories = [] } = useCategories();
  const createExpense = useCreateExpense();
  const createCategory = useCreateCategory();

  const [amountDigits, setAmountDigits] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(() => toISODate());
  const [categorySearch, setCategorySearch] = useState("");
  const [pixText, setPixText] = useState("");
  const [initialCatSet, setInitialCatSet] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  // pré-seleciona primeira categoria quando carregam
  useEffect(() => {
    if (categories.length > 0 && !initialCatSet && open) {
      setCategorySearch(categories[0].name);
      setInitialCatSet(true);
    }
  }, [categories, initialCatSet, open]);

  // reseta ao fechar
  useEffect(() => {
    if (!open) {
      setAmountDigits("");
      setDescription("");
      setDate(toISODate());
      setCategorySearch("");
      setPixText("");
      setInitialCatSet(false);
    }
  }, [open]);

  const amountFormatted = useMemo(
    () => formatMoneyInput(amountDigits || "0"),
    [amountDigits],
  );

  function handleParsePix() {
    if (!pixText.trim()) {
      toast.info("Cole um texto do Pix ou SMS primeiro.");
      return;
    }
    const parsed = parsePixText(pixText);
    let used = false;
    if (parsed.cents && parsed.cents > 0) {
      setAmountDigits(String(parsed.cents));
      used = true;
    }
    if (parsed.description && !description) {
      setDescription(parsed.description);
      used = true;
    }
    if (used) toast.success("Sugestão aplicada — confira antes de salvar.");
    else toast.warning("Não consegui identificar um valor no texto.");
  }

  async function handleQuickAddCategory() {
    const catName = categorySearch.trim();
    if (!catName) return;

    try {
      await createCategory.mutateAsync({
        name: catName,
        color: "#64748b", // Cor padrão rápida
      }) as any;
      toast.success(`Categoria "${catName}" criada com sucesso!`);
    } catch (err) {
      toast.error("Falha ao criar a categoria.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cents = digitsToCents(amountDigits);
    if (cents <= 0) {
      toast.error("Informe um valor maior que zero.");
      return;
    }
    if (!date) {
      toast.error("Informe a data.");
      return;
    }

    let finalCategoryId = null;
    const catName = categorySearch.trim();

    if (catName) {
      const existing = categories.find(
        (c) => c.name.toLowerCase() === catName.toLowerCase()
      );
      if (existing) {
        finalCategoryId = existing.id;
      } else {
        const confirmCreate = window.confirm(
          `A categoria "${catName}" não foi encontrada. Deseja cadastrá-la agora?`
        );
        if (!confirmCreate) return;

        try {
          const newCat = await createCategory.mutateAsync({
            name: catName,
            color: "#64748b", // Cor padrão para novas categorias rápidas
          }) as any;
          if (newCat && typeof newCat === "object") {
            finalCategoryId = Array.isArray(newCat) ? newCat[0]?.id : newCat.id;
          }
        } catch (err) {
          toast.error("Falha ao criar a categoria.");
          return;
        }
      }
    }

    try {
      await createExpense.mutateAsync({
        amount: cents,
        description,
        date,
        category_id: finalCategoryId || null,
      });
      toast.success("Gasto registrado!");
      onOpenChange(false);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Falha ao salvar o gasto.";
      toast.error(msg);
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader className="text-left">
            <DrawerTitle>Novo gasto</DrawerTitle>
            <DrawerDescription>
              Registre rapidamente um gasto que você fez.
            </DrawerDescription>
          </DrawerHeader>

          <form onSubmit={handleSubmit} className="space-y-4 px-4 pb-2">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor</Label>
              <div className="flex items-center gap-2 rounded-md border bg-background px-3 focus-within:ring-2 focus-within:ring-ring/40">
                <span className="text-sm text-muted-foreground">R$</span>
                <input
                  id="amount"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="off"
                  className="h-10 w-full bg-transparent text-right text-lg font-semibold tabular-nums outline-none"
                  value={amountFormatted}
                  onChange={(e) =>
                    setAmountDigits(e.target.value.replace(/\D/g, ""))
                  }
                  onFocus={(e) => e.currentTarget.select()}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                placeholder="Ex.: Mercado, Uber, Cinema..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={120}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <div className="flex items-center gap-1.5 relative">
                  <Input
                    id="category"
                    placeholder="Buscar ou criar..."
                    value={categorySearch}
                    onChange={(e) => {
                      setCategorySearch(e.target.value);
                      setDropdownOpen(true);
                    }}
                    onFocus={() => setDropdownOpen(true)}
                    onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                    autoComplete="off"
                    className="flex-1"
                  />
                  {categorySearch.trim() &&
                    !categories.some(
                      (c) => c.name.toLowerCase() === categorySearch.trim().toLowerCase()
                    ) && (
                      <Button
                        type="button"
                        size="icon"
                        className="shrink-0"
                        onClick={handleQuickAddCategory}
                        disabled={createCategory.isPending}
                        title="Cadastrar categoria"
                      >
                        <Plus className="size-4" />
                      </Button>
                    )}

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-40 overflow-y-auto rounded-md border bg-popover p-1 shadow-md">
                      <button
                        type="button"
                        className="w-full rounded-sm px-2 py-1.5 text-left text-sm text-muted-foreground hover:bg-muted"
                        onClick={() => {
                          setCategorySearch("");
                          setDropdownOpen(false);
                        }}
                      >
                        Sem categoria
                      </button>
                      {categories
                        .filter((c) =>
                          !categorySearch.trim() ||
                          c.name.toLowerCase().includes(categorySearch.trim().toLowerCase())
                        )
                        .map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-muted"
                            onClick={() => {
                              setCategorySearch(c.name);
                              setDropdownOpen(false);
                            }}
                          >
                            <span
                              className="size-2.5 shrink-0 rounded-full"
                              style={{ backgroundColor: c.color }}
                              aria-hidden
                            />
                            <span className="truncate">{c.name}</span>
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2 rounded-lg border bg-muted/40 p-3">
              <Label
                htmlFor="pix"
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                <Sparkles className="size-3.5" />
                Colar texto do Pix / SMS
              </Label>
              <textarea
                id="pix"
                rows={2}
                className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                placeholder="Cole aqui, ex.: 'Pix de R$ 42,90 enviado para LANCHONETE DO ZÉ'"
                value={pixText}
                onChange={(e) => setPixText(e.target.value)}
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={handleParsePix}
              >
                Preencher automaticamente
              </Button>
            </div>
          </form>

          <DrawerFooter className="pt-2">
            <Button
              onClick={handleSubmit}
              disabled={createExpense.isPending || createCategory.isPending}
              className="h-11 text-base"
            >
              {createExpense.isPending || createCategory.isPending ? "Salvando..." : "Salvar gasto"}
            </Button>
            <DrawerClose asChild>
              <Button variant="ghost">Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
