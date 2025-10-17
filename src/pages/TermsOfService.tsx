import { SEO } from '@/components/SEO';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="Terms of Service"
        description="Terms of service for Hein Hoven Construction"
      />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-sm text-gray-600 mb-8">Last updated: October 3, 2025</p>

        <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">Agreement to Terms</h2>
            <p>By accessing our website and services, you agree to be bound by these Terms of Service.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Services</h2>
            <p>Hein Hoven Construction provides general contracting services including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Kitchen and bathroom remodeling</li>
              <li>ADU construction</li>
              <li>Home renovations</li>
              <li>Project management</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Payment Terms</h2>
            <p>Payment terms are outlined in individual project contracts. We accept various payment methods.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
            <p>Our liability is limited as outlined in individual project contracts.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Contact</h2>
            <p>For questions about these terms, contact us at: legal@heinhoven.com</p>
          </section>
        </div>
      </div>
    </div>
  );
}
