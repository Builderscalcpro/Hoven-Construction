import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ExternalLink, Clock } from 'lucide-react';
import { useState } from 'react';

const BingWebmasterSetup = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Verify Google Search Console',
      description: 'Ensure your site is verified in Google Search Console first',
      action: 'Visit Google Search Console',
      link: 'https://search.google.com/search-console',
    },
    {
      title: 'Go to Bing Webmaster Tools',
      description: 'Navigate to Bing Webmaster Tools and sign in with your Microsoft account',
      action: 'Open Bing Webmaster',
      link: 'https://www.bing.com/webmasters',
    },
    {
      title: 'Import from Google',
      description: 'Click "Import from Google Search Console" button on the Bing homepage',
      action: 'Start Import',
      link: 'https://www.bing.com/webmasters',
    },
    {
      title: 'Authorize Connection',
      description: 'Sign in to Google and authorize Bing to access your Search Console data',
      action: 'Continue',
      link: null,
    },
    {
      title: 'Complete Import',
      description: 'Bing will automatically import: site verification, sitemaps, URL parameters, and settings',
      action: 'Finish',
      link: null,
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          Bing Webmaster Tools Setup (5 Minutes)
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          Import your site from Google Search Console to Bing automatically
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`p-4 border rounded-lg transition-all ${
                index === currentStep
                  ? 'border-blue-500 bg-blue-50'
                  : index < currentStep
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {index < currentStep && (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    )}
                    <h3 className="font-semibold">
                      Step {index + 1}: {step.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
                {step.link && (
                  <Button
                    size="sm"
                    variant={index === currentStep ? 'default' : 'outline'}
                    onClick={() => {
                      window.open(step.link, '_blank');
                      if (index === currentStep) setCurrentStep(index + 1);
                    }}
                  >
                    {step.action}
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                )}
                {!step.link && index === currentStep && (
                  <Button
                    size="sm"
                    onClick={() => setCurrentStep(index + 1)}
                  >
                    Mark Complete
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {currentStep >= steps.length && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle2 className="h-5 w-5" />
              <p className="font-semibold">Setup Complete!</p>
            </div>
            <p className="text-sm text-green-700 mt-2">
              Your site is now connected to Bing Webmaster Tools. Data will sync automatically.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BingWebmasterSetup;
