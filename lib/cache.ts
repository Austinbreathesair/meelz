export const twelveHoursMs = 12 * 60 * 60 * 1000;

export function makeKeyHash(ingredients: string[]) {
  return ingredients.map((s) => s.trim().toLowerCase()).sort().join('|');
}

