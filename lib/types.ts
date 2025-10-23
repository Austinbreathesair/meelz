export type UUID = string;

export interface Recipe {
  id: UUID;
  author_id: UUID;
  title: string;
  description?: string | null;
  image_url?: string | null;
  base_servings: number;
  is_public: boolean;
}

