import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReviewSyncDashboard from './ReviewSyncDashboard';
import GoogleBusinessReviewsDebug from './GoogleBusinessReviewsDebug';
import { Star, MessageSquare, RefreshCw, Clock, CheckCircle, AlertCircle, Settings, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { ReviewResponseWorkflow } from './ReviewResponseWorkflow';
import { AIResponseSettings } from './AIResponseSettings';
import GoogleBusinessOAuthSetup from './GoogleBusinessOAuthSetup';




interface Review {
  id: string;
  review_id: string;
  reviewer_name: string;
  reviewer_photo_url?: string;
  star_rating: number;
  comment?: string;
  create_time: string;
  reply_comment?: string;
  reply_update_time?: string;
  is_new: boolean;
}

interface SyncLog {
  id: string;
  sync_status: string;
  reviews_fetched: number;
  new_reviews_count: number;
  synced_at: string;
  error_message?: string;
}

export default function ReviewsManagementDashboard() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [tokenData, setTokenData] = useState<any>(null);
  const { toast } = useToast();
  const { user } = useAuth();


  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const { data: fetchedTokenData } = await supabase
        .from('google_business_tokens')
        .select('*')
        .single();
      
      setTokenData(fetchedTokenData);
      setIsConnected(!!fetchedTokenData);
      if (fetchedTokenData) {
        loadReviews();
        loadSyncLogs();
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    } finally {
      setLoading(false);
    }
  };



  const loadReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('google_reviews')
        .select('*')
        .order('create_time', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSyncLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('review_sync_logs')
        .select('*')
        .order('synced_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setSyncLogs(data || []);
    } catch (error) {
      console.error('Error loading sync logs:', error);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const { data: tokenData } = await supabase
        .from('google_business_tokens')
        .select('*')
        .single();

      if (!tokenData) {
        toast({
          title: 'Error',
          description: 'Google Business Profile not connected',
          variant: 'destructive'
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('sync-google-reviews', {
        body: {
          userId: user?.id,
          locationId: tokenData.location_id,
          accessToken: tokenData.access_token,
          accountId: tokenData.account_id
        }
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Synced ${data.reviewsFetched} reviews (${data.newReviews} new)`
      });

      loadReviews();
      loadSyncLogs();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sync reviews',
        variant: 'destructive'
      });
    } finally {
      setSyncing(false);
    }
  };

  const markAsRead = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('google_reviews')
        .update({ is_new: false })
        .eq('id', reviewId);

      if (error) throw error;
      loadReviews();
    } catch (error) {
      console.error('Error marking review as read:', error);
    }
  };

  const newReviewsCount = reviews.filter(r => r.is_new).length;

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;

  if (!isConnected) {
    return <GoogleBusinessOAuthSetup onConnected={checkConnection} />;
  }

  return (


    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Reviews Management</h2>
          <p className="text-muted-foreground">Manage and respond to Google Business reviews</p>
        </div>
        <Button onClick={handleSync} disabled={syncing}>
          <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
          Sync Reviews
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{reviews.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>New Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{newReviewsCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avg Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {reviews.length > 0 
                ? (reviews.reduce((sum, r) => sum + r.star_rating, 0) / reviews.length).toFixed(1)
                : '0.0'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reviews">
        <TabsList>
          <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
          <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
          <TabsTrigger value="sync">Auto-Sync</TabsTrigger>
          <TabsTrigger value="logs">Sync Logs</TabsTrigger>
          <TabsTrigger value="settings">AI Settings</TabsTrigger>
        </TabsList>



        <TabsContent value="reviews" className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className={review.is_new ? 'border-blue-500' : ''}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    {review.reviewer_photo_url && (
                      <img src={review.reviewer_photo_url} alt={`${review.reviewer_name} profile photo`} width="40" height="40" className="w-10 h-10 rounded-full" />

                    )}
                    <div>
                      <CardTitle className="text-lg">{review.reviewer_name}</CardTitle>
                      <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < review.star_rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    {review.is_new && <Badge variant="default">New</Badge>}
                    <Badge variant="outline">
                      {new Date(review.create_time).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">

                {review.comment && <p>{review.comment}</p>}
                
                {review.reply_comment && (
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="font-semibold mb-2">Your Reply:</p>
                    <p>{review.reply_comment}</p>
                  </div>
                )}

                {!review.reply_comment && replyingTo === review.id && (
                  <ReviewResponseWorkflow 
                    review={review}
                    onResponsePosted={() => {
                      setReplyingTo(null);
                      loadReviews();
                    }}
                  />
                )}

                <div className="flex gap-2">
                  {review.is_new && (
                    <Button variant="outline" size="sm" onClick={() => markAsRead(review.id)}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Read
                    </Button>
                  )}
                  {!review.reply_comment && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setReplyingTo(replyingTo === review.id ? null : review.id)}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      {replyingTo === review.id ? 'Cancel' : 'Reply with AI'}
                    </Button>
                  )}
                </div>

              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="diagnostics">
          <GoogleBusinessReviewsDebug tokenData={tokenData} />
        </TabsContent>

        <TabsContent value="sync">
          <ReviewSyncDashboard />
        </TabsContent>


        <TabsContent value="logs" className="space-y-4">
          {syncLogs.map((log) => (
            <Card key={log.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {log.sync_status === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    Sync {log.sync_status}
                  </CardTitle>
                  <Badge variant="outline">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(log.synced_at).toLocaleString()}
                  </Badge>
                </div>

                <CardDescription>
                  Fetched {log.reviews_fetched} reviews, {log.new_reviews_count} new
                </CardDescription>
              </CardHeader>
              {log.error_message && (
                <CardContent>
                  <p className="text-red-600 text-sm">{log.error_message}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="settings">
          <AIResponseSettings />
        </TabsContent>
      </Tabs>

    </div>
  );
}
