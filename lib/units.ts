export type UnitFamily = 'mass' | 'volume' | 'count';

export interface IngredientLike {
  name: string;
  qty?: number | null;
  unit?: string | null;
  unit_family?: UnitFamily | null;
}

export function scaleIngredients<T extends IngredientLike>(items: T[], baseServings: number, targetServings: number): T[] {
  if (!baseServings || baseServings <= 0 || !targetServings) return items;
  const factor = targetServings / baseServings;
  return items.map((it) => ({
    ...it,
    qty: typeof it.qty === 'number' ? round(it.qty * factor) : it.qty,
  }));
}

export function round(n: number, p = 2) {
  const f = Math.pow(10, p);
  return Math.round(n * f) / f;
}

// Minimal conversion map for demo; production values come from DB
const MASS_FACTORS: Record<string, number> = { g: 1, kg: 1000 };
const VOL_FACTORS: Record<string, number> = { ml: 1, l: 1000 };

export function convertQty(qty: number, from: string, to: string, family: UnitFamily): number {
  if (family === 'mass') {
    return (qty * (MASS_FACTORS[from] ?? 1)) / (MASS_FACTORS[to] ?? 1);
  }
  if (family === 'volume') {
    return (qty * (VOL_FACTORS[from] ?? 1)) / (VOL_FACTORS[to] ?? 1);
  }
  // count family: keep as is
  return qty;
}

export function volumeToMass(qtyMl: number, gramsPerMl: number) {
  return qtyMl * gramsPerMl;
}

export function massToVolume(qtyG: number, gramsPerMl: number) {
  return qtyG / gramsPerMl;
}

