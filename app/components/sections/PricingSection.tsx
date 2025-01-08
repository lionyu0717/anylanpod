import { PricingCard } from '../cards/PricingCard';

export const PricingSection = () => (
  <section className="py-20 bg-gray-50">
    <div className="container mx-auto px-4">
      <h2 className="text-4xl font-bold text-center mb-16">Simple Pricing</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <PricingCard
          title="Basic"
          price="Free"
          features={[
            "1 language",
            "Daily news podcast",
            "Basic vocabulary tools",
            "Community support"
          ]}
        />
        <PricingCard
          title="Pro"
          price="$9.99/mo"
          features={[
            "3 languages",
            "Unlimited podcasts",
            "Advanced learning tools",
            "Progress tracking",
            "Priority support"
          ]}
          highlighted={true}
        />
        <PricingCard
          title="Enterprise"
          price="Custom"
          features={[
            "Unlimited languages",
            "Custom content",
            "API access",
            "Dedicated support",
            "Custom integrations"
          ]}
        />
      </div>
    </div>
  </section>
); 