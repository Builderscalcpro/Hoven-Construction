import React from 'react';
import { Star, MapPin } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: 'Sarah Johnson',
    location: 'Beverly Hills, CA',
    rating: 5,
    service: 'Kitchen Remodeling',
    text: 'Hoven Construction did an amazing kitchen remodel in our Beverly Hills home. The team was professional, on-time, and the quality exceeded our expectations. Highly recommend for kitchen renovations!',
    date: '2025-09-15'
  },
  {
    id: 2,
    name: 'Michael Rodriguez',
    location: 'Santa Monica, CA',
    rating: 5,
    service: 'Bathroom Renovation',
    text: 'Outstanding bathroom renovation service in Santa Monica! From design to completion, the process was smooth. The attention to detail and craftsmanship was exceptional.',
    date: '2025-09-10'
  },
  {
    id: 3,
    name: 'Emily Chen',
    location: 'Pasadena, CA',
    rating: 5,
    service: 'Home Addition',
    text: 'We hired Hoven Construction for a home addition in Pasadena. They handled all permits, stayed within budget, and completed the project on schedule. Excellent work!',
    date: '2025-09-05'
  },
  {
    id: 4,
    name: 'David Thompson',
    location: 'Glendale, CA',
    rating: 5,
    service: 'Whole Home Renovation',
    text: 'Complete home renovation in Glendale done perfectly! The team transformed our outdated house into a modern dream home. Professional service from start to finish.',
    date: '2025-08-28'
  },
  {
    id: 5,
    name: 'Lisa Martinez',
    location: 'Burbank, CA',
    rating: 5,
    service: 'Kitchen & Bathroom Remodel',
    text: 'Had both kitchen and bathroom remodeled in our Burbank home. The quality of work is outstanding, and they completed everything within the agreed timeline. Highly satisfied!',
    date: '2025-08-20'
  }
];

export const ReviewsSection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <div className="flex items-center justify-center gap-2 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-6 w-6 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-xl font-semibold ml-2">5.0 Average Rating</span>
          </div>
          <p className="text-gray-600">Based on 100+ verified reviews</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">{review.text}</p>
              <div className="border-t pt-4">
                <p className="font-semibold text-gray-900">{review.name}</p>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>{review.location}</span>
                </div>
                <p className="text-sm text-amber-600 mt-1">{review.service}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection
