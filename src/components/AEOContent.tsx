import React from 'react';
import { TrendingUp, Award, Clock, DollarSign } from 'lucide-react';

// AEO-optimized content with statistics and conversational answers
const AEOContent: React.FC = () => {
  const statistics = [
    {
      icon: <DollarSign className="w-8 h-8 text-amber-500" />,
      stat: "$45,000",
      label: "Average Kitchen Remodel Cost",
      source: "HomeAdvisor 2024"
    },
    {
      icon: <Clock className="w-8 h-8 text-amber-500" />,
      stat: "8-16 weeks",
      label: "Typical Renovation Timeline",
      source: "NAHB Industry Report"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-amber-500" />,
      stat: "70-80%",
      label: "Average ROI on Kitchen Remodel",
      source: "Remodeling Magazine 2024"
    },
    {
      icon: <Award className="w-8 h-8 text-amber-500" />,
      stat: "98%",
      label: "Customer Satisfaction Rate",
      source: "Hoven Construction Data"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Construction Industry Insights & Data
          </h2>
          <p className="text-lg text-gray-600">
            Current statistics and trends in Los Angeles home renovation
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statistics.map((item, index) => (
            <div key={index} className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-lg shadow-md border border-amber-100">
              <div className="flex justify-center mb-4">{item.icon}</div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">{item.stat}</div>
                <div className="text-sm font-medium text-gray-700 mb-1">{item.label}</div>
                <div className="text-xs text-gray-500">{item.source}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AEOContent;
