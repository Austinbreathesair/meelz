"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Page, PageHeader } from '@/components/ui/Page';
import { Card, CardBody } from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import Input from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

type Collection = {
  id: string;
  name: string;
};

export default function CollectionsPage() {
  const supabase = createClient();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!userId) return;
      setUid(userId);
      
      const { data } = await supabase
        .from('collection')
        .select('id, name')
        .eq('user_id', userId)
        .order('name');
      
      setCollections(data || []);
    };
    loadData();
  }, [supabase]);

  const createCollection = async () => {
    if (!name.trim() || !uid || loading) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('collection')
        .insert({ user_id: uid, name: name.trim() })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating collection:', error);
        alert('Failed to create collection. Please try again.');
      } else if (data) {
        setCollections([...collections, data]);
        setName('');
      }
    } catch (e) {
      console.error(e);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      createCollection();
    }
  };

  if (!uid) return <div className="p-6">Please sign in.</div>;

  return (
    <Page>
      <PageHeader 
        title="Collections" 
        subtitle="Group recipes for planning and sharing."
        actions={
          <Button variant="gradient" size="sm" onClick={() => setName('')}>
            + New
          </Button>
        }
      />
      
      <Card>
        <CardBody>
          <div className="flex gap-2">
            <Input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="New collection name" 
              className="flex-1"
            />
            <Button 
              onClick={createCollection}
              disabled={loading || !name.trim()}
            >
              {loading ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </CardBody>
      </Card>

      {collections.length === 0 ? (
        <EmptyState 
          title="No collections yet" 
          description="Create a collection to start organizing your recipes."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {collections.map((c) => (
            <Link key={c.id} href={`/recipes/collections/${c.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardBody className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{c.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">View recipes</p>
                  </div>
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </Page>
  );
}
