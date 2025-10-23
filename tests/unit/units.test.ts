import { describe, it, expect } from 'vitest';
import { scaleIngredients, convertQty, massToVolume, volumeToMass } from '@/lib/units';

describe('units', () => {
  it('scales ingredients by servings', () => {
    const base = [{ name: 'flour', qty: 100, unit: 'g' }];
    const out = scaleIngredients(base, 2, 4);
    expect(out[0].qty).toBe(200);
  });

  it('converts mass units', () => {
    expect(convertQty(1, 'kg', 'g', 'mass')).toBe(1000);
  });

  it('density conversions', () => {
    expect(volumeToMass(100, 1)).toBe(100);
    expect(massToVolume(100, 2)).toBe(50);
  });
});

