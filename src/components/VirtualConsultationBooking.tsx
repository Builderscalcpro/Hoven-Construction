import { useState } from 'react';
import { Calendar, Video, Check, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

interface VirtualConsultationBookingProps {
  onComplete: (consultationId: string) => void;
}

export default function VirtualConsultationBooking({ onComplete }: VirtualConsultationBookingProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [consultationType, setConsultationType] = useState<'virtual' | 'in-person'>('virtual');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Define available time slots
  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM'
  ];

  // Handle date change and load available slots
  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    setSelectedTime('');
    setValidationError('');
    
    if (newDate) {
      // Simulate loading available slots
      setLoadingSlots(true);
      try {
        // In production, fetch real availability from calendar
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // For now, show all slots as available
        setAvailableSlots(timeSlots);
      } catch (error) {
        console.error('Error loading slots:', error);
        setAvailableSlots(timeSlots); // Fallback to all slots
      } finally {
        setLoadingSlots(false);
      }
    } else {
      setAvailableSlots([]);
    }
  };

  // Handle form submission with timeout protection
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email) {
      setValidationError('Please fill in all required fields');
      return;
    }
    
    if (!selectedDate) {
      setValidationError('Please select a date for your consultation');
      return;
    }
    
    if (!selectedTime) {
      setValidationError('Please select a time for your consultation');
      return;
    }

    setLoading(true);
    setValidationError('');

    // Set a timeout for the entire operation
    const timeoutId = setTimeout(() => {
      setLoading(false);
      setValidationError('Request timed out. Please try again.');
    }, 15000); // 15 second timeout

    try {
      // Convert time to proper format
      const [time, period] = selectedTime.split(' ');
      const [hours, minutes] = time.split(':');
      let hour24 = parseInt(hours);
      if (period === 'PM' && hour24 !== 12) hour24 += 12;
      if (period === 'AM' && hour24 === 12) hour24 = 0;
      const timeString = `${hour24.toString().padStart(2, '0')}:${minutes}:00`;
      
      const consultationDateTime = new Date(`${selectedDate}T${timeString}`);
      const endDateTime = new Date(consultationDateTime);
      endDateTime.setHours(endDateTime.getHours() + 1);

      // Generate a simple meet link (in production, use actual Google Calendar API)
      const videoCallLink = consultationType === 'virtual' 
        ? `https://meet.google.com/abc-${Math.random().toString(36).substr(2, 4)}-xyz`
        : null;

      // Create consultation record with timeout protection
      const { data, error } = await Promise.race([
        supabase
          .from('consultations')
          .insert({
            client_name: formData.name,
            client_email: formData.email,
            client_phone: formData.phone,
            consultation_type: consultationType,
            consultation_date: consultationDateTime.toISOString(),
            video_call_link: videoCallLink,
            status: 'scheduled'
          })
          .select()
          .single(),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Database timeout')), 10000)
        )
      ]);

      if (error) throw error;

      // Clear the timeout since operation succeeded
      clearTimeout(timeoutId);

      // Send confirmation emails to both client and business
      try {
        await supabase.functions.invoke('send-appointment-notification', {
          body: { 
            appointment: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              date: selectedDate,
              time: selectedTime,
              service: consultationType === 'virtual' ? 'Virtual Consultation' : 'In-Person Consultation',
              notes: videoCallLink ? `Video Call Link: ${videoCallLink}` : 'In-person meeting at property'
            }
          }
        });
      } catch (emailError) {
        console.warn('Email notification failed:', emailError);
        // Don't fail the booking if email fails
      }


      toast({ 
        title: 'Success!', 
        description: 'Your consultation has been booked successfully.' 
      });
      
      onComplete(data.id);

    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error('Booking error:', error);
      
      const errorMessage = error.message === 'Database timeout' 
        ? 'The booking system is not responding. Please try again.'
        : 'Failed to book consultation. Please try again or call us at (310) 853-2131.';
      
      setValidationError(errorMessage);
      toast({ 
        title: 'Booking Failed', 
        description: errorMessage, 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Book Your Consultation</h2>
        <p className="text-gray-600">Choose your preferred date, time, and consultation type</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
            placeholder="(555) 123-4567"
            disabled={loading}
          />
        </div>

        {/* Consultation Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Consultation Type <span className="text-red-500">*</span>
          </label>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setConsultationType('virtual')}
              className={`p-4 border-2 rounded-lg flex items-center gap-3 transition ${
                consultationType === 'virtual' ? 'border-amber-500 bg-amber-50' : 'border-gray-200'
              }`}
              disabled={loading}
            >
              <Video className="w-6 h-6" />
              <div className="text-left">
                <div className="font-semibold">Virtual Consultation</div>
                <div className="text-sm text-gray-600">Video call via Google Meet</div>
              </div>
              {consultationType === 'virtual' && <Check className="w-5 h-5 text-amber-500 ml-auto" />}
            </button>
            <button
              type="button"
              onClick={() => setConsultationType('in-person')}
              className={`p-4 border-2 rounded-lg flex items-center gap-3 transition ${
                consultationType === 'in-person' ? 'border-amber-500 bg-amber-50' : 'border-gray-200'
              }`}
              disabled={loading}
            >
              <Calendar className="w-6 h-6" />
              <div className="text-left">
                <div className="font-semibold">In-Person Consultation</div>
                <div className="text-sm text-gray-600">Meet at your property</div>
              </div>
              {consultationType === 'in-person' && <Check className="w-5 h-5 text-amber-500 ml-auto" />}
            </button>
          </div>
        </div>

        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            required
            min={new Date().toISOString().split('T')[0]}
            max={new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
            value={selectedDate}
            onChange={handleDateChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 ${
              !selectedDate && validationError ? 'border-red-300' : ''
            }`}
            disabled={loading}
          />
        </div>

        {/* Time Slots */}
        {selectedDate && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Time <span className="text-red-500">*</span>
            </label>
            {loadingSlots ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                <span className="ml-2 text-gray-600">Loading available times...</span>
              </div>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {availableSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => {
                      setSelectedTime(time);
                      setValidationError('');
                    }}
                    className={`px-3 py-2 text-sm rounded-lg border transition ${
                      selectedTime === time
                        ? 'border-amber-500 bg-amber-50 text-amber-700 font-medium'
                        : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50'
                    }`}
                    disabled={loading}
                  >
                    {time}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {!selectedDate && (
          <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500 text-sm">
            Please select a date to see available time slots
          </div>
        )}

        {/* Error Display */}
        {validationError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {validationError}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !selectedDate || !selectedTime}
          className="w-full py-4 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Booking your consultation...
            </>
          ) : (
            'Continue to Questionnaire'
          )}
        </button>

        {/* Support Info */}
        <p className="text-center text-sm text-gray-500">
          Need help? Call us at{' '}
          <a href="tel:+13108532131" className="text-amber-500 hover:underline">
            (310) 853-2131
          </a>
        </p>
      </form>
    </div>
  );
}