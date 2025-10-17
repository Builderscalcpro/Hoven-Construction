import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, MessageSquare, RefreshCw, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchGoogleReviews, replyToReview, GoogleReview } from '@/lib/googleBusinessService';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function GoogleBusinessReviews({ tokenData }: any) {
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!tokenData?.access_token || !tokenData?.account_id || !tokenData?.location_id) {
        throw new Error('Missing authentication credentials');
      }
      
      const data = await fetchGoogleReviews(tokenData);
      setReviews(data);
      
      if (data.length === 0) {
        setError('No reviews found. Make sure your Google Business Profile is connected.');
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to load reviews';
      setError(errorMsg);
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (reviewId: string) => {
    try {
      const success = await replyToReview(tokenData, reviewId, replyText);
      
      if (!success) throw new Error('Failed to post reply');

      toast({ title: 'Success', description: 'Reply posted successfully' });
      setReplyingTo(null);
      setReplyText('');
      loadReviews();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to post reply',
        variant: 'destructive'
      });
    }
  };

  const getStarCount = (rating: string): number => {
    const map: Record<string, number> = {
      'ONE': 1, 'TWO': 2, 'THREE': 3, 'FOUR': 4, 'FIVE': 5
    };
    return map[rating] || 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        <span>Loading reviews...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="ml-2">
          {error}
          <Button variant="outline" size="sm" onClick={loadReviews} className="ml-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Reviews ({reviews.length})</h3>
        <Button variant="outline" size="sm" onClick={loadReviews}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {reviews.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No reviews yet
          </CardContent>
        </Card>
      ) : (
        reviews.map((review) => (
          <Card key={review.reviewId}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  {review.reviewer.profilePhotoUrl && (
                    <img 
                      src={review.reviewer.profilePhotoUrl} 
                      alt={review.reviewer.displayName}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div>
                    <CardTitle className="text-lg">{review.reviewer.displayName}</CardTitle>
                    <div className="flex gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < getStarCount(review.starRating) 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <Badge variant="outline">
                  {new Date(review.createTime).toLocaleDateString()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {review.comment && <p>{review.comment}</p>}
              
              {review.reviewReply && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-semibold mb-2">Your Reply:</p>
                  <p>{review.reviewReply.comment}</p>
                </div>
              )}

              {replyingTo === review.reviewId ? (
                <div className="space-y-2">
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write your reply..."
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => handleReply(review.reviewId)}>
                      Post Reply
                    </Button>
                    <Button variant="outline" onClick={() => setReplyingTo(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                !review.reviewReply && (
                  <Button variant="outline" onClick={() => setReplyingTo(review.reviewId)}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Reply
                  </Button>
                )
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
