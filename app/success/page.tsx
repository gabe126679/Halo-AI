import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata = {
  title: 'Success - Halo AI',
  description: 'Thank you for your submission.',
};

export default function SuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
          <p className="text-lg text-muted-foreground mb-8">
            We've received your submission and will get back to you within 24 hours.
          </p>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            In the meantime, explore our services or check out our pricing options.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/">Back to Home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}