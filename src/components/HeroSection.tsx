import React, { useState, useEffect } from 'react';
import { ChevronDown, Phone, Calendar, ArrowRight, AlertCircle, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { OptimizedImage } from '@/components/OptimizedImage';
import VoiceSearch from '@/components/VoiceSearch';

const HeroSection: React.FC = () => {
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleVoiceSearch = (transcript: string) => {
    setSearchQuery(transcript);
    // Navigate based on voice command
    const lowerTranscript = transcript.toLowerCase();
    if (lowerTranscript.includes('kitchen')) {
      navigate('/services/kitchen-remodeling');
    } else if (lowerTranscript.includes('bathroom')) {
      navigate('/services/bathroom-renovation');
    } else if (lowerTranscript.includes('adu') || lowerTranscript.includes('addition') || lowerTranscript.includes('home addition')) {
      navigate('/services/home-additions');

    } else if (lowerTranscript.includes('consultation') || lowerTranscript.includes('appointment') || lowerTranscript.includes('schedule')) {
      setShowConsultModal(true);
    } else if (lowerTranscript.includes('blog') || lowerTranscript.includes('article')) {
      navigate('/blog');
    } else if (lowerTranscript.includes('service')) {
      navigate('/services');
    } else {
      // Default to opening consultation with the query
      setShowConsultModal(true);
    }
  };



  // Preload critical hero images
  useEffect(() => {
    const heroImage = 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1759425618389_a8a5c4c4.webp';
    const logoImage = 'https://d64gsuwffb70l.cloudfront.net/6851e91275b884fa54047eb7_1759425593381_497bd79a.webp';
    
    const preloadLink1 = document.createElement('link');
    preloadLink1.rel = 'preload';
    preloadLink1.as = 'image';
    preloadLink1.href = heroImage;
    document.head.appendChild(preloadLink1);
    
    const preloadLink2 = document.createElement('link');
    preloadLink2.rel = 'preload';
    preloadLink2.as = 'image';
    preloadLink2.href = logoImage;
    document.head.appendChild(preloadLink2);
    
    return () => {
      document.head.removeChild(preloadLink1);
      document.head.removeChild(preloadLink2);
    };
  }, []);

  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };


  const openConsultation = () => {
    setShowConsultModal(true);
  };

  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1759425618389_a8a5c4c4.webp')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/60"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div>
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-amber-500/20 text-amber-400 rounded-full text-sm font-semibold">
                  Licensed & Insured • Est. 2009 • 15+ Years Excellence
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Transform Your Space with 
                <span className="text-amber-400"> Expert Craftsmanship</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-200 mb-6">
                Premium Remodels & ADU Construction in Los Angeles. 
                Increase your home value by up to 30% with our expert craftsmanship.
              </p>
              
              {/* Voice Search Bar */}
              <div className="mb-8 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-amber-400/30">
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-amber-400" />
                  <input
                    type="text"
                    placeholder="Try: 'Kitchen remodel' or 'Schedule consultation'"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && searchQuery) {
                        handleVoiceSearch(searchQuery);
                      }
                    }}
                    className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
                  />
                  <VoiceSearch 
                    onTranscript={handleVoiceSearch}
                    placeholder="Use voice search"
                    className="shrink-0"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  🎤 Click the mic or type to search our services
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button 
                  onClick={openConsultation}
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-lg hover:from-amber-600 hover:to-amber-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                >
                  Get Free Consultation
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => window.location.href = 'tel:+13108532131'}
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2 border border-amber-400/30"
                >
                  <Phone className="w-5 h-5" />
                  Call 310.853.2131
                </button>
              </div>

              
              <div className="grid grid-cols-3 gap-6 text-white">
                <div>
                  <div className="text-3xl font-bold text-amber-400">500+</div>
                  <div className="text-sm text-gray-300">Projects Since 2009</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-amber-400">4.9★</div>
                  <div className="text-sm text-gray-300">Customer Rating</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-amber-400">100%</div>
                  <div className="text-sm text-gray-300">On-Time Delivery</div>
                </div>
              </div>
            </div>
            
            {/* Right side - Logo */}
            <div className="flex justify-center lg:justify-end">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-amber-400/20">
                <OptimizedImage
                  src="https://d64gsuwffb70l.cloudfront.net/6851e91275b884fa54047eb7_1759425593381_497bd79a.webp"
                  alt="Hoven Construction Corp. - Premier Los Angeles Construction Company Logo"
                  width={400}
                  height={400}
                  className="w-full max-w-sm h-auto"
                  priority={true}
                  quality={90}
                />
                <div className="text-center mt-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Hoven Construction Corp.</h2>
                  <p className="text-amber-400 font-semibold">Serving Los Angeles Since 2009</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <button 
          onClick={scrollToServices}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
        >
          <ChevronDown className="w-8 h-8 text-amber-400" />
        </button>
      </div>

      {showConsultModal && (
        <ConsultModal onClose={() => setShowConsultModal(false)} />
      )}
    </>
  );
};

const ConsultModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [spotsAvailable, setSpotsAvailable] = useState(3);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'remodel',
    message: ''
  });

  // Countdown timer for appointment spots - changes from 3 to 2 after 15 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setSpotsAvailable(2);
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  // Generate week dates
  const getWeekDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate) {
      toast({ 
        title: 'Please select a date', 
        description: 'Choose an available date for your consultation',
        variant: 'destructive'
      });
      return;
    }
    
    // Save to database if user is logged in
    if (user) {
      try {
        await supabase.from('quote_history').insert({
          user_id: user.id,
          project_type: formData.projectType,
          services: [formData.projectType],
          notes: `${formData.message}\nScheduled for: ${selectedDate.toLocaleDateString()}`,
          status: 'pending'
        });
        toast({ title: 'Success', description: 'Consultation request saved to your account!' });
      } catch (error) {
        console.error('Error saving consultation:', error);
      }
    }
    
    alert(`Thank you! Your consultation is scheduled for ${selectedDate.toLocaleDateString()}. We'll contact you within 24 hours to confirm.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl animate-slideUp">
        {/* Appointment Availability Banner */}
        <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 transition-all duration-500 ${
          spotsAvailable === 3 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200 animate-pulse'
        }`}>
          <AlertCircle className={`w-5 h-5 ${spotsAvailable === 3 ? 'text-green-600' : 'text-red-600'}`} />
          <span className={`font-semibold ${spotsAvailable === 3 ? 'text-green-700' : 'text-red-700'}`}>
            {spotsAvailable === 3 
              ? `${spotsAvailable} appointments left this week` 
              : `Only ${spotsAvailable} appointments left this week!`
            }
          </span>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Book Your Free Consultation</h3>
            <p className="text-sm text-gray-600">Select a date below to schedule your appointment</p>
          </div>
        </div>

        {/* Week Calendar - More prominent */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-semibold text-gray-700 mb-3">Choose your preferred date:</p>
          <div className="grid grid-cols-7 gap-2">
            {weekDates.map((date, index) => {
              const isToday = date.toDateString() === new Date().toDateString();
              const isSelected = selectedDate?.toDateString() === date.toDateString();
              // Make some dates unavailable for realism
              const isAvailable = index !== 2 && index !== 5; // Tuesday and Friday unavailable
              
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => isAvailable && setSelectedDate(date)}
                  disabled={!isAvailable}
                  className={`
                    p-3 rounded-lg text-center transition-all transform hover:scale-105
                    ${isAvailable 
                      ? isSelected 
                        ? 'bg-amber-500 text-white shadow-lg scale-105' 
                        : 'bg-white hover:bg-amber-100 cursor-pointer shadow hover:shadow-md'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                    }
                    ${isToday ? 'ring-2 ring-amber-400 ring-offset-2' : ''}
                  `}
                >
                  <div className="text-xs font-semibold">{dayNames[date.getDay()]}</div>
                  <div className="text-xl font-bold">{date.getDate()}</div>
                  <div className="text-xs">{monthNames[date.getMonth()]}</div>
                  {!isAvailable && (
                    <div className="text-xs mt-1">Booked</div>
                  )}
                </button>
              );
            })}
          </div>
          {selectedDate && (
            <div className="mt-3 p-2 bg-amber-50 rounded text-center">
              <span className="text-sm text-amber-700">
                Selected: {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Your Name *"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <input
              type="tel"
              placeholder="Phone Number *"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <input
            type="email"
            placeholder="Email Address *"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            value={formData.projectType}
            onChange={(e) => setFormData({...formData, projectType: e.target.value})}
          >
            <option value="">Select Project Type *</option>
            <option value="remodel">Home Remodel</option>
            <option value="adu">ADU Construction</option>
            <option value="both">Both</option>
          </select>
          <textarea
            placeholder="Tell us about your project (optional)"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
          />
          <div className="flex gap-4">
            <button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 rounded-lg hover:from-amber-600 hover:to-amber-700 font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              Confirm Appointment
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 bg-gray-200 py-3 rounded-lg hover:bg-gray-300 font-semibold transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HeroSection;