'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { TTSRecord } from '@/types/database';

export function KeywordSection() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<TTSRecord[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchKeywords = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/tts-records/search?keyword=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search keywords');
      const data = await response.json();
      setSuggestions(data);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const query = formData.get('query') as string;

    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: 'en-US',
          difficulty: 'easy',
          voice_name: 'en-US-JennyNeural',
          voice_gender: 'FEMALE',
          timespan: 7,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate podcast');
      }

      const data = await response.json();
      
      // Format the date for the URL
      const date = new Date();
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      
      // Wait a moment to ensure the database record is created
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to the new podcast
      router.push(`/podcasts/${dateStr}/${query.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${data.id}`);
    } catch (err) {
      console.error('Create error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate podcast');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1">
      {/* Hero section */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold mb-4">Create New Podcast</h1>
          <p className="text-xl text-muted-foreground">
            Generate a new AI podcast about any topic in English.
          </p>
        </div>
      </div>

      {/* Form section */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <Input
              name="query"
              placeholder="Enter a topic or query (e.g., 'Latest news about AI' or 'History of Rome')"
              required
              disabled={isLoading}
              className="h-12 text-lg px-4"
              onChange={(e) => searchKeywords(e.target.value)}
            />
            
            {/* Show suggestions if any */}
            {isSearching && (
              <div className="text-sm text-muted-foreground">
                Searching for existing podcasts...
              </div>
            )}
            
            {suggestions.length > 0 && (
              <div className="border rounded-lg p-4 space-y-2">
                <h3 className="font-medium">Similar podcasts found:</h3>
                <div className="space-y-2">
                  {suggestions.map((record) => (
                    <div 
                      key={record.id} 
                      className="flex items-center justify-between p-2 hover:bg-muted rounded-md"
                    >
                      <span>{record.keyword}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          const date = new Date(record.created_at);
                          const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                          router.push(`/podcasts/${dateStr}/${record.keyword.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${record.id}`);
                        }}
                      >
                        Listen
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Podcast...
                </>
              ) : (
                'Generate Podcast'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 