import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { CheckCircle, XCircle, RefreshCw, Star, Building2, MessageSquare, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function GoogleBusinessDemo() {
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [businessInfo, setBusinessInfo] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    const { data } = await supabase.from('google_business_tokens').select('*').single();
    setConnected(!!data);
    if (data) {
      fetchReviews();
      fetchBusinessInfo();
    }
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('google_reviews').select('*').order('created_at', { ascending: false }).limit(10);
      setReviews(data || []);
    } finally {
      setLoading(false);
    }
  };

  const fetchBusinessInfo = async () => {
    const { data } = await supabase.from('google_business_info').select('*').single();
    setBusinessInfo(data);
  };

  const syncReviews = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('sync-google-reviews');
      if (error) throw error;
      toast({ title: 'Success', description: 'Reviews synced successfully' });
      fetchReviews();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Google Business Profile Demo</h1>
        <p className="text-muted-foreground">Test and manage your Google Business integration</p>
      </div>

      <Alert className={connected ? 'border-green-500 bg-green-50 mb-6' : 'border-red-500 bg-red-50 mb-6'}>
        {connected ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />}
        <AlertDescription className={connected ? 'text-green-900' : 'text-red-900'}>
          {connected ? 'Connected to Google Business Profile' : 'Not connected. Visit /google-business-connect to connect.'}
        </AlertDescription>
      </Alert>

      {connected && (
        <Tabs defaultValue="reviews" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="business">Business Info</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="reviews" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Recent Reviews</h2>
              <Button onClick={syncReviews} disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Sync Reviews
              </Button>
            </div>
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">{review.reviewer_name}</CardTitle>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                  {review.reply && (
                    <div className="mt-3 pl-4 border-l-2 border-blue-500">
                      <p className="text-sm font-semibold">Your Reply:</p>
                      <p className="text-sm">{review.reply}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="business">
            {businessInfo ? (
              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div><strong>Name:</strong> {businessInfo.name}</div>
                  <div><strong>Address:</strong> {businessInfo.address}</div>
                  <div><strong>Phone:</strong> {businessInfo.phone}</div>
                  <div><strong>Website:</strong> {businessInfo.website}</div>
                </CardContent>
              </Card>
            ) : (
              <Alert><AlertDescription>No business info found</AlertDescription></Alert>
            )}
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={() => window.location.href = '/dashboard?tab=google-business'}>
                  <Building2 className="w-4 h-4 mr-2" />
                  Open Full Dashboard
                </Button>
                <Button className="w-full" variant="outline" onClick={() => window.location.href = '/google-business-connect'}>
                  <Zap className="w-4 h-4 mr-2" />
                  Manage Connection
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
