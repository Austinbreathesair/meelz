export type NormalizedMeal = {
  id: string;
  title: string;
  image_url?: string | null;
  description?: string | null;
  tags?: string[];
  category?: string | null;
  ingredients: Array<{ name: string; qty?: number | null; unit?: string | null; unit_family?: 'mass'|'volume'|'count'|null; notes?: string | null; position: number }>;
  instructions: Array<{ step_no: number; text: string }>;
};

const UNIT_MAP: Record<string, { unit: string; family: 'mass'|'volume'|'count' } > = {
  g: { unit: 'g', family: 'mass' }, gram: { unit: 'g', family: 'mass' }, grams: { unit: 'g', family: 'mass' },
  kg: { unit: 'kg', family: 'mass' },
  ml: { unit: 'ml', family: 'volume' }, milliliter: { unit: 'ml', family: 'volume' }, milliliters: { unit: 'ml', family: 'volume' },
  l: { unit: 'l', family: 'volume' }, liter: { unit: 'l', family: 'volume' }, liters: { unit: 'l', family: 'volume' },
  tsp: { unit: 'tsp', family: 'volume' }, teaspoon: { unit: 'tsp', family: 'volume' }, teaspoons: { unit: 'tsp', family: 'volume' },
  tbsp: { unit: 'tbsp', family: 'volume' }, tablespoon: { unit: 'tbsp', family: 'volume' }, tablespoons: { unit: 'tbsp', family: 'volume' },
  cup: { unit: 'cup', family: 'volume' }, cups: { unit: 'cup', family: 'volume' },
  piece: { unit: 'count', family: 'count' }, pieces: { unit: 'count', family: 'count' }
};

function normalizeUnitWord(word: string) {
  return word.toLowerCase().replace(/\./g, '');
}

function parseMeasure(measure: string): { qty?: number; unit?: string; unit_family?: 'mass'|'volume'|'count'; notes?: string } {
  const m = measure.trim();
  if (!m) return {};
  // Try to parse simple amounts like "1", "1.5", "1/2", or "1 1/2"
  const frac = (s: string) => {
    const [a, b] = s.split('/').map(Number);
    if (!isFinite(a) || !isFinite(b) || b === 0) return NaN;
    return a / b;
  };
  let qty: number | undefined;
  let rest = '';
  const parts = m.split(' ');
  if (parts.length === 1) {
    if (/^\d+(?:[.,]\d+)?$/.test(parts[0])) qty = Number(parts[0].replace(',', '.'));
    else if (/^\d+\/\d+$/.test(parts[0])) qty = frac(parts[0]);
    else rest = m;
  } else {
    // e.g., "1 1/2 cup" or "2 tbsp"
    if (/^\d+$/.test(parts[0]) && /^\d+\/\d+$/.test(parts[1])) {
      const whole = Number(parts[0]);
      const f = frac(parts[1]);
      if (isFinite(whole) && isFinite(f)) qty = whole + f;
      rest = parts.slice(2).join(' ');
    } else if (/^\d+(?:[.,]\d+)?$/.test(parts[0])) {
      qty = Number(parts[0].replace(',', '.'));
      rest = parts.slice(1).join(' ');
    } else if (/^\d+\/\d+$/.test(parts[0])) {
      qty = frac(parts[0]);
      rest = parts.slice(1).join(' ');
    } else {
      rest = m;
    }
  }
  const unitWord = rest.trim();
  let unit: string | undefined;
  let unit_family: 'mass'|'volume'|'count' | undefined;
  if (unitWord) {
    const key = normalizeUnitWord(unitWord.split(' ')[0]);
    if (UNIT_MAP[key]) {
      unit = UNIT_MAP[key].unit;
      unit_family = UNIT_MAP[key].family;
    } else {
      unit = unitWord; // unknown, keep as text
    }
  }
  if (qty == null && !unit) return { notes: m };
  return { qty, unit, unit_family, notes: unit ? undefined : m };
}

export async function fetchMealDetails(id: string): Promise<NormalizedMeal | null> {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(id)}`);
  if (!res.ok) return null;
  const json = await res.json();
  const meal = json?.meals?.[0];
  if (!meal) return null;

  const title: string = meal.strMeal;
  const image_url: string | null = meal.strMealThumb || null;
  const desc: string | null = meal.strArea && meal.strCategory ? `${meal.strArea} • ${meal.strCategory}` : meal.strCategory || meal.strArea || null;
  const tags: string[] = (meal.strTags ? String(meal.strTags).split(',').map((s: string) => s.trim()).filter(Boolean) : []);
  const category: string | null = meal.strCategory || null;

  const ingredients: NormalizedMeal['ingredients'] = [];
  for (let i = 1; i <= 20; i++) {
    const name = (meal[`strIngredient${i}`] as string | undefined)?.trim();
    if (!name) continue;
    const measure = (meal[`strMeasure${i}`] as string | undefined)?.trim() || '';
    const parsed = parseMeasure(measure);
    ingredients.push({ name, qty: parsed.qty ?? null, unit: parsed.unit ?? null, unit_family: parsed.unit_family ?? null, notes: parsed.notes ?? null, position: ingredients.length + 1 });
  }

  const instructions: NormalizedMeal['instructions'] = [];
  const instrRaw: string = meal.strInstructions || '';
  const steps = instrRaw
    .split(/\r?\n+/)
    .map((s: string) => s.trim())
    .filter(Boolean);
  steps.forEach((text, idx) => instructions.push({ step_no: idx + 1, text }));

  return { id, title, image_url, description: desc, tags, category, ingredients, instructions };
}
