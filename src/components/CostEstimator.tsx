import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { OptimizedImage } from '@/components/OptimizedImage';


const projectTypes = [
  { 
    id: 'kitchen', 
    name: 'Kitchen Remodel', 
    basePrice: 15000, // Base cost for minimal kitchen work
    unit: 'sq ft', 
    unitPrice: 187, // Mid-range per sq ft cost for LA market
    minSize: 80,
    maxSize: 500,
    description: 'Full kitchen renovation with new cabinets, countertops, and appliances'
  },
  { 
    id: 'bathroom', 
    name: 'Bathroom Remodel', 
    basePrice: 5600, // Reduced by 30% from $8,000
    unit: 'sq ft', 
    unitPrice: 508, // Reduced by 30% from $725
    minSize: 35,
    maxSize: 200,
    description: 'Complete bathroom renovation with new fixtures, tile, and vanity'
  },
  { 
    id: 'adu', 
    name: 'ADU Construction', 
    basePrice: 75000, // Base cost includes permits, site prep, utilities
    unit: 'sq ft', 
    unitPrice: 375, // Mid-range per sq ft for LA ADU construction
    minSize: 300,
    maxSize: 1200,
    description: 'New accessory dwelling unit construction from ground up'
  }
];


const qualityLevels = [
  { 
    id: 'standard', 
    name: 'Standard', 
    multiplier: 0.85, // Standard materials and finishes
    description: 'Quality materials and standard finishes',
    image: 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1759437364482_f67a8bdf.webp'  
  },
  { 
    id: 'midrange', 
    name: 'Mid-Range', 
    multiplier: 1.0, // Mid-range materials, upgraded finishes
    description: 'Upgraded materials and enhanced finishes',
    image: 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1759437364482_f67a8bdf.webp' 
  },
  { 
    id: 'highend', 
    name: 'High-End', 
    multiplier: 1.5, // Premium materials, luxury finishes
    description: 'Premium materials and luxury finishes',
    image: 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1759437364482_f67a8bdf.webp' 
  }
];



const features = {
  kitchen: [
    { id: 'island', name: 'Kitchen Island', cost: 8500 }, // Updated LA pricing
    { id: 'appliances', name: 'High-End Appliances Package', cost: 15000 }, // Professional grade
    { id: 'backsplash', name: 'Custom Tile Backsplash', cost: 4500 }, // Quality tile work
    { id: 'lighting', name: 'Designer Lighting Package', cost: 3500 }, // Pendant lights, under-cabinet
    { id: 'pantry', name: 'Walk-in Pantry', cost: 6000 }, // Custom pantry build-out
    { id: 'countertops', name: 'Quartz Countertops Upgrade', cost: 7500 } // Upgrade from standard
  ],
  bathroom: [
    { id: 'shower', name: 'Walk-in Glass Shower', cost: 5600 }, // Reduced by 30% from $8,000
    { id: 'tub', name: 'Freestanding Soaking Tub', cost: 4550 }, // Reduced by 30% from $6,500
    { id: 'heated', name: 'Heated Floor System', cost: 2450 }, // Reduced by 30% from $3,500
    { id: 'double', name: 'Double Vanity', cost: 3150 }, // Reduced by 30% from $4,500
    { id: 'steam', name: 'Steam Shower System', cost: 3850 }, // Reduced by 30% from $5,500
    { id: 'skylight', name: 'Skylight Installation', cost: 2100 } // Reduced by 30% from $3,000
  ],
  adu: [
    { id: 'kitchen', name: 'Full Kitchen Package', cost: 35000 }, // Complete kitchen for ADU
    { id: 'bathroom', name: 'Full Bathroom', cost: 22000 }, // Complete bathroom for ADU
    { id: 'hvac', name: 'Mini-Split HVAC System', cost: 8500 }, // Heating and cooling
    { id: 'deck', name: 'Outdoor Deck/Patio', cost: 12000 }, // 200 sq ft deck
    { id: 'solar', name: 'Solar Panel System', cost: 15000 }, // 4kW system
    { id: 'smart', name: 'Smart Home Package', cost: 5000 } // Smart locks, thermostat, lighting
  ]
};

// Labor cost percentages for LA market
const laborCostPercentage = {
  kitchen: 0.35, // 35% of total cost is labor
  bathroom: 0.30, // 30% of total cost is labor  
  adu: 0.40 // 40% of total cost is labor
};






