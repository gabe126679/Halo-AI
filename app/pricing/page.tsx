import { PricingTable } from '@/components/pricing/pricing-table';

export const metadata = {
  title: 'Pricing - Anni AI',
  description: 'Choose the right plan for your business needs.',
};

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose between monthly service or one-time setup. No hidden fees, no surprises.
          </p>
        </div>
        <PricingTable />
      </div>
    </div>
  );
}