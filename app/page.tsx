import { Hero } from '@/components/hero';
import { BenefitsHierarchy } from '@/components/benefits-hierarchy';
import { ServicesGrid } from '@/components/services-grid';
import { InteractiveDemo } from '@/components/interactive-demo';
import { SocialProof } from '@/components/social-proof';
import { UseCases } from '@/components/use-cases';
import { HowItWorks } from '@/components/how-it-works';
import { FAQAccordion } from '@/components/faq-accordion';
import { ContactSection } from '@/components/contact-section';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 1. Hook visitors with problem-focused hero */}
      <Hero />
      
      {/* 2. Build credibility with benefits and ROI */}
      <BenefitsHierarchy />
      
      {/* 3. Show concrete solutions */}
      <ServicesGrid />
      
      {/* 4. Interactive proof of concept */}
      <InteractiveDemo />
      
      {/* 5. Leverage social proof and pilot program */}
      <SocialProof />
      
      {/* 6. Address common use cases */}
      <UseCases />
      
      {/* 7. Explain simple process */}
      <HowItWorks />
      
      {/* 8. Handle objections with FAQ */}
      <FAQAccordion />
      
      {/* 9. Final conversion push */}
      <ContactSection />
    </div>
  );
}