import { z } from 'zod';

export const PantryItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  qty: z.number().optional(),
  unit: z.string().optional(),
  unit_family: z.enum(['mass', 'volume', 'count']).optional(),
  expiry_date: z.string().optional(),
});

export type PantryItem = z.infer<typeof PantryItemSchema>;

