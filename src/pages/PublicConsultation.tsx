import { useState } from 'react';
import VirtualConsultationBooking from '@/components/VirtualConsultationBooking';
import ConsultationQuestionnaire from '@/components/ConsultationQuestionnaire';
import { CheckCircle } from 'lucide-react';

export default function PublicConsultation() {
  const [step, setStep] = useState<'booking' | 'questionnaire' | 'complete'>('booking');
  const [consultationId, setConsultationId] = useState<string>('');

  const handleBookingComplete = (id: string) => {
    setConsultationId(id);
    setStep('questionnaire');
  };

  const handleQuestionnaireComplete = () => {
    setStep('complete');
  };

  if (step === 'complete') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              Consultation Booked Successfully!
            </h1>
            <p className="text-gray-600 mb-6">
              Thank you for booking a consultation with us. We've sent a confirmation email with all the details.
            </p>
            <div className="space-y-4 text-left bg-gray-50 rounded-lg p-6">
              <h2 className="font-semibold text-lg">What's Next?</h2>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Check your email for confirmation and meeting details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>We'll call you 24 hours before to confirm</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Prepare any questions or project details you'd like to discuss</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 space-y-3">
              <a
                href="/"
                className="block w-full py-3 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 transition"
              >
                Return to Home
              </a>
              <p className="text-sm text-gray-500">
                Questions? Call us at{' '}
                <a href="tel:+13108532131" className="text-amber-500 hover:underline">
                  (310) 853-2131
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className={`flex items-center gap-2 ${step === 'booking' ? 'text-amber-500' : 'text-green-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                step === 'booking' ? 'bg-amber-500 text-white' : 'bg-green-500 text-white'
              }`}>
                {step === 'booking' ? '1' : '✓'}
              </div>
              <span className="font-medium">Schedule</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300" />
            <div className={`flex items-center gap-2 ${
              step === 'questionnaire' ? 'text-amber-500' : step === 'complete' ? 'text-green-500' : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                step === 'questionnaire' ? 'bg-amber-500 text-white' : 
                step === 'complete' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {step === 'complete' ? '✓' : '2'}
              </div>
              <span className="font-medium">Details</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300" />
            <div className={`flex items-center gap-2 ${step === 'complete' ? 'text-green-500' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                step === 'complete' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {step === 'complete' ? '✓' : '3'}
              </div>
              <span className="font-medium">Complete</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {step === 'booking' && (
          <VirtualConsultationBooking onComplete={handleBookingComplete} />
        )}
        {step === 'questionnaire' && (
          <ConsultationQuestionnaire 
            consultationId={consultationId} 
            onComplete={handleQuestionnaireComplete} 
          />
        )}
      </div>
    </div>
  );
}