import { convertQty, UnitFamily, normalizeUnit } from '@/lib/units';

export type PantryItem = {
  name: string;
  qty?: number | null;
  unit?: string | null;
  unit_family?: UnitFamily | null;
};

export type RecipeIng = {
  name: string;
  qty?: number | null;
  unit?: string | null;
  unit_family?: UnitFamily | null;
};

export type ShoppingLine = {
  name: string;
  need_qty?: number | null;
  need_unit?: string | null;
  note?: string | null;
};

function canonicalUnit(family: UnitFamily | null | undefined): string | null {
  if (!family) return null;
  if (family === 'mass') return 'g';
  if (family === 'volume') return 'ml';
  return 'count';
}

export function aggregateIngredients(ings: RecipeIng[]): RecipeIng[] {
  const map = new Map<string, { qty: number; unit: string | null; unit_family: UnitFamily | null }>();
  for (const ing of ings) {
    const key = ing.name.trim().toLowerCase();
    const fam = ing.unit_family ?? null;
    const canon = canonicalUnit(fam);
    let qty = ing.qty ?? 0;
    let unit: string | null = ing.unit ?? null;
    if (canon && unit && unit !== canon) {
      try { qty = convertQty(qty, unit, canon, fam as UnitFamily); unit = canon; } catch {}
    } else if (canon) {
      unit = canon;
    }
    const prev = map.get(key);
    if (prev) {
      prev.qty += qty;
    } else {
      map.set(key, { qty, unit, unit_family: fam });
    }
  }
  return Array.from(map.entries()).map(([name, v]) => ({ name, qty: v.qty, unit: v.unit, unit_family: v.unit_family }));
}

export function computeShoppingList(pantry: PantryItem[], ings: RecipeIng[]): ShoppingLine[] {
  const byName = new Map<string, PantryItem>();
  for (const p of pantry) {
    byName.set(p.name.trim().toLowerCase(), p);
  }

  const out: ShoppingLine[] = [];
  for (const ing of ings) {
    const key = ing.name.trim().toLowerCase();
    const p = byName.get(key);
    const desiredQty = ing.qty ?? null;
    const desiredUnit = normalizeUnit(ing.unit || undefined).unit || ing.unit || null;
    const desiredFamily = ing.unit_family ?? null;

    if (desiredQty == null) {
      out.push({ name: ing.name, need_qty: null, need_unit: desiredUnit || null, note: 'amount unspecified' });
      continue;
    }

    if (!p || p.qty == null) {
      out.push({ name: ing.name, need_qty: desiredQty, need_unit: desiredUnit || null });
      continue;
    }

    // Try to convert pantry qty to recipe unit if same family
    let pantryQty = p.qty as number;
    let pantryUnit = normalizeUnit(p.unit || undefined).unit || p.unit || null;
    const pantryFamily = p.unit_family ?? null;

    if (pantryFamily && desiredFamily && pantryFamily === desiredFamily && pantryUnit && desiredUnit && pantryUnit !== desiredUnit) {
      try { pantryQty = convertQty(pantryQty, pantryUnit, desiredUnit, pantryFamily); } catch {}
    }

    const need = desiredQty - (Number.isFinite(pantryQty) ? pantryQty : 0);
    if (need > 0.0001) {
      out.push({ name: ing.name, need_qty: Math.round(need * 100) / 100, need_unit: desiredUnit || null });
    }
  }

  return out;
}

export function computeShoppingListMerged(pantry: PantryItem[], ings: RecipeIng[]): ShoppingLine[] {
  const agg = aggregateIngredients(ings);
  return computeShoppingList(pantry, agg);
}
