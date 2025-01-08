import { BenefitCard } from '../cards/BenefitCard';

export const BenefitsSection = () => (
  <section className="py-20">
    <div className="container mx-auto px-4">
      <h2 className="text-4xl font-bold text-center mb-16">Educational Benefits</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <BenefitCard
          title="Vocabulary Acquisition"
          description="Learn new words in context through real-world news stories."
        />
        <BenefitCard
          title="Listening Comprehension"
          description="Improve your listening skills with clear, professional audio."
        />
        <BenefitCard
          title="Real-World Context"
          description="Experience language as it's actually used in current events."
        />
        <BenefitCard
          title="Progress Tracking"
          description="Monitor your improvement with detailed learning analytics."
        />
      </div>
    </div>
  </section>
); 