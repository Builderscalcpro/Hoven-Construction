import { useParams } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { MapPin, Phone, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const locationData: Record<string, any> = {
  'beverly-hills': {
    name: 'Beverly Hills',
    title: 'Construction Services in Beverly Hills, CA',
    description: 'Premier construction and renovation services in Beverly Hills. Licensed contractors specializing in luxury home remodeling.',
    phone: '(310) 853-2131',
    serviceArea: 'Beverly Hills and surrounding areas',
    projects: '50+ completed projects',
    rating: '5.0'
  },
  'santa-monica': {
    name: 'Santa Monica',
    title: 'Construction Services in Santa Monica, CA',
    description: 'Expert construction services in Santa Monica. Specializing in coastal home renovations and remodeling.',
    phone: '(310) 853-2131',
    serviceArea: 'Santa Monica and West LA',
    projects: '40+ completed projects',
    rating: '5.0'
  }
};

export default function LocationPage() {
  const { location } = useParams();
  const data = locationData[location || 'beverly-hills'];

  if (!data) return <div>Location not found</div>;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={data.title}
        description={data.description}
        keywords={`construction ${data.name}, renovation ${data.name}, contractor ${data.name}`}
      />
      <div className="container mx-auto px-4 py-12">
        <Breadcrumbs />
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{data.title}</h1>
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span>{data.serviceArea}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              <span>{data.rating} Rating</span>
            </div>
          </div>
          
          <div className="prose max-w-none mb-8">
            <p className="text-xl text-muted-foreground">{data.description}</p>
            <p>We've completed {data.projects} in {data.name}, delivering exceptional quality and customer satisfaction.</p>
          </div>

          <div className="flex gap-4">
            <Button size="lg" asChild>
              <a href={`tel:${data.phone}`}>
                <Phone className="mr-2 h-5 w-5" />
                Call {data.phone}
              </a>
            </Button>
            <Button size="lg" variant="outline">
              Get Free Quote
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