export default function CostEstimator() {
  const navigate = useNavigate();
  const [projectType, setProjectType] = useState('kitchen');
  const [size, setSize] = useState([200]);
  const [quality, setQuality] = useState('standard');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [showQuote, setShowQuote] = useState(false);


  const calculateCost = () => {
    const project = projectTypes.find(p => p.id === projectType)!;
    const qualityMult = qualityLevels.find(q => q.id === quality)!.multiplier;
    const baseCost = project.basePrice + (size[0] * project.unitPrice);
    const materialCost = baseCost * qualityMult;
    const featureCost = features[projectType as keyof typeof features]
      .filter(f => selectedFeatures.includes(f.id))
      .reduce((sum, f) => sum + f.cost, 0);
    return materialCost + featureCost;
  };

  const totalCost = calculateCost();
  const project = projectTypes.find(p => p.id === projectType)!;
  const qualityMult = qualityLevels.find(q => q.id === quality)!.multiplier;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          <a href="tel:+13108532131" className="text-amber-500 font-semibold hover:text-amber-600">
            📞 310.853.2131
          </a>
        </div>
      </nav>

      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Calculator className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h1 className="text-4xl font-bold mb-4">Los Angeles Project Cost Estimator</h1>
            <p className="text-xl text-gray-600 mb-2">Get accurate 2025 LA market pricing for your renovation project</p>
            <p className="text-sm text-gray-500">Based on current contractor rates and material costs in Los Angeles County</p>
          </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {projectTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => {
                        setProjectType(type.id);
                        setSelectedFeatures([]);
                      }}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        projectType === type.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="font-semibold">{type.name}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Size</CardTitle>
                <CardDescription>{size[0]} {project.unit}</CardDescription>
              </CardHeader>
              <CardContent>
                <Slider
                  value={size}
                  onValueChange={setSize}
                  min={project.minSize}
                  max={project.maxSize}
                  step={10}
                  className="mb-4"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>{project.minSize} sq ft</span>
                  <span>{project.maxSize} sq ft</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Material Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">

                  {qualityLevels.map(level => (
                    <button
                      key={level.id}
                      onClick={() => setQuality(level.id)}
                      className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                        quality === level.id
                          ? 'border-blue-600 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <img src={level.image} alt={level.name} className="w-full h-24 object-cover" />
                      <div className="p-2 text-sm font-semibold bg-white">{level.name}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {features[projectType as keyof typeof features].map(feature => (
                    <div key={feature.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={feature.id}
                          checked={selectedFeatures.includes(feature.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedFeatures([...selectedFeatures, feature.id]);
                            } else {
                              setSelectedFeatures(selectedFeatures.filter(f => f !== feature.id));
                            }
                          }}
                        />
                        <Label htmlFor={feature.id} className="cursor-pointer">{feature.name}</Label>
                      </div>
                      <span className="text-sm text-gray-600">+${feature.cost.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Base Cost</span>
                    <span>${project.basePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Size ({size[0]} {project.unit})</span>
                    <span>${(size[0] * project.unitPrice).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Quality Multiplier</span>
                    <span>×{qualityMult}</span>
                  </div>
                  {selectedFeatures.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Features</span>
                      <span>+${features[projectType as keyof typeof features]
                        .filter(f => selectedFeatures.includes(f.id))
                        .reduce((sum, f) => sum + f.cost, 0).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold">Estimated Total</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ${totalCost.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">
                    *This is a ballpark estimate. Final costs may vary based on specific requirements and site conditions.
                  </p>

                  <Dialog open={showQuote} onOpenChange={setShowQuote}>
                    <DialogTrigger asChild>
                      <Button className="w-full" size="lg">Request Formal Quote</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Request Formal Quote</DialogTitle>
                        <DialogDescription>
                          We'll review your project details and provide a detailed quote within 24 hours.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        alert('Quote request submitted! We\'ll contact you within 24 hours.');
                        setShowQuote(false);
                      }} className="space-y-4">
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" required />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" required />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input id="phone" type="tel" required />
                        </div>
                        <div>
                          <Label htmlFor="notes">Additional Notes</Label>
                          <Textarea id="notes" rows={3} />
                        </div>
                        <Button type="submit" className="w-full">Submit Request</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
