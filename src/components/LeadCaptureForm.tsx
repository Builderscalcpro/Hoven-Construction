import { useState, useEffect } from "react";
import { CheckCircle2, Loader2, Mail, Phone, User, Briefcase, DollarSign, Clock } from "lucide-react";
import { announce } from './ScreenReaderAnnouncer';
interface LeadCaptureFormProps {
  conversationHistory: Array<{ role: string; content: string }>;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function LeadCaptureForm({ conversationHistory, onSuccess, onCancel }: LeadCaptureFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    budgetRange: "",
    timeline: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Announce form errors to screen readers
  useEffect(() => {
    const errorMessages = Object.values(errors);
    if (errorMessages.length > 0) {
      const errorCount = errorMessages.length;
      const message = `Form has ${errorCount} error${errorCount > 1 ? 's' : ''}. ${errorMessages.join('. ')}`;
      announce(message, 'assertive');
    }
  }, [errors]);

  const projectTypes = [
    "Kitchen Remodeling",
    "Bathroom Renovation",
    "Home Addition",
    "Whole House Remodel",
    "Basement Finishing",
    "Outdoor Living Space",
    "Other"
  ];

  const budgetRanges = [
    "Under $10,000",
    "$10,000 - $25,000",
    "$25,000 - $50,000",
    "$50,000 - $100,000",
    "$100,000+"
  ];

  const timelines = [
    "ASAP (Within 1 month)",
    "1-2 months",
    "3-6 months",
    "6-12 months",
    "Just exploring options"
  ];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone format";
    }
    if (!formData.projectType) newErrors.projectType = "Please select a project type";
    if (!formData.budgetRange) newErrors.budgetRange = "Please select a budget range";
    if (!formData.timeline) newErrors.timeline = "Please select a timeline";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    setIsSubmitting(true);
    announce('Submitting your quote request. Please wait.', 'polite');

    try {
      const { supabase } = await import("@/lib/supabase");
      const { data, error } = await supabase.functions.invoke("capture-lead", {
        body: {
          ...formData,
          conversationHistory
        }
      });

      if (error) throw error;

      setIsSuccess(true);
      announce('Success! Your quote request has been submitted. We will send you a detailed quote within 24 hours.', 'assertive');
      setTimeout(() => {
        onSuccess();
      }, 3000);
    } catch (err) {
      console.error("Error submitting lead:", err);
      setErrors({ submit: "Failed to submit. Please try again." });
      announce('Error submitting form. Please check the form and try again.', 'assertive');
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isSuccess) {
    return (
      <div className="p-6 text-center animate-slideUp">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 animate-bounce">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
        <p className="text-gray-600 mb-4">
          We've received your information and will send you a detailed quote within 24 hours.
        </p>
        <p className="text-sm text-gray-500">
          Check your email for confirmation!
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 max-h-[500px] overflow-y-auto animate-slideUp">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Mail className="h-5 w-5 text-amber-500" />
          Get Your Free Detailed Quote
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Fill out the form below and we'll email you a customized estimate
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <User className="h-4 w-4" /> Full Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="John Doe"
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <Mail className="h-4 w-4" /> Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="john@example.com"
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <Phone className="h-4 w-4" /> Phone *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="(310) 555-1234"
          />
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <Briefcase className="h-4 w-4" /> Project Type *
          </label>
          <select
            value={formData.projectType}
            onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.projectType ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select project type</option>
            {projectTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.projectType && <p className="text-xs text-red-500 mt-1">{errors.projectType}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <DollarSign className="h-4 w-4" /> Budget Range *
          </label>
          <select
            value={formData.budgetRange}
            onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.budgetRange ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select budget range</option>
            {budgetRanges.map((range) => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
          {errors.budgetRange && <p className="text-xs text-red-500 mt-1">{errors.budgetRange}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <Clock className="h-4 w-4" /> Timeline *
          </label>
          <select
            value={formData.timeline}
            onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.timeline ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select timeline</option>
            {timelines.map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
          {errors.timeline && <p className="text-xs text-red-500 mt-1">{errors.timeline}</p>}
        </div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg text-sm font-bold hover:from-amber-600 hover:to-amber-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Get Free Quote"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
