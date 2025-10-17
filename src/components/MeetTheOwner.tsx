import React from 'react';
import { Award, Shield, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

const MeetTheOwner: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet the Owner</h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Photo Section */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://d64gsuwffb70l.cloudfront.net/6851e91275b884fa54047eb7_1759548898367_138abc8e.jpeg"
                alt="Hein Hoven - Owner of Hoven Construction"
                className="w-full h-auto object-cover"
              />

            </div>
            {/* Award Badge */}
            <div className="absolute -bottom-6 -right-6 bg-amber-500 text-white p-6 rounded-full shadow-xl">
              <Award className="w-12 h-12" />
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Hein Hoven</h3>
              <p className="text-xl text-amber-600 font-semibold mb-4">
                Award-Winning General Contractor in Los Angeles
              </p>
            </div>

            <div className="prose prose-lg text-gray-700 space-y-4">
              <p>
                Since 2009, Hein Hoven has been recognized as one of Los Angeles' most trusted general contractors, 
                completing more than <strong>500 home remodeling and renovation projects</strong>. He specializes in 
                kitchen remodels, bathroom remodels, ADU construction, and large-scale home renovations across 
                Southern California.
              </p>
              <p>
                In 2024, Hein was honored with the <strong>Best Contractor in Los Angeles Award</strong>, adding to 
                his record of multiple awards for craftsmanship and client satisfaction.
              </p>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-1 gap-4 mt-6">
              <Card className="p-4 bg-white border-l-4 border-amber-500">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">500+ Projects Completed</p>
                    <p className="text-sm text-gray-600">Kitchen, bathroom, ADU, and full home renovations</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-white border-l-4 border-amber-500">
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">EPA Lead-Safe Certified Firm</p>
                    <p className="text-sm text-gray-600">NAT-F282538-1 - Highest safety and compliance standards</p>
                  </div>
                </div>

              </Card>

              <Card className="p-4 bg-white border-l-4 border-amber-500">
                <div className="flex items-start gap-3">
                  <Award className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">2024 Best Contractor Award</p>
                    <p className="text-sm text-gray-600">Multiple awards for craftsmanship and client satisfaction</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="mt-8 p-6 bg-amber-50 rounded-lg border-2 border-amber-200">
              <p className="text-lg text-gray-800 italic">
                "Known for his professional yet approachable style, Hein makes the remodeling process seamless 
                and transparent. His guiding principle is simple: <strong>treat every home as if it were his own.</strong>"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeetTheOwner;
