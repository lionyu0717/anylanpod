"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

export function KeywordSection() {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const checkKeyword = async (term: string) => {
    try {
      const response = await fetch(`/api/keyword-check?query=${encodeURIComponent(term)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to check keyword');
      }

      return data.exists;
    } catch (err) {
      console.error("Error checking keyword:", err);
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
      } else {
        setError(`Nothing new about "${term}" in the past 24 hours. Try a different term or check your spelling.`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to check keyword. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setKeywords(keywords.filter(keyword => keyword !== keywordToRemove));
  };

  const handleGeneratePodcast = async () => {
    if (keywords.length === 0) return;
    
    setIsGenerating(true);
    setError("");

    try {
      // TODO: Implement podcast generation
      console.log("Generating podcast with keywords:", keywords);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate podcast. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="py-12">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter">Choose Your Topics</h2>
            <p className="text-gray-500">
              Add keywords or phrases to find recent news for your podcast
            </p>
            <p className="text-sm text-gray-400">
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
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 