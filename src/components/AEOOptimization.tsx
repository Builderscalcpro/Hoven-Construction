import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface AEOProps {
  question?: string;
  answer?: string;
  faqs?: Array<{ question: string; answer: string }>;
  howTo?: {
    name: string;
    description: string;
    steps: Array<{ name: string; text: string; image?: string }>;
  };
  speakable?: boolean;
}

export function AEOOptimization({ question, answer, faqs, howTo, speakable = true }: AEOProps) {
  // Generate FAQ schema for AI engines
  const faqSchema = faqs ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "speakable": speakable ? {
      "@type": "SpeakableSpecification",
      "cssSelector": [".faq-question", ".faq-answer"]
    } : undefined,
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  // Generate HowTo schema for step-by-step content
  const howToSchema = howTo ? {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": howTo.name,
    "description": howTo.description,
    "step": howTo.steps.map((step, idx) => ({
      "@type": "HowToStep",
      "position": idx + 1,
      "name": step.name,
      "text": step.text,
      ...(step.image && { "image": step.image })
    }))
  } : null;

  // Q&A schema for direct question-answer pairs
  const qaSchema = question && answer ? {
    "@context": "https://schema.org",
    "@type": "QAPage",
    "mainEntity": {
      "@type": "Question",
      "name": question,
      "text": question,
      "answerCount": 1,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": answer
      }
    }
  } : null;

  // Speakable content for voice search
  const speakableSchema = speakable ? {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [
        ".aeo-answer",
        ".canonical-answer",
        "h1",
        "h2",
        ".summary"
      ]
    }
  } : null;

  return (
    <Helmet>
      {/* AEO Meta Tags for AI Engines */}
      <meta name="ai-content-type" content="answer" />
      <meta name="answer-engine" content="optimized" />
      {question && <meta name="question" content={question} />}
      {answer && <meta name="answer" content={answer.substring(0, 160)} />}
      
      {/* Voice Search Optimization */}
      <meta name="voice-search" content="enabled" />
      <meta name="speakable" content="true" />
      
      {/* Structured Data for AI Understanding */}
      {faqSchema && (
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      )}
      {howToSchema && (
        <script type="application/ld+json">
          {JSON.stringify(howToSchema)}
        </script>
      )}
      {qaSchema && (
        <script type="application/ld+json">
          {JSON.stringify(qaSchema)}
        </script>
      )}
      {speakableSchema && (
        <script type="application/ld+json">
          {JSON.stringify(speakableSchema)}
        </script>
      )}
    </Helmet>
  );
}

// Canonical Answer Box Component for AEO
export function CanonicalAnswer({ 
  question, 
  answer,
  className = "" 
}: { 
  question: string; 
  answer: string;
  className?: string;
}) {
  return (
    <div className={`canonical-answer bg-amber-50 border-l-4 border-amber-500 p-6 mb-8 ${className}`}>
      <h2 className="aeo-question text-xl font-semibold mb-3">{question}</h2>
      <p className="aeo-answer text-gray-800 leading-relaxed">
        {answer}
      </p>
    </div>
  );
}

// Quick Answer Summary for AI Engines
export function QuickAnswerSummary({ 
  points,
  title = "Quick Answer"
}: { 
  points: string[];
  title?: string;
}) {
  return (
    <div className="quick-answer-summary bg-blue-50 rounded-lg p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ul className="space-y-2">
        {points.map((point, idx) => (
          <li key={idx} className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span className="text-gray-800">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}