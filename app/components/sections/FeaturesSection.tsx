import { FeatureCard } from '../cards/FeatureCard';

export const FeaturesSection = () => (
  <section className="py-20 bg-gray-50">
    <div className="container mx-auto px-4">
      <h2 className="text-4xl font-bold text-center mb-16">Why Choose AnyLangPod?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard 
          title="Multiple Proficiency Levels"
          description="From beginner to advanced, get content perfectly matched to your language level."
          icon="📚"
        />
        <FeatureCard 
          title="AI-Powered Content"
          description="Smart summarization and simplification of news articles for optimal learning."
          icon="🤖"
        />
        <FeatureCard 
          title="Real-Time News"
          description="Stay updated with current events while improving your language skills."
          icon="🌍"
        />
      </div>
    </div>
  </section>
); 