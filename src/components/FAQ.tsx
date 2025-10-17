import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';


interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    category: "Pricing & Costs",
    question: "How much does a home renovation cost in Los Angeles?",
    answer: "Home renovation costs in Los Angeles typically range from $50,000 to $200,000 depending on the project scope. Kitchen remodels average $25,000-$75,000, bathroom renovations $15,000-$40,000, and full home renovations $100-$300 per square foot. We provide free detailed estimates tailored to your specific project requirements."
  },
  {
    category: "Pricing & Costs",
    question: "What is included in your construction estimate?",
    answer: "Our comprehensive estimates include all materials, labor costs, permits, waste removal, project management, and a detailed timeline. We provide transparent itemized pricing with no hidden fees. Each estimate includes a breakdown of costs by phase, material specifications, and warranty information."
  },
  {
    category: "Timeline & Process",
    question: "How long does a typical home renovation take?",
    answer: "Most home renovations take 8-16 weeks from start to finish. Kitchen remodels typically require 4-8 weeks, bathroom renovations 3-6 weeks, and room additions 12-20 weeks. Timeline depends on project complexity, permit approvals, and material availability. We provide a detailed schedule during your consultation."
  },
  {
    category: "Timeline & Process",
    question: "What is the construction process from start to finish?",
    answer: "Our process includes: (1) Free consultation and site assessment, (2) Design development and detailed estimate, (3) Contract signing and permit acquisition, (4) Pre-construction preparation, (5) Construction phase with regular updates, (6) Quality inspections, and (7) Final walkthrough and project completion. You'll have a dedicated project manager throughout."
  },
  {
    category: "Licensing & Quality",
    question: "Are you licensed and insured in California?",
    answer: "Yes, Hoven Construction is fully licensed by the California Contractors State License Board (CSLB), bonded, and carries comprehensive general liability and workers' compensation insurance. We maintain all required permits and comply with California building codes and regulations for your protection and peace of mind."
  },
  {
    category: "Licensing & Quality",
    question: "What warranties do you offer on your work?",
    answer: "We provide a 5-year workmanship warranty on all construction work and pass through manufacturer warranties on materials and appliances (typically 1-10 years). Our warranty covers structural integrity, installation quality, and craftsmanship. We also offer optional extended warranty packages for additional coverage."
  },
  {
    category: "Services & Specialties",
    question: "What types of construction services do you provide?",
    answer: "We specialize in kitchen and bathroom remodeling, room additions, whole-home renovations, custom home building, outdoor living spaces, ADU construction, foundation work, roofing, and commercial renovations. Our team handles everything from minor updates to complete property transformations throughout Los Angeles County."
  },
  {
    category: "Services & Specialties",
    question: "Do you handle permits and inspections?",
    answer: "Yes, we manage all permit applications, building department interactions, and required inspections. Our team ensures full compliance with local building codes, zoning regulations, and HOA requirements. Permit costs are included in your estimate, and we coordinate all inspection schedules to keep your project on track."
  },
  {
    category: "Payment & Financing",
    question: "What payment methods and financing options are available?",
    answer: "We accept checks, credit cards, bank transfers, and offer flexible payment schedules tied to project milestones. We partner with leading home improvement financing companies offering competitive rates, low monthly payments, and same-day approval. Payment terms are as follows: An initial deposit of 10% of the contract price or $1,000, whichever is less. Thereafter, progress payments will be made in the form of weekly draws based on the project's timeline and scope. A final 10% retainage will be due upon completion of the project and final walkthrough."
  },
  {
    category: "Service Area",
    question: "What areas of Los Angeles do you serve?",
    answer: "We serve all of Los Angeles County including Beverly Hills, Santa Monica, Pasadena, Glendale, Burbank, West Hollywood, Culver City, Manhattan Beach, and surrounding communities. We're based in Los Angeles and have completed hundreds of projects throughout the region with local expertise and established vendor relationships."
  },
  {
    category: "Getting Started",
    question: "How do I get started with my construction project?",
    answer: "Getting started is easy: (1) Call us at 310-853-2131 or fill out our online form, (2) Schedule a free in-home consultation, (3) Receive a detailed proposal within 3-5 business days, (4) Review and approve the design and budget, (5) Sign the contract and we'll handle permits, (6) Construction begins on your scheduled start date."
  },
  {
    category: "Materials & Design",
    question: "Can I choose my own materials and finishes?",
    answer: "Absolutely! We work with your preferred materials, finishes, and fixtures. Our team provides expert guidance on quality, durability, and cost-effectiveness while respecting your design vision. We have partnerships with top suppliers for competitive pricing and can source specialty items. You'll have final approval on all material selections."
  }
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const categories = Array.from(new Set(faqData.map(item => item.category)));

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  React.useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(faqSchema);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-amber-50" id="faq">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about working with Hoven Construction
          </p>
        </div>

        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="text-xl font-semibold text-amber-600 mb-4">{category}</h3>
              <div className="space-y-3">
                {faqData
                  .filter(item => item.category === category)
                  .map((item, index) => {
                    const globalIndex = faqData.indexOf(item);
                    const isOpen = openIndex === globalIndex;
                    
                    return (
                      <div 
                        key={globalIndex}
                        className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
                      >
                        <button
                          onClick={() => toggleFAQ(globalIndex)}
                          className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-amber-50 transition-colors"
                          aria-expanded={isOpen}
                        >
                          <span className="font-semibold text-gray-900 pr-8">
                            {item.question}
                          </span>
                          {isOpen ? (
                            <ChevronUp className="flex-shrink-0 h-5 w-5 text-amber-600" />
                          ) : (
                            <ChevronDown className="flex-shrink-0 h-5 w-5 text-gray-400" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-4 text-gray-700 leading-relaxed">
                            {item.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center p-8 bg-white rounded-lg shadow-md">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Still Have Questions?
          </h3>
          <p className="text-gray-600 mb-6">
            Our team is here to help! Contact us for personalized answers to your construction questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:+13108532131"
              className="inline-flex items-center justify-center px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors"
            >
              📞 Call 310-853-2131
            </a>
            <button
              onClick={() => document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors"
            >
              Get Free Consultation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};


export default FAQ;
