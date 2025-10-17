import { useState } from "react";
import { Calendar, Clock, User, Mail, Phone, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface AppointmentBookingFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AppointmentBookingForm({ onSuccess, onCancel }: AppointmentBookingFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    service: "general",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];

  const services = [
    { value: "general", label: "General Consultation" },
    { value: "kitchen", label: "Kitchen Remodeling" },
    { value: "bathroom", label: "Bathroom Renovation" },
    { value: "addition", label: "Home Addition" },
    { value: "whole-house", label: "Whole House Remodel" }
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save appointment to database
      const { data: appointment, error } = await supabase.from("appointments").insert({
        client_name: formData.name,
        client_email: formData.email,
        client_phone: formData.phone,
        appointment_date: formData.date,
        appointment_time: formData.time,
        service_type: formData.service,
        notes: formData.notes,
        status: "scheduled",
        created_at: new Date().toISOString()
      }).select().single();

      if (error) throw error;

      // Send confirmation emails
      try {
        await supabase.functions.invoke('send-appointment-notification', {
          body: { 
            appointment: {
              id: appointment.id,
              client_name: formData.name,
              client_email: formData.email,
              client_phone: formData.phone,
              appointment_date: formData.date,
              appointment_time: formData.time,
              service_type: formData.service,
              notes: formData.notes
            }
          }
        });
      } catch (emailError) {
        console.error("Email notification error:", emailError);
        // Don't fail the booking if email fails
      }

      setShowSuccess(true);
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to book appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }



  if (showSuccess) {
    return (
      <div className="p-6 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold mb-2">Appointment Booked!</h3>
        <p className="text-sm text-gray-600">We'll send you a confirmation email shortly.</p>
      </div>
    );
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="p-4 max-h-[450px] overflow-y-auto">
      <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
        <Calendar className="h-5 w-5 text-amber-500" />
        Book Your Free Consultation
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="flex items-center gap-1 text-xs font-medium mb-1">
            <User className="h-3 w-3" /> Name
          </label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 border rounded-lg text-sm focus:border-amber-500 outline-none"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="flex items-center gap-1 text-xs font-medium mb-1">
              <Mail className="h-3 w-3" /> Email
            </label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 border rounded-lg text-sm focus:border-amber-500 outline-none"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          
          <div>
            <label className="flex items-center gap-1 text-xs font-medium mb-1">
              <Phone className="h-3 w-3" /> Phone
            </label>
            <input
              type="tel"
              required
              className="w-full px-3 py-2 border rounded-lg text-sm focus:border-amber-500 outline-none"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-1 text-xs font-medium mb-1">
            Service Type
          </label>
          <select
            className="w-full px-3 py-2 border rounded-lg text-sm focus:border-amber-500 outline-none"
            value={formData.service}
            onChange={(e) => setFormData({...formData, service: e.target.value})}
          >
            {services.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="flex items-center gap-1 text-xs font-medium mb-1">
              <Calendar className="h-3 w-3" /> Date
            </label>
            <input
              type="date"
              required
              min={minDate}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:border-amber-500 outline-none"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
          </div>
          
          <div>
            <label className="flex items-center gap-1 text-xs font-medium mb-1">
              <Clock className="h-3 w-3" /> Time
            </label>
            <select
              required
              className="w-full px-3 py-2 border rounded-lg text-sm focus:border-amber-500 outline-none"
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
            >
              <option value="">Select time</option>
              {timeSlots.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium mb-1 block">
            Additional Notes (Optional)
          </label>
          <textarea
            className="w-full px-3 py-2 border rounded-lg text-sm focus:border-amber-500 outline-none resize-none"
            rows={2}
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            placeholder="Tell us about your project..."
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg font-semibold text-sm transition disabled:opacity-50"
          >
            {isSubmitting ? "Booking..." : "Book Appointment"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}