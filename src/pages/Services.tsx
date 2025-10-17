import { SEO } from '@/components/SEO';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const services = [
  {
    id: 1,
    title: 'Kitchen Remodeling',
    slug: 'kitchen-remodeling',
    description: 'Transform your kitchen into a functional and beautiful space',
    features: ['Custom cabinets', 'Countertop installation', 'Appliance upgrades', 'Lighting design'],
    priceRange: '$25,000 - $75,000',
    timeline: '4-8 weeks'
  },
  {
    id: 2,
    title: 'Bathroom Renovation',
    slug: 'bathroom-renovation',
    description: 'Create your dream bathroom with expert craftsmanship',
    features: ['Tile work', 'Fixture installation', 'Custom vanities', 'Shower/tub upgrades'],
    priceRange: '$15,000 - $40,000',
    timeline: '3-6 weeks'
  },
  {
    id: 3,
    title: 'Home Additions',
    slug: 'home-additions',
    description: 'Expand your living space with seamless additions',
    features: ['Room additions', 'Second stories', 'Garage conversions', 'ADU construction'],
    priceRange: '$50,000 - $200,000',
    timeline: '12-20 weeks'
  }
];

export default function Services() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Construction Services"
        description="Professional construction and renovation services in Los Angeles"
        keywords="construction services, renovation, remodeling"
      />
      <div className="container mx-auto px-4 py-12">
        <Breadcrumbs />
        <h1 className="text-4xl font-bold mb-4">Our Services</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Comprehensive construction solutions for your home
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{service.description}</p>
                <ul className="space-y-2 mb-4">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <span className="text-primary">✓</span> {feature}
                    </li>
                  ))}
                </ul>
                <div className="text-sm text-muted-foreground mb-4">
                  <p><strong>Price Range:</strong> {service.priceRange}</p>
                  <p><strong>Timeline:</strong> {service.timeline}</p>
                </div>
                <Button asChild className="w-full">
                  <Link to={`/services/${service.slug}`}>
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
