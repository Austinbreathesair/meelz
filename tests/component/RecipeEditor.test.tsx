/* eslint-env jest */
import RecipePage from '@/app/(authed)/recipes/[id]/page';

describe('Recipe detail', () => {
  it('loads server component (placeholder)', () => {
    // Just a type-level import sanity; server components not rendered in RTL
    expect(RecipePage).toBeDefined();
  });
});
