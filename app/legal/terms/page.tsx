export const metadata = {
  title: 'Terms of Service - Anni AI',
  description: 'Terms and conditions for using our services.',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto prose prose-gray dark:prose-invert">
        <h1>Terms of Service</h1>
        <p className="lead">Last updated: January 2025</p>
        
        <h2>Acceptance of Terms</h2>
        <p>
          By accessing and using Anni AI services, you accept and agree to be bound by the terms
          and provision of this agreement.
        </p>
        
        <h2>Use License</h2>
        <p>
          Permission is granted to temporarily use Anni AI services for personal or commercial use.
          This is the grant of a license, not a transfer of title.
        </p>
        
        <h2>Service Availability</h2>
        <p>
          We strive to maintain high service availability but do not guarantee uninterrupted access.
          Scheduled maintenance and updates may cause temporary service interruptions.
        </p>
        
        <h2>User Responsibilities</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account credentials and
          for all activities under your account.
        </p>
        
        <h2>Limitation of Liability</h2>
        <p>
          Anni AI shall not be liable for any indirect, incidental, special, consequential, or
          punitive damages resulting from your use of our services.
        </p>
        
        <h2>Contact Information</h2>
        <p>
          Questions about the Terms of Service should be sent to us at legal@anni.ai.
        </p>
      </div>
    </div>
  );
}