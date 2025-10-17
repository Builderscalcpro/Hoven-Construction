import React from 'react';
import { MapPin, Phone, Clock, Award, Leaf, Users } from 'lucide-react';

export const LocalSEO: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Serving Los Angeles County
          </h2>
          <p className="text-xl text-gray-600">
            Your trusted local construction partner
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="flex items-center gap-4 p-6 bg-amber-50 rounded-lg">
            <Users className="h-8 w-8 text-amber-600" />
            <div>
              <h3 className="font-semibold text-gray-900">EPA- Lead Certified</h3>
              <p className="text-sm text-gray-600"></p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 bg-green-50 rounded-lg">
            <Leaf className="h-8 w-8 text-green-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Eco-Friendly</h3>
              <p className="text-sm text-gray-600">Sustainable building practices</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 bg-blue-50 rounded-lg">
            <Award className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Licensed & Insured</h3>
              <p className="text-sm text-gray-600">CA License #1118018</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-8 rounded-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <MapPin className="h-6 w-6 text-amber-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                <p className="text-gray-600">641 S Ridgeley Dr<br />Los Angeles, CA 90036</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-6 w-6 text-amber-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                <a href="tel:+13108532131" className="text-amber-600 hover:text-amber-700">
                  (310) 853-2131
                </a>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Clock className="h-6 w-6 text-amber-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Hours</h4>
                <p className="text-gray-600">Mon-Fri: 8AM-6PM<br />Sat: 9AM-4PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
