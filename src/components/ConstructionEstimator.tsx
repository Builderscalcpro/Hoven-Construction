import React, { useState, useEffect } from 'react';
import { Calculator, Home, Bath, ChefHat, Building, TrendingUp, DollarSign, Info } from 'lucide-react';



const ConstructionEstimator = () => {
  const [projectType, setProjectType] = useState('bathroom');
  const [squareFeet, setSquareFeet] = useState(100);
  const [quality, setQuality] = useState('standard');
  const [totalCost, setTotalCost] = useState(0);
  const [breakdown, setBreakdown] = useState({ materials: 0, labor: 0, permits: 0 });

  // Los Angeles 2024 pricing per square foot (based on real contractor data)
  const pricingData = {
    bathroom: {
      standard: { materials: 75, labor: 125, permits: 3 },
      midRange: { materials: 125, labor: 175, permits: 3 },
      luxury: { materials: 200, labor: 250, permits: 3 }
    },
    kitchen: {
      standard: { materials: 100, labor: 150, permits: 4 },
      midRange: { materials: 175, labor: 200, permits: 4 },
      luxury: { materials: 300, labor: 275, permits: 4 }
    },
    adu: {
      standard: { materials: 150, labor: 200, permits: 25 },
      midRange: { materials: 200, labor: 250, permits: 25 },
      luxury: { materials: 275, labor: 325, permits: 25 }
    }
  };

  // Image URLs for different project types and quality levels

  const projectImages = {
    bathroom: {
      standard: 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1760202954112_45927899.webp',
      midRange: 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1760202955111_f941a606.webp',
      luxury: 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1760202956108_b3e72faa.webp'
    },
    kitchen: {
      standard: 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1760202956864_ea4a1bf6.webp',
      midRange: 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1760202957605_53f97c8b.webp',
      luxury: 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1760202958390_6792822d.webp'
    },
    adu: {
      standard: 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1760202959255_34092390.webp',
      midRange: 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1760202960084_bf857e5f.webp',
      luxury: 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1760202960845_383b28b3.webp'
    }
  };


  // Square foot ranges for each project type
  const sizeRanges = {
    bathroom: { min: 40, max: 200, default: 100 },
    kitchen: { min: 70, max: 400, default: 150 },
    adu: { min: 400, max: 1200, default: 600 }
  };

  // Calculate costs whenever inputs change
  useEffect(() => {
    const prices = pricingData[projectType][quality];
    const materialsCost = prices.materials * squareFeet;
    const laborCost = prices.labor * squareFeet;
    const permitsCost = prices.permits * squareFeet;
    
    setBreakdown({
      materials: materialsCost,
      labor: laborCost,
      permits: permitsCost
    });
    
    setTotalCost(materialsCost + laborCost + permitsCost);
  }, [projectType, squareFeet, quality]);

  // Update square feet when project type changes
  useEffect(() => {
    setSquareFeet(sizeRanges[projectType].default);
  }, [projectType]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getQualityDescription = () => {
    const descriptions = {
      standard: {
        bathroom: 'Fiberglass tub, ceramic tile, builder vanity',
        kitchen: 'Laminate counters, stock cabinets, basic appliances',
        adu: 'Vinyl flooring, drywall finish, builder fixtures'
      },
      midRange: {
        bathroom: 'Cast iron tub, porcelain tile, quartz vanity',
        kitchen: 'Quartz counters, semi-custom cabinets, stainless appliances',
        adu: 'Hardwood flooring, quality finishes, branded fixtures'
      },
      luxury: {
        bathroom: 'Freestanding tub, marble tile, custom vanity',
        kitchen: 'Natural stone counters, custom cabinets, pro appliances',
        adu: 'Premium flooring, designer finishes, smart home features'
      }
    };
    return descriptions[quality][projectType];
  };


  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mb-4 shadow-lg">
          <Calculator className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-3">
          Project Cost Estimator
        </h2>
        <p className="text-lg text-gray-600">
          Real-time Los Angeles construction pricing for 2024
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Calculator */}
        <div className="space-y-6">
          {/* Project Type Selector */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <label className="block text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
              Select Project Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'bathroom', icon: Bath, label: 'Bathroom', sublabel: 'Remodel' },
                { id: 'kitchen', icon: ChefHat, label: 'Kitchen', sublabel: 'Renovation' },
                { id: 'adu', icon: Building, label: 'ADU', sublabel: 'Addition' }
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setProjectType(type.id)}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all duration-300
                    ${projectType === type.id 
                      ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg scale-105' 
                      : 'border-gray-200 bg-white hover:border-amber-300 hover:shadow-md'}
                  `}
                >
                  <type.icon className={`w-8 h-8 mx-auto mb-2 ${projectType === type.id ? 'text-amber-600' : 'text-gray-400'}`} />
                  <div className="font-semibold text-sm">{type.label}</div>
                  <div className="text-xs text-gray-500">{type.sublabel}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Square Footage Slider */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <label className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Square Footage
              </label>
              <div className="text-3xl font-bold text-amber-600">
                {squareFeet}
                <span className="text-sm text-gray-500 font-normal ml-1">sq ft</span>
              </div>
            </div>
            
            <input
              type="range"
              min={sizeRanges[projectType].min}
              max={sizeRanges[projectType].max}
              value={squareFeet}
              onChange={(e) => setSquareFeet(Number(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${
                  ((squareFeet - sizeRanges[projectType].min) / 
                  (sizeRanges[projectType].max - sizeRanges[projectType].min)) * 100
                }%, #e5e7eb ${
                  ((squareFeet - sizeRanges[projectType].min) / 
                  (sizeRanges[projectType].max - sizeRanges[projectType].min)) * 100
                }%, #e5e7eb 100%)`
              }}
            />
            
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>{sizeRanges[projectType].min}</span>
              <span>{sizeRanges[projectType].max}</span>
            </div>
          </div>

          {/* Quality Level Selector */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <label className="block text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
              Material Finish
            </label>
            <div className="space-y-3">
              {[
                { id: 'standard', label: 'Standard', price: '$', description: 'Builder-grade materials' },
                { id: 'midRange', label: 'Mid-Range', price: '$$', description: 'Quality branded fixtures' },
                { id: 'luxury', label: 'High-End', price: '$$$', description: 'Premium designer finishes' }
              ].map((level) => (
                <button
                  key={level.id}
                  onClick={() => setQuality(level.id)}
                  className={`
                    w-full p-4 rounded-xl border-2 transition-all duration-300 text-left
                    ${quality === level.id 
                      ? 'border-amber-500 bg-gradient-to-r from-amber-50 to-orange-50 shadow-lg' 
                      : 'border-gray-200 bg-white hover:border-amber-300 hover:shadow-md'}
                  `}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-gray-900">{level.label}</span>
                      <div className="text-xs text-gray-500 mt-1">{level.description}</div>
                    </div>
                    <span className={`text-2xl font-bold ${quality === level.id ? 'text-amber-600' : 'text-gray-400'}`}>
                      {level.price}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            
            {/* Quality Description */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">Includes:</span> {getQualityDescription()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Visual & Results */}
        <div className="space-y-6">
          {/* Dynamic Image Display */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={projectImages[projectType][quality]}
              alt={`${quality} ${projectType}`}
              className="w-full h-[400px] object-cover transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="font-semibold text-sm uppercase tracking-wider mb-1">
                {quality.replace('midRange', 'Mid-Range')} {projectType}
              </div>
              <div className="text-3xl font-bold">
                {formatCurrency(totalCost / squareFeet)}/sq ft
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center uppercase tracking-wider text-sm">
              <TrendingUp className="w-5 h-5 mr-2 text-amber-600" />
              Estimated Total Cost
            </h3>
            
            <div className="space-y-4">
              {[
                { label: 'Materials', value: breakdown.materials, color: 'blue' },
                { label: 'Labor', value: breakdown.labor, color: 'green' },
                { label: 'Permits', value: breakdown.permits, color: 'purple' }
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">{item.label}</span>
                    <span className="text-sm font-bold text-gray-900">{formatCurrency(item.value)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r from-${item.color}-400 to-${item.color}-600 transition-all duration-500`}
                      style={{ width: `${(item.value / totalCost) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-6 pt-6 border-t-2 border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-gray-600 text-sm">Total Project Cost</div>
                  <div className="text-xs text-gray-500 mt-1">*Estimate only</div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                    {formatCurrency(totalCost)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {formatCurrency(totalCost / squareFeet)}/sq ft
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => window.location.href = '/book-consultation'}
            className="w-full px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-lg hover:from-amber-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-xl"
          >
            Get Quote →
          </button>
        </div>
      </div>

      <style jsx>{`

        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 28px;
          height: 28px;
          background: linear-gradient(135deg, #f59e0b, #ea580c);
          cursor: pointer;
          border-radius: 50%;
          border: 4px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: all 0.2s;
        }
        
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 28px;
          height: 28px;
          background: linear-gradient(135deg, #f59e0b, #ea580c);
          cursor: pointer;
          border-radius: 50%;
          border: 4px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: all 0.2s;
        }
        
        .slider::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default ConstructionEstimator;
