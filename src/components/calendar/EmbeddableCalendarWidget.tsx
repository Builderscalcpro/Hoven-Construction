import React, { useState, useEffect } from 'react';
import { Calendar, Clock, X, RefreshCw, AlertCircle, Phone, MessageSquare } from 'lucide-react';
import { format, addDays, parseISO, isBefore, isAfter } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { unifiedCalendarService } from '@/lib/unifiedCalendarService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface TimeSlot {
  time: string;
  available: boolean;
  date: string;
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  status: string;
  sms_notifications_enabled?: boolean;
}

export function EmbeddableCalendarWidget() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState(false);
  const [existingAppointment, setExistingAppointment] = useState<Appointment | null>(null);
  const [mode, setMode] = useState<'book' | 'manage'>('book');
  const [smsOptIn, setSmsOptIn] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    notes: ''
  });

  useEffect(() => {
    fetchAvailability(selectedDate);
    checkExistingAppointment();
  }, [selectedDate]);

  const fetchAvailability = async (date: Date) => {
    setLoading(true);
    try {
      const slots = await unifiedCalendarService.getAvailableSlots(date);
      setTimeSlots(slots);
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
    setLoading(false);
  };

  const checkExistingAppointment = async () => {
    const email = localStorage.getItem('appointment_email');
    if (email) {
      const { data } = await supabase
        .from('appointments')
        .select('*')
        .eq('email', email)
        .eq('status', 'confirmed')
        .single();
      
      if (data) {
        setExistingAppointment(data);
        setMode('manage');
      }
    }
  };

  const handleBooking = async () => {
    if (!selectedSlot || !formData.email) return;
    
    setLoading(true);
    try {
      // First, handle SMS opt-in if phone provided
      if (formData.phone && smsOptIn) {
        await supabase.functions.invoke('send-sms', {
          body: {
            to: formData.phone,
            message: `Appointment confirmed for ${format(parseISO(selectedSlot.date), 'MMM d')} at ${selectedSlot.time}. You'll receive reminders 24h and 1h before.`,
            messageType: 'confirmation'
          }
        });
      }

      const { data, error } = await supabase
        .from('consultations')
        .insert({
          consultation_date: selectedSlot.date,
          consultation_time: selectedSlot.time,
          name: formData.name,
          email: formData.email,
          phone_number: formData.phone,
          service_type: formData.service,
          notes: formData.notes,
          status: 'confirmed',
          sms_notifications_enabled: smsOptIn && !!formData.phone
        })
        .select()
        .single();

      if (!error && data) {
        localStorage.setItem('appointment_email', formData.email);
        await sendNotifications(data, 'booked');
        
        // Send SMS confirmation if opted in
        if (smsOptIn && formData.phone) {
          await supabase.functions.invoke('send-sms', {
            body: {
              to: formData.phone,
              message: `Your consultation is confirmed for ${format(parseISO(data.consultation_date), 'MMMM d, yyyy')} at ${data.consultation_time}. Reply CANCEL to cancel or RESCHEDULE to change.`,
              appointmentId: data.id,
              messageType: 'confirmation'
            }
          });
        }

        toast({
          title: 'Consultation Booked!',
          description: smsOptIn ? 'You will receive SMS reminders.' : 'Check your email for confirmation.',
        });

        setExistingAppointment(data);
        setMode('manage');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: 'Booking Failed',
        description: 'Please try again or contact us.',
        variant: 'destructive'
      });
    }
    setLoading(false);
  };

  const handleReschedule = async () => {
    if (!existingAppointment || !selectedSlot) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('consultations')
        .update({
          consultation_date: selectedSlot.date,
          consultation_time: selectedSlot.time,
          status: 'rescheduled'
        })
        .eq('id', existingAppointment.id);

      if (!error) {
        await sendNotifications(existingAppointment, 'rescheduled');
        
        // Send SMS notification if enabled
        if (existingAppointment.sms_notifications_enabled && existingAppointment.phone) {
          await supabase.functions.invoke('send-sms', {
            body: {
              to: existingAppointment.phone,
              message: `Your appointment has been rescheduled to ${format(parseISO(selectedSlot.date), 'MMMM d, yyyy')} at ${selectedSlot.time}.`,
              appointmentId: existingAppointment.id,
              messageType: 'reschedule'
            }
          });
        }

        toast({
          title: 'Appointment Rescheduled',
          description: 'You will receive a confirmation shortly.',
        });

        setExistingAppointment({
          ...existingAppointment,
          date: selectedSlot.date,
          time: selectedSlot.time
        });
      }
    } catch (error) {
      console.error('Reschedule error:', error);
      toast({
        title: 'Reschedule Failed',
        description: 'Please try again or contact us.',
        variant: 'destructive'
      });
    }
    setLoading(false);
  };

  const handleCancel = async () => {
    if (!existingAppointment) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('consultations')
        .update({ 
          status: 'cancelled',
          cancelled_at: new Date().toISOString()
        })
        .eq('id', existingAppointment.id);

      if (!error) {
        await sendNotifications(existingAppointment, 'cancelled');
        
        // Send SMS notification if enabled
        if (existingAppointment.sms_notifications_enabled && existingAppointment.phone) {
          await supabase.functions.invoke('send-sms', {
            body: {
              to: existingAppointment.phone,
              message: 'Your appointment has been cancelled. Reply BOOK to schedule a new consultation.',
              appointmentId: existingAppointment.id,
              messageType: 'cancellation'
            }
          });
        }

        toast({
          title: 'Appointment Cancelled',
          description: 'Your appointment has been cancelled successfully.',
        });

        localStorage.removeItem('appointment_email');
        setExistingAppointment(null);
        setMode('book');
      }
    } catch (error) {
      console.error('Cancel error:', error);
      toast({
        title: 'Cancellation Failed',
        description: 'Please try again or contact us.',
        variant: 'destructive'
      });
    }
    setLoading(false);
  };

  const sendNotifications = async (appointment: Appointment, action: string) => {
    await supabase.functions.invoke('send-appointment-notification', {
      body: { appointment, action }
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="h-6 w-6 text-blue-600" />
          {mode === 'book' ? 'Schedule Consultation' : 'Manage Appointment'}
        </h2>
        {existingAppointment && (
          <Button
            variant="outline"
            onClick={() => setMode(mode === 'book' ? 'manage' : 'book')}
          >
            {mode === 'book' ? 'Manage Booking' : 'New Booking'}
          </Button>
        )}
      </div>

      {existingAppointment && mode === 'manage' && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Current appointment: {format(parseISO(existingAppointment.date), 'MMMM d, yyyy')} at {existingAppointment.time}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-3">Select Date</h3>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 30 }).map((_, i) => {
              const date = addDays(new Date(), i);
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(date)}
                  disabled={isWeekend}
                  className={`p-2 text-sm rounded ${
                    format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                      ? 'bg-blue-600 text-white'
                      : isWeekend
                      ? 'bg-gray-100 text-gray-400'
                      : 'hover:bg-blue-50'
                  }`}
                >
                  {format(date, 'd')}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Available Times</h3>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
              {timeSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => setSelectedSlot(slot)}
                  disabled={!slot.available}
                  className={`p-2 text-sm rounded flex items-center gap-1 ${
                    selectedSlot?.time === slot.time
                      ? 'bg-blue-600 text-white'
                      : slot.available
                      ? 'border hover:bg-blue-50'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <Clock className="h-3 w-3" />
                  {slot.time}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {mode === 'book' && (
        <div className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-3 border rounded-lg"
          />
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="tel"
              placeholder="Phone Number (for SMS reminders)"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-3 pl-10 border rounded-lg"
            />
          </div>
          
          {formData.phone && (
            <div className="flex items-start space-x-3 bg-blue-50 p-4 rounded-lg">
              <Checkbox
                id="sms-opt-in"
                checked={smsOptIn}
                onCheckedChange={(checked) => setSmsOptIn(checked as boolean)}
              />
              <div className="space-y-1">
                <Label htmlFor="sms-opt-in" className="text-sm font-medium cursor-pointer">
                  <MessageSquare className="inline h-4 w-4 mr-1" />
                  Enable SMS Reminders
                </Label>
                <p className="text-xs text-gray-600">
                  Receive appointment confirmations and reminders via text message (24 hours and 1 hour before).
                  Reply STOP to opt out anytime. Message and data rates may apply.
                </p>
              </div>
            </div>
          )}

          <select
            value={formData.service}
            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">Select Service</option>
            <option value="kitchen">Kitchen Remodeling</option>
            <option value="bathroom">Bathroom Renovation</option>
            <option value="addition">Home Addition</option>
            <option value="general">General Consultation</option>
          </select>
          <textarea
            placeholder="Additional Notes (Optional)"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full p-3 border rounded-lg"
            rows={3}
          />
        </div>
      )}

      <div className="mt-6 flex gap-3">
        {mode === 'book' ? (
          <Button
            onClick={handleBooking}
            disabled={!selectedSlot || !formData.email || loading}
            className="flex-1"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
            Book Consultation
          </Button>
        ) : (
          <>
            <Button
              onClick={handleReschedule}
              disabled={!selectedSlot || loading}
              className="flex-1"
            >
              Reschedule
            </Button>
            <Button
              onClick={handleCancel}
              variant="destructive"
              disabled={loading}
            >
              Cancel Appointment
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}