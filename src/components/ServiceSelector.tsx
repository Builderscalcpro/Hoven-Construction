import React, { useState, useEffect } from 'react';
import { ChefHat, Bath, Home, ArrowRight, Sparkles, Clock, DollarSign, CheckCircle } from 'lucide-react';

const ServiceSelector = () => {
  const [selectedService, setSelectedService] = useState('kitchen');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [appointmentsLeft, setAppointmentsLeft] = useState(3);
  const [isUrgent, setIsUrgent] = useState(false);
  const [stopPulsing, setStopPulsing] = useState(false);

  useEffect(() => {
    // After 45 seconds, change to urgent state
    const urgencyTimer = setTimeout(() => {
      setAppointmentsLeft(2);
      setIsUrgent(true);
      
      // Stop pulsing after 5 seconds
      setTimeout(() => {
        setStopPulsing(true);
      }, 5000);
    }, 45000);

    return () => clearTimeout(urgencyTimer);
  }, []);

  const services = [
    {
      id: 'kitchen',
      icon: ChefHat,
      title: 'Kitchen',
      subtitle: 'Culinary Excellence',
      description: 'Transform your kitchen into a chef-worthy masterpiece',
      price: 'From $45,000',
      timeline: '6-8 weeks',
      features: [
        'Custom cabinetry design',
        'Premium appliance integration',
        'Natural stone countertops',
        'Designer lighting systems'
      ],
      gradient: 'from-amber-600 to-orange-600',
      lightGradient: 'from-amber-50 to-orange-50',
      image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=1200&q=85'
    },
    {
      id: 'bathroom',
      icon: Bath,
      title: 'Bathroom',
      subtitle: 'Spa-Like Sanctuary',
      description: 'Create your personal oasis of relaxation and luxury',
      price: 'From $25,000',
      timeline: '4-5 weeks',
      features: [
        'Heated flooring systems',
        'Rain shower installation',
        'Floating vanity designs',
        'Smart mirror technology'
      ],
      gradient: 'from-blue-600 to-cyan-600',
      lightGradient: 'from-blue-50 to-cyan-50',
      image: 'https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=1200&q=85'
    },
    {
      id: 'adu',
      icon: Home,
      title: 'ADU',
      subtitle: 'Additional Living',
      description: 'Maximize your property with sophisticated additional units',
      price: 'From $150,000',
      timeline: '12-16 weeks',
      features: [
        'Complete architectural design',
        'Permit expediting service',
        'Energy-efficient construction',
        'Turnkey project delivery'
      ],
      gradient: 'from-purple-600 to-pink-600',
      lightGradient: 'from-purple-50 to-pink-50',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=85'
    }
  ];

  const selectedServiceData = services.find(s => s.id === selectedService);

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center mb-6">
          <Sparkles className="w-6 h-6 text-amber-500 mr-3" />
          <span className="text-sm font-semibold tracking-[0.2em] text-gray-500 uppercase">
            Our Services
          </span>
          <Sparkles className="w-6 h-6 text-amber-500 ml-3" />
        </div>
        <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-4">
          Elevate Your
          <span className="font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"> Living Space</span>
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Discover the perfect transformation for your home with our premium renovation services
        </p>
      </div>

      {/* Service Cards */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => setSelectedService(service.id)}
            onMouseEnter={() => setHoveredCard(service.id)}
            onMouseLeave={() => setHoveredCard(null)}
            className={`
              relative group cursor-pointer overflow-hidden rounded-2xl
              transition-all duration-500 transform
              ${selectedService === service.id 
                ? 'scale-105 shadow-2xl' 
                : 'hover:scale-105 hover:shadow-xl'}
            `}
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ 
                backgroundImage: `url('${service.image}')`
              }}
            />
            
            {/* Dark Overlay for readability */}
            <div className={`
              absolute inset-0 bg-black 
              ${selectedService === service.id ? 'bg-opacity-40' : 'bg-opacity-50'}
              transition-all duration-500 group-hover:bg-opacity-30
            `} />
            
            {/* Content */}
            <div className="relative z-10 p-8 h-[320px] flex flex-col justify-between text-white">
              <div>
                {/* Icon and Title */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`
                    p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20
                    transition-all duration-300
                    ${selectedService === service.id ? 'scale-110' : ''}
                  `}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  {selectedService === service.id && (
                    <CheckCircle className="w-6 h-6 text-white animate-pulse" />
                  )}
                </div>
                
                <h3 className="text-3xl font-bold mb-1">
                  {service.title}
                </h3>
                <p className="text-white/80 text-sm font-light tracking-wider mb-3">
                  {service.subtitle}
                </p>
                <p className="text-white/90 leading-relaxed">
                  {service.description}
                </p>
              </div>
              
              {/* Price and Timeline */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-white/70" />
                    <span className="text-lg font-semibold">{service.price}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-white/70" />
                    <span className="text-sm text-white/90">{service.timeline}</span>
                  </div>
                </div>
                
                {/* Selection Indicator */}
                <div className={`
                  h-1 rounded-full bg-white/30 overflow-hidden
                  transition-all duration-500
                `}>
                  <div className={`
                    h-full bg-white transition-all duration-700
                    ${selectedService === service.id ? 'w-full' : 'w-0'}
                  `} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Service Details */}
      {selectedServiceData && (
        <div className={`
          rounded-3xl p-12 bg-gradient-to-br ${selectedServiceData.lightGradient}
          border border-gray-100 shadow-xl
          transition-all duration-700 transform
        `}>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left Column - Features */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">
                What's Included
              </h3>
              <div className="space-y-4">
                {selectedServiceData.features.map((feature, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-4 opacity-0 animate-fadeIn"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`
                      w-10 h-10 rounded-full bg-gradient-to-br ${selectedServiceData.gradient}
                      flex items-center justify-center flex-shrink-0
                    `}>
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-700 text-lg">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right Column - CTA */}
            <div className="flex flex-col justify-center">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">
                  Ready to Transform Your {selectedServiceData.title}?
                </h4>
                <p className="text-gray-600 mb-6">
                  Schedule a free consultation with our design experts and receive a detailed quote tailored to your vision.
                </p>
                <div className="space-y-4">
                  <button
                    onClick={() => window.location.href = '/book-consultation'}
                    className={`
                      w-full px-6 py-4 rounded-xl font-semibold text-white
                      bg-gradient-to-r ${selectedServiceData.gradient}
                      hover:shadow-lg transform transition-all hover:scale-105
                      flex items-center justify-center gap-2
                    `}
                  >
                    Schedule Free Consultation
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => window.location.href = '/book-consultation'}
                    className={`
                      w-full px-6 py-4 rounded-xl font-semibold text-white
                      transition-all duration-300 transform hover:scale-105
                      ${isUrgent 
                        ? `bg-red-600 hover:bg-red-700 ${!stopPulsing ? 'animate-pulse' : ''}` 
                        : 'bg-green-600 hover:bg-green-700'}
                    `}
                  >
                    Only {appointmentsLeft} appointment{appointmentsLeft !== 1 ? 's' : ''} left
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ServiceSelector;