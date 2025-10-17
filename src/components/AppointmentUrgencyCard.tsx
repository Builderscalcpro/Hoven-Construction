import React, { useState, useEffect } from 'react';
import { Phone, Clock, AlertCircle, X, CheckCircle } from 'lucide-react';

const AppointmentUrgencyCard = () => {
  const [appointmentsLeft, setAppointmentsLeft] = useState(3);
  const [isUrgent, setIsUrgent] = useState(false);
  const [stopPulsing, setStopPulsing] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    projectType: '',
    message: ''
  });

  useEffect(() => {
    // After 45 seconds, reduce appointments and make urgent
    const urgencyTimer = setTimeout(() => {
      setAppointmentsLeft(2);
      setIsUrgent(true);
      
      // Stop pulsing after 4 seconds
      setTimeout(() => {
        setStopPulsing(true);
      }, 4000);
    }, 45000);

    return () => clearTimeout(urgencyTimer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you! We\'ll call you within 30 minutes to confirm your consultation.');
    setShowBookingModal(false);
    setFormData({ name: '', phone: '', email: '', projectType: '', message: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      {/* Single Urgency Card - No Calendar */}
      <div className="max-w-xl mx-auto">
        <div className="bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-xl p-8 border border-amber-100">
          {/* Header */}
          <div className="text-center mb-6">
            {isUrgent && (
              <div className="inline-flex items-center gap-2 mb-3 animate-bounce">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-sm font-semibold text-red-600">Limited Availability</span>
              </div>
            )}
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Start Your Project Today
            </h3>
            <p className="text-gray-600">
              Free consultation with LA's top-rated contractor
            </p>
          </div>

          {/* Availability Status */}
          <div className={`
            rounded-xl p-4 mb-6 text-center
            ${isUrgent ? 'bg-red-50 border-2 border-red-200' : 'bg-green-50 border-2 border-green-200'}
            transition-all duration-500
          `}>
            <div className="flex items-center justify-center gap-3">
              <div className={`
                w-3 h-3 rounded-full
                ${isUrgent ? 'bg-red-500' : 'bg-green-500'}
                ${isUrgent && !stopPulsing ? 'animate-pulse' : ''}
              `} />
              <span className={`
                text-lg font-bold
                ${isUrgent ? 'text-red-700' : 'text-green-700'}
              `}>
                Only {appointmentsLeft} appointment{appointmentsLeft !== 1 ? 's' : ''} left this week
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Average wait time: 2-3 weeks for non-urgent bookings
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-3 mb-6">
            {[
              'Free in-home consultation',
              'Detailed project quote',
              'No obligation to proceed'
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={() => setShowBookingModal(true)}
            className={`
              w-full py-4 px-6 rounded-xl font-bold text-white text-lg
              transform transition-all duration-300 hover:scale-105 hover:shadow-xl
              ${isUrgent 
                ? `bg-red-600 hover:bg-red-700 ${!stopPulsing ? 'animate-pulse' : ''}` 
                : 'bg-green-600 hover:bg-green-700'}
            `}
          >
            Book Free Consultation Now
          </button>

          {/* Contact Info */}
          <div className="flex items-center justify-center gap-6 mt-6">
            <a href="tel:+13108532131" className="flex items-center gap-2 text-gray-600 hover:text-amber-600 transition-colors">
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">310.853.2131</span>
            </a>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Mon-Sat 8am-6pm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Book Your Consultation</h3>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="(310) 555-0123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Type *
                  </label>
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select a project type</option>
                    <option value="kitchen">Kitchen Remodeling</option>
                    <option value="bathroom">Bathroom Renovation</option>
                    <option value="adu">ADU Construction</option>
                    <option value="general">General Remodeling</option>
                    <option value="other">Other Project</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Details (Optional)
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Tell us about your project..."
                  />
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  type="submit"
                  className={`
                    w-full py-3 rounded-lg font-semibold text-white
                    transition-all duration-300 transform hover:scale-105
                    ${isUrgent ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
                  `}
                >
                  Confirm Booking
                </button>
                <p className="text-xs text-gray-500 text-center">
                  By booking, you agree to receive a confirmation call within 30 minutes during business hours
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AppointmentUrgencyCard;