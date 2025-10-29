"use client";
import { useState } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';

type ShareRecipeProps = {
  recipeId: string;
  recipeTitle: string;
};

export default function ShareRecipe({ recipeId, recipeTitle }: ShareRecipeProps) {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const generateShareLink = async () => {
    setLoading(true);
    
    const supabase = createClient();
    
    // Check if share link already exists
    const { data: existing } = await supabase
      .from('share_link')
      .select('slug')
      .eq('recipe_id', recipeId)
      .maybeSingle();

    let slug = existing?.slug;

    if (!slug) {
      // Generate new slug
      slug = `${recipeId.split('-')[0]}-${Date.now().toString(36)}`;
      
      const { error } = await supabase
        .from('share_link')
        .insert({
          recipe_id: recipeId,
          slug,
          expires_at: null // Never expires
        });

      if (error) {
        console.error('Error creating share link:', error);
        alert('Failed to create share link');
        setLoading(false);
        return;
      }
    }

    const url = `${window.location.origin}/share/${slug}`;
    setShareUrl(url);
    setShowShare(true);
    setLoading(false);
  };

  const copyToClipboard = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  const shareVia = (method: 'whatsapp' | 'email' | 'twitter') => {
    if (!shareUrl) return;

    const text = `Check out this recipe: ${recipeTitle}`;
    const urls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + '\n' + shareUrl)}`,
      email: `mailto:?subject=${encodeURIComponent(recipeTitle)}&body=${encodeURIComponent(text + '\n\n' + shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`
    };

    window.open(urls[method], '_blank');
  };

  return (
    <div className="space-y-4">
      <Button 
        onClick={generateShareLink} 
        disabled={loading}
        variant="secondary"
      >
        {loading ? 'Generating...' : '🔗 Share Recipe'}
      </Button>

      {showShare && shareUrl && (
        <Card>
          <CardBody className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Share Link:</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={shareUrl} 
                  readOnly 
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-sm"
                  onClick={(e) => e.currentTarget.select()}
                />
                <Button size="sm" onClick={copyToClipboard}>
                  📋 Copy
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Share via:</label>
              <div className="flex gap-2 flex-wrap">
                <Button 
                  size="sm" 
                  variant="secondary"
                  onClick={() => shareVia('whatsapp')}
                  className="bg-green-500 hover:bg-green-600 text-white border-0"
                >
                  WhatsApp
                </Button>
                <Button 
                  size="sm" 
                  variant="secondary"
                  onClick={() => shareVia('email')}
                >
                  📧 Email
                </Button>
                <Button 
                  size="sm" 
                  variant="secondary"
                  onClick={() => shareVia('twitter')}
                  className="bg-blue-400 hover:bg-blue-500 text-white border-0"
                >
                  Twitter
                </Button>
              </div>
            </div>

            <p className="text-xs text-gray-500">
              This link is public and can be viewed by anyone with the URL.
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

