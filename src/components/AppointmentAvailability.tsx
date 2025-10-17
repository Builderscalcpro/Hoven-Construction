import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Button } from './ui/button';

const AppointmentAvailability = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const availableDates = [
    'Mon, Jan 15',
    'Tue, Jan 16',
    'Wed, Jan 17',
    'Thu, Jan 18',
    'Fri, Jan 19'
  ];

  const availableTimes = [
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM'
  ];

  const handleBooking = () => {
    if (selectedDate && selectedTime) {
      alert(`Appointment booked for ${selectedDate} at ${selectedTime}`);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Schedule Your Free Consultation</h2>
          <p className="text-gray-600">Choose a date and time that works for you</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-xl mb-4">Select Date</h3>
            <div className="space-y-2">
              {availableDates.map((date) => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    selectedDate === date
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {date}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-4">Select Time</h3>
            <div className="grid grid-cols-2 gap-2">
              {availableTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedTime === time
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>

        {selectedDate && selectedTime && (
          <div className="mt-8 text-center">
            <Button onClick={handleBooking} size="lg">
              Confirm Appointment
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default AppointmentAvailability;
