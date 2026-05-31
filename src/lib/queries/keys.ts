export const queryKeys = {
  categories: ["categories"] as const,
  expensesByMonth: (start: string, end: string) =>
    ["expenses", "month", start, end] as const,
};
