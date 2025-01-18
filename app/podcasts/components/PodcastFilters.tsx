'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { DifficultyLevel } from '@/types/database';

interface PodcastFiltersProps {
  languages: string[];
  currentLanguage?: string;
  currentDifficulty?: DifficultyLevel;
}

export default function PodcastFilters({
  languages,
  currentLanguage,
  currentDifficulty,
}: PodcastFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLanguageChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('language', value);
    } else {
      params.delete('language');
    }
    router.push(`/podcasts?${params.toString()}`);
  };

  const handleDifficultyChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('difficulty', value);
    } else {
      params.delete('difficulty');
    }
    router.push(`/podcasts?${params.toString()}`);
  };

  return (
    <div className="flex gap-4 mb-8">
      <select 
        className="p-2 border rounded"
        onChange={(e) => handleLanguageChange(e.target.value)}
        value={currentLanguage || ''}
      >
        <option value="">All Languages</option>
        {languages.map((language_code) => (
          <option key={language_code} value={language_code}>
            {language_code}
          </option>
        ))}
      </select>

      <select 
        className="p-2 border rounded"
        onChange={(e) => handleDifficultyChange(e.target.value)}
        value={currentDifficulty || ''}
      >
        <option value="">All Difficulties</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
    </div>
  );
} 