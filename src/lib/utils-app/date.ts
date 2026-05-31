/** "yyyy-mm-dd" para a data informada (default = hoje, fuso local). */
export function toISODate(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Primeiro e último dia do mês atual no formato ISO yyyy-mm-dd. */
export function currentMonthRange(now: Date = new Date()): {
  start: string;
  end: string;
} {
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { start: toISODate(start), end: toISODate(end) };
}

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function currentMonthLabel(now: Date = new Date()): string {
  return `${MONTHS[now.getMonth()]} de ${now.getFullYear()}`;
}

/** "12/05" a partir de "2026-05-12". */
export function shortDate(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}
