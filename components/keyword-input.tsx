'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface PodcastResponse {
  keyword: string;
  timespan: string;
  urls: string[];
  script: {
    title: string;
    content: string;
  };
  success: boolean;
  tts: {
    local_path: string;
    s3_url: string;
    cached: boolean;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function KeywordSection() {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [podcast, setPodcast] = useState<PodcastResponse | null>(null);

  const validateKeyword = (term: string) => {
    // Check if the keyword is at least 2 characters
    if (term.length < 2) {
      throw new Error('Keyword must be at least 2 characters long');
    }
    // Check if it's not just numbers or special characters
    if (!/[a-zA-Z]/.test(term)) {
      throw new Error('Keyword must contain at least one letter');
    }
  };

  const checkKeyword = async (term: string) => {
    try {
      validateKeyword(term);

      const response = await fetch(
        `/api/keyword-check/${encodeURIComponent(term)}`,
        {
          method: 'GET',
          headers: {
            'accept': 'application/json',
          },
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to check keyword');
      }

      if (!data.found) {
        throw new Error(`No recent news found for "${data.keyword}" in the past ${data.timespan}. Try a different keyword.`);
      }

      return true;
    } catch (err) {
      console.error("Error checking keyword:", err);
      throw err;
    }
  };

  const generatePodcast = async (terms: string[]) => {
    try {
      const query = terms.join(' OR ');
      const response = await fetch(
        `/api/search?query=${encodeURIComponent(query)}`,
        {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            timespan: '1d',
            difficulty: 'easy',
            language: 'en-US',
            generate_tts: true,
            voice_name: 'en-US-Standard-C',
            voice_gender: 'FEMALE'
          })
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        try {
          // Try to parse error as JSON
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || 'Failed to generate podcast');
        } catch (e) {
          // If parsing fails, use the raw error text
          throw new Error(`Failed to generate podcast: ${errorText}`);
        }
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error generating podcast:", err);
      throw err;
    }
  };

  const handleAddKeyword = async (e: React.FormEvent) => {
    e.preventDefault();
    const term = inputValue.trim();
    
    if (!term || keywords.includes(term)) {
      return;
    }

    setIsChecking(true);
    setError("");

    try {
      const exists = await checkKeyword(term);
      if (exists) {
        setKeywords([...keywords, term]);
        setInputValue("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to check keyword. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  const handleGeneratePodcast = async () => {
    if (keywords.length === 0) return;
    
    setIsGenerating(true);
    setError("");

    try {
      const podcastData = await generatePodcast(keywords);
      setPodcast(podcastData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate podcast. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setKeywords(keywords.filter(keyword => keyword !== keywordToRemove));
    if (keywords.length <= 1) {
      setPodcast(null);
    }
  };

  return (
    <section className="py-12">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter">Choose Your Topics</h2>
            <p className="text-muted-foreground">
              Add keywords or phrases to find recent news for your podcast
            </p>
            <p className="text-sm text-muted-foreground/80">
              Keywords are checked against news from the last 24 hours
            </p>
          </div>
          
          <form onSubmit={handleAddKeyword} className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter a keyword or phrase..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1"
              disabled={isChecking || isGenerating}
            />
            <Button type="submit" disabled={isChecking || isGenerating || !inputValue.trim()}>
              {isChecking ? "Checking..." : "Add"}
            </Button>
          </form>

          {error && (
            <div className="text-red-500 text-center">
              {error}
            </div>
          )}

          {keywords.length > 0 && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full"
                  >
                    <span>{keyword}</span>
                    <button
                      onClick={() => removeKeyword(keyword)}
                      className="hover:text-primary/80"
                      disabled={isGenerating}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleGeneratePodcast}
                className="w-full"
                size="lg"
                disabled={isGenerating || keywords.length === 0}
              >
                {isGenerating ? "Generating Podcast..." : "Generate Podcast"}
              </Button>

              {podcast && (
                <div className="space-y-4 bg-card p-6 rounded-lg border">
                  <h3 className="text-xl font-bold">{podcast.script.title}</h3>
                  <div className="mt-4">
                    <audio controls className="w-full">
                      <source src={podcast.tts.s3_url} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {podcast.script.content}
                  </p>
                  <div className="text-sm text-muted-foreground">
                    Based on {podcast.urls.length} articles • Generated {new Date().toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 