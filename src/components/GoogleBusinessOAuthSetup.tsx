import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Building2, ExternalLink } from 'lucide-react';

interface GoogleBusinessOAuthSetupProps {
  onConnected: () => void;
}

export default function GoogleBusinessOAuthSetup({ onConnected }: GoogleBusinessOAuthSetupProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const clientId = import.meta.env.VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_ID;
  const redirectUri = `${window.location.origin}/google-business-callback`;
  
  // Debug: Check if Client ID exists
  console.log('Client ID exists:', !!import.meta.env.VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_ID);
  console.log('Client ID value:', import.meta.env.VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_ID);


  const handleOAuthConnect = () => {
    setLoading(true);
    
    const scope = 'https://www.googleapis.com/auth/business.manage';
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scope)}&` +
      `access_type=offline&` +
      `prompt=consent`;

    window.location.href = authUrl;
  };

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-6 h-6" />
          Connect Google Business Profile
        </CardTitle>
        <CardDescription>
          Connect your Google Business Profile to sync reviews and business information automatically
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">What you'll get:</h4>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>✓ Automatic review syncing</li>
            <li>✓ Business information updates</li>
            <li>✓ Review response management</li>
            <li>✓ Real-time notifications</li>
          </ul>
        </div>

        <Button 
          onClick={handleOAuthConnect} 
          disabled={loading || !clientId}
          className="w-full"
          size="lg"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          {loading ? 'Connecting...' : 'Connect with Google'}
        </Button>

        {!clientId && (
          <p className="text-sm text-red-600 text-center">
            Client ID not configured. Please add VITE_GOOGLE_BUSINESS_PROFILE_CLIENT_ID to your environment variables.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
