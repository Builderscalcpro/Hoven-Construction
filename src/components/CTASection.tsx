import React, { useState } from 'react';
import { Phone, Calendar, MessageSquare, Download } from 'lucide-react';

const CTASection: React.FC = () => {
  const [showScheduler, setShowScheduler] = useState(false);
  
  const handleDownloadGuide = () => {
    alert('Your free ADU Planning Guide has been sent to your email!');
  };

  return (
    <section className="py-20 bg-gradient-to-br from-amber-500 to-amber-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Home?
          </h2>
          <p className="text-xl mb-8 text-amber-50">
            Get started with a free consultation and see your project come to life
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button 
              onClick={() => window.location.href = 'tel:+13108532131'} 
              className="px-8 py-4 bg-white text-amber-600 font-bold rounded-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Call Now: (310) 853.2131
            </button>
            <button 
              onClick={() => setShowScheduler(true)} 
              className="px-8 py-4 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Schedule Consultation
            </button>
            <button 
              onClick={handleDownloadGuide} 
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Free ADU Guide
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <MessageSquare className="w-8 h-8 mx-auto mb-2" />
              <div className="font-semibold">24/7 Support</div>
              <div className="text-sm text-amber-100">Always here to help</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Calendar className="w-8 h-8 mx-auto mb-2" />
              <div className="font-semibold">Free Estimate</div>
              <div className="text-sm text-amber-100">No obligations</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Phone className="w-8 h-8 mx-auto mb-2" />
              <div className="font-semibold">Quick Response</div>
              <div className="text-sm text-amber-100">Within 24 hours</div>
            </div>
          </div>
        </div>
      </div>

      {showScheduler && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold mb-4 text-slate-900">Schedule Your Consultation</h3>
            <div className="space-y-4">
              <input type="date" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500" />
              <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500">
                <option>9:00 AM</option>
                <option>10:00 AM</option>
                <option>11:00 AM</option>
                <option>2:00 PM</option>
                <option>3:00 PM</option>
                <option>4:00 PM</option>
              </select>
              <input type="text" placeholder="Your Name" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500" />
              <input type="tel" placeholder="Phone Number" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500" />
              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    alert('Consultation scheduled! We\'ll call to confirm.');
                    setShowScheduler(false);
                  }} 
                  className="flex-1 bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 font-semibold"
                >
                  Schedule
                </button>
                <button 
                  onClick={() => setShowScheduler(false)} 
                  className="flex-1 bg-gray-200 py-2 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CTASection;
