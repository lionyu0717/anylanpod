import { HeroSection } from './components/sections/HeroSection';
import { FeaturesSection } from './components/sections/FeaturesSection';
import { BenefitsSection } from './components/sections/BenefitsSection';
import { PricingSection } from './components/sections/PricingSection';
import { CTASection } from './components/sections/CTASection';
import { Footer } from './components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </main>
  );
}
