import { SEO } from '@/components/SEO';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import StructuredData, { getServiceSchema } from '@/components/StructuredData';

const features = [
  'Custom tile & stone work',
  'Walk-in shower installation',
  'Bathtub replacement or refinishing',
  'Custom vanity & cabinetry',
  'Modern fixture upgrades',
  'Lighting design',
  'Ventilation & exhaust fans',
  'Waterproofing & moisture control',
  'Accessibility modifications',
  'Complete plumbing updates'
];

const processSteps = [
  { title: 'Assessment', desc: 'Free bathroom evaluation & design ideas' },
  { title: 'Planning', desc: 'Material selection & 3D visualization' },
  { title: 'Permits', desc: 'All permits & code compliance handled' },
  { title: 'Renovation', desc: '3-6 weeks professional installation' },
  { title: 'Final', desc: 'Quality inspection & warranty activation' }
];

export default function BathroomRenovation() {
  const serviceSchema = getServiceSchema(
    'Bathroom Renovation',
    'Expert bathroom renovation services in Los Angeles. Custom tile work, modern fixtures, walk-in showers, and complete bathroom remodels.',
    '15000-40000'
  );

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Bathroom Renovation Los Angeles | Custom Bathroom Remodel"
        description="Professional bathroom renovation by Hoven Construction. Custom tile, fixtures, showers. 3-6 week timeline. Free consultation. Licensed & insured."
        keywords="bathroom renovation, bathroom remodel, custom bathroom, Los Angeles bathroom"
      />
      <StructuredData data={serviceSchema} />
      
      <div className="relative h-[400px] bg-cover bg-center" style={{backgroundImage: 'url(https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1759873474259_5d793c19.webp)'}}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">Bathroom Renovation</h1>
            <p className="text-xl mb-6">Create your dream spa-like bathroom retreat</p>
            <Button size="lg" asChild>
              <a href="tel:+13108532131"><Phone className="mr-2 h-5 w-5" /> Call 310-853-2131</a>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Breadcrumbs />
        
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">$15K - $40K</div>
              <p className="text-muted-foreground">Average Investment</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">3-6 Weeks</div>
              <p className="text-muted-foreground">Typical Timeline</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">5 Years</div>
              <p className="text-muted-foreground">Workmanship Warranty</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">What's Included</h2>
            <div className="grid gap-3">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <Check className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-lg">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-6">Our Process</h2>
            <div className="space-y-4">
              {processSteps.map((step, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-amber-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">{step.title}</h3>
                        <p className="text-muted-foreground">{step.desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="pt-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Bathroom?</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">Schedule a free consultation and get a detailed estimate. Fully licensed and insured.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" asChild>
                <a href="tel:+13108532131"><Phone className="mr-2" /> Call Now</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/cost-estimator">Get Free Estimate</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
