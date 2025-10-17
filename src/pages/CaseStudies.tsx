import { SEO } from '@/components/SEO';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';

const caseStudies = [
  {
    id: 1,
    title: 'Beverly Hills Kitchen Transformation',
    location: 'Beverly Hills, CA',
    service: 'Kitchen Remodeling',
    budget: '$65,000',
    timeline: '6 weeks',
    beforeImage: 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1759452002384_e09a7657.webp',
    afterImage: 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1759452007337_48e6b4dc.webp',
    description: 'Complete kitchen renovation featuring custom white cabinets, quartz countertops, and high-end appliances.',
    challenges: 'Limited space, structural modifications required',
    solutions: 'Open floor plan design, custom storage solutions',
    results: '40% increase in home value, improved functionality'
  }
];

export default function CaseStudies() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Case Studies - Construction Projects"
        description="View our completed construction and renovation projects"
        keywords="case studies, construction projects, before and after"
      />
      <div className="container mx-auto px-4 py-12">
        <Breadcrumbs />
        <h1 className="text-4xl font-bold mb-4">Case Studies</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Real projects, real results
        </p>
        
        <div className="space-y-12">
          {caseStudies.map((study) => (
            <Card key={study.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{study.title}</CardTitle>
                    <p className="text-muted-foreground">{study.location}</p>
                  </div>
                  <Badge>{study.service}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <BeforeAfterSlider
                  beforeImage={study.beforeImage}
                  afterImage={study.afterImage}
                />
                <div className="grid md:grid-cols-3 gap-4 my-6">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="text-xl font-bold">{study.budget}</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Timeline</p>
                    <p className="text-xl font-bold">{study.timeline}</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Service</p>
                    <p className="text-xl font-bold">{study.service}</p>
                  </div>
                </div>
                <div className="prose max-w-none">
                  <p className="mb-4">{study.description}</p>
                  <h3 className="font-semibold mb-2">Challenges</h3>
                  <p className="mb-4">{study.challenges}</p>
                  <h3 className="font-semibold mb-2">Solutions</h3>
                  <p className="mb-4">{study.solutions}</p>
                  <h3 className="font-semibold mb-2">Results</h3>
                  <p>{study.results}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
