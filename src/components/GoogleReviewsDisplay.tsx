import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchGoogleReviews, GoogleReview } from '@/lib/googleBusinessService';
import { supabase } from '@/lib/supabase';


interface Review {
  reviewId: string;
  reviewer: { displayName: string; profilePhotoUrl?: string };
  starRating: string;
  comment: string;
  createTime: string;
}

// Real Google reviews from Hoven Construction
const sampleReviews: Review[] = [
  {
    reviewId: '1',
    reviewer: { displayName: 'Shelby Tate' },
    starRating: 'FIVE',
    comment: 'We hired Hoven Construction for a kitchen renovation the work was extensive and Hein did everything to bring it in on the quote he gave us. It has truly changed how we use our home.',
    createTime: new Date(Date.now() - 17 * 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    reviewId: '2',
    reviewer: { displayName: 'ภาสกร รวยวุธ' },
    starRating: 'FIVE',
    comment: 'We couldn\'t be happier with the exterior painting. Our house looks great!.',
    createTime: new Date(Date.now() - 19 * 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    reviewId: '3',
    reviewer: { displayName: 'Brian Carmichael' },
    starRating: 'FIVE',
    comment: 'Our home remodeling experience was very smooth. They really understood our vision and delivered beyond our expectations.',
    createTime: new Date(Date.now() - 20 * 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    reviewId: '4',
    reviewer: { displayName: 'Timmy Tate' },
    starRating: 'FIVE',
    comment: 'The renovation in the kitchen has completely transformed our home. It\'s now the heart of the house. Thanks Hein!',
    createTime: new Date(Date.now() - 21 * 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    reviewId: '5',
    reviewer: { displayName: 'Jose Lachance' },
    starRating: 'FIVE',
    comment: 'Working with Hein on our bathroom remodel was a pleasure. He had great ideas, and we\'re so happy with the outcome.',
    createTime: new Date(Date.now() - 21 * 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    reviewId: '6',
    reviewer: { displayName: 'James Sanchez' },
    starRating: 'FIVE',
    comment: 'Our bathroom feels like a spa now!. Hein was great!',
    createTime: new Date(Date.now() - 22 * 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    reviewId: '7',
    reviewer: { displayName: 'Kenneth Ferguson' },
    starRating: 'FIVE',
    comment: 'Renovations can be overwhelming, but this team made it stress-free. They provided clear timelines, stuck to the budget, and delivered fantastic results. Our bathroom remodel turned out exactly as we envisioned.',
    createTime: new Date(Date.now() - 23 * 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    reviewId: '8',
    reviewer: { displayName: 'John Brandt' },
    starRating: 'FIVE',
    comment: 'We needed extra space and decided to add a room to our home. Hoven Construction handled the project efficiently, ensuring everything blended seamlessly with the existing structure. The end result looks like it was always part of the house.',
    createTime: new Date(Date.now() - 24 * 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    reviewId: '9',
    reviewer: { displayName: 'Jerry Six' },
    starRating: 'FIVE',
    comment: 'I was impressed by the level of detail in their work. From framing to the final finishes, everything was done with precision. They listened to my ideas and executed them perfectly. My home has never looked better.',
    createTime: new Date(Date.now() - 25 * 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    reviewId: '10',
    reviewer: { displayName: 'Joe McClain' },
    starRating: 'FIVE',
    comment: 'Finding a trustworthy contractor can be challenging, but Hoven Construction made the process seamless. They were punctual, communicative, and worked efficiently. The project was completed on time, and the quality of work speaks for itself.',
    createTime: new Date(Date.now() - 26 * 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    reviewId: '11',
    reviewer: { displayName: 'Robert Trapani' },
    starRating: 'FIVE',
    comment: 'We hired Hoven Construction for a complete kitchen remodel, and the results exceeded our expectations. The team was professional, detail-oriented, and always kept us updated. Our kitchen now feels modern and spacious, and the craftsmanship is outstanding.',
    createTime: new Date(Date.now() - 28 * 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    reviewId: '12',
    reviewer: { displayName: 'Manuel Scharff' },
    starRating: 'FIVE',
    comment: 'Our kitchen was in desperate need of a remodel, and Hoven Const. did an outstanding job! They took the time to understand our needs and helped us choose finishes that would complement the rest of our home. The final result is not only beautiful but also incredibly functional. We have so much more counter space now, and everything looks just perfect.',
    createTime: new Date(Date.now() - 29 * 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    reviewId: '13',
    reviewer: { displayName: 'Robert Mathias' },
    starRating: 'FIVE',
    comment: 'From design to execution, our home remodeling experience was excellent. The team was incredibly skilled, and they worked with us closely to bring our vision to life. We updated the kitchen, living room, and bathrooms, and every space now feels cohesive and fresh. The project was completed on time and on budget, and we\'re absolutely in love with the results.',
    createTime: new Date(Date.now() - 30 * 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    reviewId: '14',
    reviewer: { displayName: 'Gary Godwin' },
    starRating: 'FIVE',
    comment: 'We decided to add more space to our home, and the entire project went smoothly. The work was done efficiently, and the finished addition blends perfectly with the rest of the house. Communication was clear throughout, and the team delivered a high-quality result that improved our living space.',
    createTime: new Date(Date.now() - 31 * 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    reviewId: '15',
    reviewer: { displayName: 'Dennis Casey' },
    starRating: 'FIVE',
    comment: 'We absolutely love our new kitchen. The layout is practical, and the design feels fresh and modern. Every detail was thoughtfully handled, making the space both beautiful and functional. It\'s a joy to cook and spend time there now.',
    createTime: new Date(Date.now() - 42 * 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    reviewId: '16',
    reviewer: { displayName: 'Roman Foster' },
    starRating: 'FIVE',
    comment: 'Complete Bathroom remodel and completely blown away! What a guy, what a company. What great work!!!',
    createTime: new Date(Date.now() - 43 * 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    reviewId: '17',
    reviewer: { displayName: 'Marcel Brock' },
    starRating: 'FIVE',
    comment: 'Choosing this team for my bathroom remodel was definitely the right call! They completely transformed my old, cramped bathroom into a luxurious, spa-like space. The materials they used are top-notch, and I was impressed by how quickly and efficiently they worked. The heated floors and modern vanity are my favorite parts, and I couldn\'t be happier with the results!',
    createTime: new Date(Date.now() - 44 * 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    reviewId: '18',
    reviewer: { displayName: 'Bailey Palmer' },
    starRating: 'FIVE',
    comment: 'Hoven Construction did an incredible job on our kitchen and bathroom remodel. We\'re very happy with how they turned out Definitely a 5-star experience!',
    createTime: new Date(Date.now() - 46 * 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    reviewId: '19',
    reviewer: { displayName: 'Eric Ward' },
    starRating: 'FIVE',
    comment: 'Hein did an GREAT job. The entire process was relatively stress-free. The bathrooms turned out exactly as we envisioned.',
    createTime: new Date(Date.now() - 47 * 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    reviewId: '20',
    reviewer: { displayName: 'Alexandra Stein' },
    starRating: 'FIVE',
    comment: 'My Husband and I bought a real fixer upper. Unfortunately my husband and I are not very handy with fixer upping :) We hired Hoven Construction and they transformed our home beautifully.',
    createTime: new Date('2024-03-25').toISOString()
  },
  {
    reviewId: '21',
    reviewer: { displayName: 'yo coco' },
    starRating: 'FIVE',
    comment: 'Hein is a pleasure to work with. He has wonderful aesthetics, a stickler for detail and an excellent colorist. The work quality is exceptional.',
    createTime: new Date('2024-03-20').toISOString()
  },
  {
    reviewId: '22',
    reviewer: { displayName: 'E. Kroll' },
    starRating: 'FIVE',
    comment: 'I\'ve used Hoven Construction over the years for several projects. I hired them to do a garage conversion into a guest suite and the results were outstanding. Highly recommend!',
    createTime: new Date('2024-03-20').toISOString()
  },
  {
    reviewId: '23',
    reviewer: { displayName: 'Erica Meek' },
    starRating: 'FIVE',
    comment: 'I knew the moment I met Hein, that he was the man for my job. Unlike the other contractors I met with, he understood my vision and executed it perfectly.',
    createTime: new Date('2024-03-20').toISOString()
  },
  {
    reviewId: '24',
    reviewer: { displayName: 'Trish Alkaitis' },
    starRating: 'FIVE',
    comment: 'Knowledgeable. Helpful. Honest. Excellent Service. Great phone demeanor. I am simply thrilled with "Hoven Construction." Highly recommended!',
    createTime: new Date('2024-03-20').toISOString()
  }
];


export default function GoogleReviewsDisplay() {
  const [reviews, setReviews] = useState<Review[]>(sampleReviews);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [displayCount, setDisplayCount] = useState(6);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: tokenData } = await supabase
        .from('google_business_tokens')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!tokenData || !tokenData.access_token || !tokenData.account_id || !tokenData.location_id) {
        setLoading(false);
        return;
      }

      const data = await fetchGoogleReviews(tokenData);

      if (data && data.length > 0) {
        setReviews(data as any);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleLoadMore = () => {
    setDisplayCount(prev => Math.min(prev + 6, reviews.length));
  };

  const displayedReviews = reviews.slice(0, displayCount);
  const hasMore = displayCount < reviews.length;


  const getStarCount = (rating: string): number => {
    if (rating === 'FIVE') return 5;
    if (rating === 'FOUR') return 4;
    if (rating === 'THREE') return 3;
    if (rating === 'TWO') return 2;
    if (rating === 'ONE') return 1;
    return parseInt(rating.replace('STAR_RATING_', '')) || 5;
  };

  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Google Reviews</h2>

          <p className="text-lg text-gray-600 mb-4">
            {isConnected ? 'Real reviews from Google Business Profile' : 'See what our customers are saying'}
          </p>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-2xl font-bold text-gray-900">4.9</span>
            <span className="text-gray-600">out of 5</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('https://g.page/r/YOUR_GOOGLE_BUSINESS_ID/review', '_blank')}
            className="gap-2"
          >
            Leave a Review <ExternalLink className="w-4 h-4" />
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse">Loading reviews...</div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500">
              {displayedReviews.map((review, index) => (
                <Card 
                  key={review.reviewId} 
                  className="hover:shadow-lg transition-all duration-300 bg-white animate-fadeIn"
                  style={{ animationDelay: `${(index % 6) * 50}ms` }}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3 mb-4">
                      {review.reviewer.profilePhotoUrl ? (
                        <img
                          src={review.reviewer.profilePhotoUrl}
                          alt={review.reviewer.displayName}
                          className="w-12 h-12 rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                          {review.reviewer.displayName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{review.reviewer.displayName}</p>
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
                    <p className="text-gray-700 line-clamp-4 mb-3">{review.comment}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(review.createTime).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {hasMore && (
              <div className="text-center mt-12">
                <Button
                  onClick={handleLoadMore}
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                >
                  Load More Reviews ({reviews.length - displayCount} remaining)
                </Button>
              </div>
            )}
          </>
        )}

      </div>
    </section>
  );
}
