"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

type Ingredient = {
  name: string;
  qty?: number;
  unit?: string;
  unit_family?: string;
};

type ShoppingListProps = {
  recipeId: string;
  recipeIngredients: Ingredient[];
};

export default function ShoppingList({ recipeId, recipeIngredients }: ShoppingListProps) {
  const [pantryItems, setPantryItems] = useState<any[]>([]);
  const [shoppingList, setShoppingList] = useState<Ingredient[]>([]);
  const [available, setAvailable] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [showList, setShowList] = useState(false);

  const generateShoppingList = async () => {
    setLoading(true);
    setShowList(true);
    
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData?.user?.id;
    
    if (!uid) {
      setLoading(false);
      return;
    }

    // Fetch user's pantry items
    const { data: pantry } = await supabase
      .from('pantry_item')
      .select('*')
      .eq('user_id', uid);

    setPantryItems(pantry || []);

    // Compare recipe ingredients with pantry
    const missing: Ingredient[] = [];
    const have: Ingredient[] = [];

    for (const ingredient of recipeIngredients) {
      const ingredientName = ingredient.name.toLowerCase().trim();
      
      // Check if we have this ingredient in pantry
      const pantryMatch = (pantry || []).find((item: any) => {
        const itemName = item.name.toLowerCase().trim();
        // Simple matching - check if names contain each other or are exact match
        return itemName === ingredientName || 
               itemName.includes(ingredientName) || 
               ingredientName.includes(itemName);
      });

      if (pantryMatch) {
        // Check if we have enough quantity
        if (ingredient.qty && pantryMatch.qty) {
          if (pantryMatch.qty >= ingredient.qty) {
            have.push(ingredient);
          } else {
            // Have some, but not enough
            missing.push({
              ...ingredient,
              qty: ingredient.qty - pantryMatch.qty,
              name: `${ingredient.name} (need ${ingredient.qty - pantryMatch.qty} more)`
            });
          }
        } else {
          have.push(ingredient);
        }
      } else {
        missing.push(ingredient);
      }
    }

    setShoppingList(missing);
    setAvailable(have);
    setLoading(false);
  };

  const exportList = () => {
    const text = shoppingList.map(item => {
      const qty = item.qty ? `${item.qty} ` : '';
      const unit = item.unit ? `${item.unit} ` : '';
      return `• ${qty}${unit}${item.name}`;
    }).join('\n');

    navigator.clipboard.writeText(text);
    alert('Shopping list copied to clipboard!');
  };

  return (
    <div className="space-y-4">
      <Button 
        onClick={generateShoppingList} 
        disabled={loading}
        variant="gradient"
      >
        {loading ? 'Checking Pantry...' : '🛒 Generate Shopping List'}
      </Button>

      {showList && (
        <div className="space-y-4">
          {available.length > 0 && (
            <Card>
              <CardHeader title={`✓ Already Have (${available.length})`} />
              <CardBody>
                <ul className="space-y-2">
                  {available.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span className="text-gray-600 line-through">
                        {item.qty ? `${item.qty} ` : ''}{item.unit ?? ''} {item.name}
                      </span>
                      <Badge tone="green">In pantry</Badge>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          )}

          {shoppingList.length > 0 ? (
            <Card>
              <CardHeader 
                title={`🛒 Need to Buy (${shoppingList.length})`}
                actions={
                  <Button size="sm" variant="secondary" onClick={exportList}>
                    📋 Copy List
                  </Button>
                }
              />
              <CardBody>
                <ul className="space-y-2">
                  {shoppingList.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-aquamarine-500 rounded"
                      />
                      <span className="font-medium text-gray-900">
                        {item.qty ? `${item.qty} ` : ''}{item.unit ?? ''} {item.name}
                      </span>
                      <Badge tone="amber">Need</Badge>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          ) : (
            <Card>
              <CardBody className="text-center py-8">
                <p className="text-green-600 font-semibold text-lg">🎉 You have everything!</p>
                <p className="text-gray-600 mt-2">All ingredients are in your pantry.</p>
              </CardBody>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

