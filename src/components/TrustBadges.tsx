import React from 'react';
import { Shield, Award, CheckCircle, Star, Users, Clock } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const badges = [
    {
      icon: Shield,
      title: 'Licensed & Insured',
      description: 'CA License #1118018'
    },
    {
      icon: Award,
      title: 'Award Winning',
      description: 'Best of LA 2024'
    },
    {
      icon: CheckCircle,
      title: 'Quality Guaranteed',
      description: '5-Year Warranty'
    },
    {
      icon: Star,
      title: '5-Star Rated',
      description: '100+ Reviews'
    },
    {
      icon: Users,
      title: '500+ Projects',
      description: 'Completed Successfully'
    },
    {
      icon: Clock,
      title: '15+ Years',
      description: 'In Business'
    }
  ];

  return (
    <section className="py-12 bg-gray-50 border-y">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {badges.map((badge, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-3">
                <badge.icon className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{badge.title}</h3>
              <p className="text-xs text-gray-600">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
