import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import slugify from 'slugify';
import { DifficultyLevel, TTSRecord } from '@/types/database';
import { getTTSRecords, getLanguages } from '@/models/tts-record';
import { Header } from '@/components/header';
import PodcastFilters from './components/PodcastFilters';
import { PlayCircle, Clock, Globe2, BarChart3 } from 'lucide-react';

export const revalidate = 3600; // Revalidate every hour

export const metadata = {
  title: 'Latest AI-Generated Podcasts | AnyLangPod',
  description: 'Browse our collection of AI-generated podcasts about current events and trending topics.',
};

function generatePodcastUrl(article: TTSRecord) {
  // Format the date
  const date = new Date(article.created_at);
  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  
  // Get the first sentence, being careful with periods in abbreviations
  const sentences = article.script.match(/[^.!?]+[.!?]+/g) || [];
  const firstSentence = sentences[0]?.trim() || article.script;
  const slug = slugify(firstSentence, { 
    lower: true, 
    strict: true,
    remove: /[*+~.()'"!:@]/g
  });
  
  // Validate UUID format
  if (!article.id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(article.id)) {
    console.error('Invalid UUID:', article.id);
    throw new Error(`Invalid UUID format: ${article.id}`);
  }
  
  const url = `/podcasts/${dateStr}/${slug}-${article.id}`;
  console.log('Generated URL:', url);
  console.log('From sentence:', firstSentence);
  console.log('Date:', dateStr);
  console.log('UUID:', article.id);
  return url;
}

export default async function PodcastsPage({
  searchParams,
}: {
  searchParams: { language?: string; difficulty?: DifficultyLevel }
}) {
  const { language, difficulty } = await Promise.resolve(searchParams);

  const articles = await getTTSRecords(1, 20, { language, difficulty });
  const languages = await getLanguages();

  return (
    <>
      <Header />
      <div className="flex-1">
        {/* Hero section */}
        <div className="border-b bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 py-16">
            <h1 className="text-5xl font-bold mb-4">Latest Podcasts</h1>
            <p className="text-xl text-muted-foreground">
              Browse our collection of AI-generated podcasts about current events and trending topics.
            </p>
          </div>
        </div>

        {/* Content section */}
        <div className="container mx-auto px-4 py-8">
          <PodcastFilters 
            languages={languages}
            currentLanguage={language}
            currentDifficulty={difficulty}
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles?.map((article) => {
              // Format keywords
              const keywords = article.keyword
                .split(/\s+OR\s+/)
                .map(k => k.trim());

              return (
                <Link 
                  href={generatePodcastUrl(article)}
                  key={article.id}
                  className="group block p-6 bg-card rounded-lg border hover:shadow-lg transition-all hover:border-primary"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                      {article.script.split('.')[0]}
                    </h2>
                    <PlayCircle className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-4" />
                  </div>

                  {/* Keywords */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {keywords.map((keyword, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>

                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {article.script.split('.').slice(1, 2).join('.')}...
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Globe2 className="w-4 h-4" />
                      <span>{article.language_code}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BarChart3 className="w-4 h-4" />
                      <span className="capitalize">{article.difficulty}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDistanceToNow(new Date(article.created_at))} ago</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
} 