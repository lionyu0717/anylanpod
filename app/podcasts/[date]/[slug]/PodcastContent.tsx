'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import type { TTSRecord, Translation } from '@/types/database';
import AudioPlayer from '@/components/audioplayer';

interface PodcastContentProps {
  podcast: TTSRecord;
}

export function PodcastContent({ podcast }: PodcastContentProps) {
  const [showOriginal, setShowOriginal] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [translation, setTranslation] = useState<Translation | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  // Initialize translation from podcast.learning_guide if it exists
  useEffect(() => {
    // Parse learning_guide if it's a string
    if (typeof podcast.learning_guide === 'string') {
      try {
        const parsedGuide = JSON.parse(podcast.learning_guide);
        setTranslation(parsedGuide);
      } catch (e) {
        console.error('Error parsing learning guide:', e);
      }
    } else if (podcast.learning_guide) {
      setTranslation(podcast.learning_guide);
    }
  }, [podcast.learning_guide]);

  const handleTranslate = async () => {
    // If translation exists, just toggle visibility
    if (translation) {
      setShowTranslation(true);
      return;
    }

    setIsTranslating(true);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: podcast.script,
          id: podcast.id,
          targetLanguage: 'zh-CN'
        })
      });

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.statusText}`);
      }

      const data: Translation = await response.json();
      if (data && data.translation) {
        setTranslation(data);
        setShowTranslation(true);
      }
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col gap-4 mb-8 max-w-4xl mx-auto">
        <AudioPlayer src={podcast.s3_url} />
      </div>

      <div className="flex gap-8">
        {/* Original Text Section */}
        {showOriginal && (
          <div className={`prose prose-lg dark:prose-invert ${showTranslation ? 'w-1/3' : 'max-w-4xl mx-auto'}`}>
            {podcast.script.split('\n').map((paragraph, index) => (
              <p key={`original-${index}`} className="mb-4">{paragraph}</p>
            ))}
          </div>
        )}

        {/* Translation Section */}
        {showTranslation && translation && translation.translation && (
          <div className={`prose prose-lg dark:prose-invert ${showOriginal ? 'w-2/3' : 'max-w-4xl mx-auto'}`}>
            <div className="border-l pl-8">
              {(translation.translation || '').split('\n').map((paragraph, index) => (
                <p key={`translation-${index}`} className="mb-4">{paragraph}</p>
              ))}
            </div>

            {translation.notes && translation.notes.length > 0 && (
              <div className="border-t pt-8 mt-8">
                <h3 className="text-xl font-semibold mb-4">Language Notes</h3>
                <div className="space-y-4">
                  {translation.notes.map((note, index) => (
                    <div key={index} className="bg-muted/50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium">{note.term}</div>
                        <div className="text-primary">{note.translation}</div>
                      </div>
                      <p className="text-sm text-muted-foreground">{note.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center gap-4 my-8">
        <Button
          onClick={() => setShowOriginal(!showOriginal)}
          variant="outline"
        >
          {showOriginal ? 'Hide Text' : 'Show Text'}
        </Button>
        
        {translation ? (
          <Button
            onClick={() => setShowTranslation(!showTranslation)}
            variant="outline"
          >
            {showTranslation ? 'Hide Explanation' : 'Show Explanation'}
          </Button>
        ) : (
          <Button 
            onClick={handleTranslate}
            disabled={isTranslating}
            className="gap-2"
          >
            {isTranslating ? (
              <>
                <span className="animate-spin">⚡</span>
                Translating...
              </>
            ) : (
              'Learn More'
            )}
          </Button>
        )}
      </div>

      {/* Voice Details */}
      <div className="mt-8 pt-8 border-t max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Voice Details</h2>
        <dl className="grid grid-cols-2 gap-4">
          <dt className="text-muted-foreground">Voice Name</dt>
          <dd>{podcast.voice_name}</dd>
          <dt className="text-muted-foreground">Voice Gender</dt>
          <dd className="capitalize">{podcast.voice_gender.toLowerCase()}</dd>
        </dl>
      </div>
    </div>
  );
}