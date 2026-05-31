/**
 * Tenta extrair informações úteis de um texto colado de Pix/SMS bancário.
 * Foco no MVP: valor em centavos e (quando possível) uma descrição curta.
 */
export type ParsedPix = {
  cents: number | null;
  description: string | null;
};

const MONEY_REGEX =
  /(?:r\$\s*)?(\d{1,3}(?:\.\d{3})*(?:,\d{2})|\d+(?:,\d{2})|\d+(?:\.\d{2}))/i;

export function parsePixText(input: string): ParsedPix {
  const text = input.trim();
  if (!text) return { cents: null, description: null };

  let cents: number | null = null;
  const m = text.match(MONEY_REGEX);
  if (m) {
    const raw = m[1]
      .replace(/\./g, "") // remove milhar
      .replace(",", "."); // decimal BR -> ponto
    const value = Number.parseFloat(raw);
    if (!Number.isNaN(value)) {
      cents = Math.round(value * 100);
    }
  }

  // tenta achar nome do recebedor após "para" / "to"
  let description: string | null = null;
  const toMatch = text.match(/(?:para|to|recebedor:?)\s+([A-Z][\w'.\- ]{2,40})/i);
  if (toMatch) {
    description = toMatch[1].trim().replace(/\s+/g, " ");
  }

  return { cents, description };
}
