import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import slugify from 'slugify';
import { format, isValid, parseISO } from 'date-fns';
import { TTSRecord } from '@/types/database';
import { getTTSRecordById } from '@/models/tts-record';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import AudioPlayer from '../../components/AudioPlayer';

interface Props {
  params: { date: string; slug: string }
}

async function validatePodcast(date: string, slug: string) {
  // Validate date format
  const parsedDate = parseISO(date);
  if (!isValid(parsedDate)) {
    console.log('Invalid date:', date);
    return null;
  }

  // Extract UUID from slug using regex
  const uuidMatch = slug.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  if (!uuidMatch) {
    console.log('No valid UUID found in slug:', slug);
    return null;
  }
  const id = uuidMatch[0];
  console.log('Extracted UUID:', id);
  
  try {
    const podcast = await getTTSRecordById(id);
    if (!podcast) {
      console.log('No podcast found with ID:', id);
      return null;
    }

    // Validate the date matches
    const podcastDate = new Date(podcast.created_at);
    const expectedDate = format(podcastDate, 'yyyy-MM-dd');
    if (date !== expectedDate) {
      console.log('Date mismatch:', { expected: expectedDate, actual: date });
      return null;
    }

    // Get the first sentence, being careful with periods in abbreviations
    const sentences = podcast.script.match(/[^.!?]+[.!?]+/g) || [];
    const firstSentence = sentences[0]?.trim() || podcast.script;
    const expectedSlug = `${slugify(firstSentence, { 
      lower: true, 
      strict: true,
      remove: /[*+~.()'"!:@]/g
    })}-${podcast.id}`;
    
    console.log('Comparing slugs:');
    console.log('Expected:', expectedSlug);
    console.log('Actual:', slug);
    
    // Validate that the podcast's title matches the URL slug
    if (slug !== expectedSlug) {
      console.log('Slug mismatch');
      return null;
    }

    return podcast;
  } catch (error) {
    console.error('Error in validatePodcast:', error);
    return null;
  }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { date, slug } = await Promise.resolve(params);
  const podcast = await validatePodcast(date, slug);
  
  if (!podcast) {
    return { title: 'Podcast Not Found' };
  }

  const firstSentence = podcast.script.split('.')[0];
  const restOfContent = podcast.script.split('.').slice(1, 3).join('.').trim();

  return {
    title: `${firstSentence} | AnyLangPod`,
    description: restOfContent,
    openGraph: {
      title: firstSentence,
      description: restOfContent,
      type: 'article',
      publishedTime: podcast.created_at,
      authors: ['AnyLangPod'],
    },
    twitter: {
      card: 'summary_large_image',
      title: firstSentence,
      description: restOfContent,
    },
  }
}

export default async function PodcastPage({ params }: Props) {
  const { date, slug } = await Promise.resolve(params);
  const podcast = await validatePodcast(date, slug);
  
  if (!podcast) {
    notFound();
  }

  const title = podcast.script.split('.')[0];
  // Format the keyword - if it contains 'OR', split and format as a list
  const keywords = podcast.keyword
    .split(/\s+OR\s+/)
    .map(k => k.trim())
    .join(', ');

  return (
    <>
      <Header />
      <div className="flex-1">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <nav className="text-sm text-muted-foreground">
            <Link href="/podcasts" className="hover:text-foreground">
              Podcasts
            </Link>
            <span className="mx-2">/</span>
            <time dateTime={date} className="hover:text-foreground">
              {format(parseISO(date), 'MMMM d, yyyy')}
            </time>
            <span className="mx-2">/</span>
            <span className="text-foreground">{title}</span>
          </nav>
        </div>

        {/* Hero section */}
        <div className="border-b">
          <div className="container mx-auto px-4 py-16 max-w-3xl">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-2">
                <h1 className="text-5xl font-bold">{title}</h1>
                <p className="text-lg text-muted-foreground">Topics: {keywords}</p>
              </div>
              <Button variant="outline" size="icon" title="Share">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-4 text-lg text-muted-foreground mt-4">
              <span>Language: {podcast.language_code}</span>
              <span className="capitalize">Difficulty: {podcast.difficulty}</span>
              <time dateTime={podcast.created_at}>
                {format(new Date(podcast.created_at), 'MMMM d, yyyy')}
              </time>
            </div>
          </div>
        </div>

        {/* Content section */}
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <div className="mb-8">
            <AudioPlayer src={podcast.s3_url} />
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            {podcast.script.split('\n').map((paragraph: string, index: number) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t">
            <h2 className="text-2xl font-semibold mb-4">Voice Details</h2>
            <dl className="grid grid-cols-2 gap-4">
              <dt className="text-muted-foreground">Voice Name</dt>
              <dd>{podcast.voice_name}</dd>
              <dt className="text-muted-foreground">Voice Gender</dt>
              <dd className="capitalize">{podcast.voice_gender.toLowerCase()}</dd>
            </dl>
          </div>
        </div>
      </div>
    </>
  );
} 