import React from 'react';
import { Shield, Award, Star, CheckCircle, Briefcase, Calendar } from 'lucide-react';

const TrustIndicators: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-y border-amber-400/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
          <div className="text-center text-white">
            <Shield className="w-10 h-10 mx-auto mb-2 text-amber-400" />
            <div className="text-lg font-bold">Licensed & Insured</div>
            <div className="text-xs text-gray-400">CA License #1118018</div>
          </div>
          <div className="text-center text-white">
            <Award className="w-10 h-10 mx-auto mb-2 text-amber-400" />
            <div className="text-lg font-bold">Award Winning</div>
            <div className="text-xs text-gray-400">Best of LA 2024</div>
          </div>
          <div className="text-center text-white">
            <CheckCircle className="w-10 h-10 mx-auto mb-2 text-amber-400" />
            <div className="text-lg font-bold">Quality Guaranteed</div>
            <div className="text-xs text-gray-400">5-Year Warranty</div>
          </div>
          <div className="text-center text-white">
            <Star className="w-10 h-10 mx-auto mb-2 text-amber-400" />
            <div className="text-lg font-bold">5-Star Rated</div>
            <div className="text-xs text-gray-400">100+ Reviews</div>
          </div>
          <div className="text-center text-white">
            <Briefcase className="w-10 h-10 mx-auto mb-2 text-amber-400" />
            <div className="text-lg font-bold">500+ Projects</div>
            <div className="text-xs text-gray-400">Completed Successfully</div>
          </div>
          <div className="text-center text-white">
            <Calendar className="w-10 h-10 mx-auto mb-2 text-amber-400" />
            <div className="text-lg font-bold">15+ Years</div>
            <div className="text-xs text-gray-400">In Business</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;