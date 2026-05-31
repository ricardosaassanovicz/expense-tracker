/** Formata centavos como "R$ 1.234,56". */
export function formatCents(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/** Converte uma string com apenas dígitos vinda do input em centavos. */
export function digitsToCents(digits: string): number {
  const onlyDigits = digits.replace(/\D/g, "");
  if (!onlyDigits) return 0;
  return Number.parseInt(onlyDigits, 10);
}

/**
 * Recebe a string atual do input e devolve formatada como moeda BR
 * (sem símbolo) preservando a digitação progressiva — ex.: "1" → "0,01",
 * "12" → "0,12", "1234" → "12,34".
 */
export function formatMoneyInput(raw: string): string {
  const cents = digitsToCents(raw);
  const reais = (cents / 100).toFixed(2);
  return reais
    .replace(".", ",")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
