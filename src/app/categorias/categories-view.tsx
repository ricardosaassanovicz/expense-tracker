"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useCategories, useCreateCategory } from "@/lib/queries/categories";

const PRESET_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#a855f7", // purple
  "#ec4899", // pink
  "#64748b", // slate
];

export function CategoriesView() {
  const { data: categories = [], isLoading } = useCategories();
  const create = useCreateCategory();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);

  function reset() {
    setName("");
    setColor(PRESET_COLORS[0]);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Informe o nome da categoria.");
      return;
    }
    try {
      await create.mutateAsync({ name, color });
      toast.success("Categoria criada!");
      reset();
      setOpen(false);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Falha ao criar categoria.";
      toast.error(msg);
    }
  }

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
          <h1 className="font-heading text-xl font-semibold tracking-tight">
            Categorias
          </h1>
        </div>
        <Button size="lg" onClick={() => setOpen(true)} className="text-base">
          <Plus className="size-5" />
          Nova
        </Button>
      </header>

      <main className="mx-auto w-full max-w-md flex-1 space-y-3 px-4 py-4">
        {isLoading ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Carregando...
            </CardContent>
          </Card>
        ) : categories.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Você ainda não tem categorias.
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-2">
              <ul className="divide-y">
                {categories.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center gap-3 py-3 px-1"
                  >
                    <span
                      className="size-4 shrink-0 rounded-full"
                      style={{ backgroundColor: c.color }}
                      aria-hidden
                    />
                    <span className="flex-1 text-sm font-medium">{c.name}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </main>

      <Dialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) reset();
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Nova categoria</DialogTitle>
            <DialogDescription>
              Escolha um nome e uma cor de destaque.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cat-name">Nome</Label>
              <Input
                id="cat-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex.: Saúde, Mercado..."
                maxLength={40}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label>Cor</Label>
              <div className="grid grid-cols-9 gap-2">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-label={`Cor ${c}`}
                    onClick={() => setColor(c)}
                    className={`relative h-8 w-8 rounded-full transition ${
                      color === c
                        ? "ring-2 ring-offset-2 ring-foreground"
                        : "ring-0"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <DialogFooter className="gap-2">
              <DialogClose render={<Button type="button" variant="ghost" />}>
                Cancelar
              </DialogClose>
              <Button type="submit" disabled={create.isPending}>
                {create.isPending ? "Salvando..." : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
