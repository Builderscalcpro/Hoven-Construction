import { SEO } from '@/components/SEO';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="Privacy Policy"
        description="Privacy policy for Hein Hoven Construction services"
      />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-sm text-gray-600 mb-8">Last updated: October 3, 2025</p>

        <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
            <p>We collect information you provide directly to us, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Name, email address, phone number</li>
              <li>Project details and preferences</li>
              <li>Payment information (processed securely)</li>
              <li>Communication history</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and improve our services</li>
              <li>Process your requests and transactions</li>
              <li>Send you updates about your projects</li>
              <li>Respond to your inquiries</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p>For privacy questions, contact us at: privacy@heinhoven.com</p>
          </section>
        </div>
      </div>
    </div>
  );
}
