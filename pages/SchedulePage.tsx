import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../components/layout/Header';

interface TimeSlot {
  time: string;
  available: boolean;
}

const SchedulePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('consultation');

  // Generate time slots
  const timeSlots: TimeSlot[] = [
    { time: '9:00 AM', available: true },
    { time: '9:30 AM', available: false },
    { time: '10:00 AM', available: true },
    { time: '10:30 AM', available: true },
    { time: '11:00 AM', available: false },
    { time: '11:30 AM', available: true },
    { time: '1:00 PM', available: true },
    { time: '1:30 PM', available: true },
    { time: '2:00 PM', available: true },
    { time: '2:30 PM', available: false },
    { time: '3:00 PM', available: true },
    { time: '3:30 PM', available: true },
    { time: '4:00 PM', available: true },
    { time: '4:30 PM', available: true },
  ];

  const appointmentTypes = [
    { id: 'consultation', label: 'Consultation', duration: '30 min' },
    { id: 'follow-up', label: 'Follow-up', duration: '15 min' },
    { id: 'check-in', label: 'Health Check-in', duration: '20 min' },
  ];

  const handleSchedule = () => {
    if (selectedTime) {
      // Handle scheduling logic here
      navigate('/health');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    setSelectedDate(newDate);
  };

  return (
    <div className="flex flex-col flex-grow bg-gray-50">
      <Header
        title="Schedule Appointment"
        subtitle="Book your next visit"
        showBackButton={true}
        onBackClick={() => navigate('/health')}
      />

      <main className="px-6 pt-5 pb-36 flex-grow" role="main">
        {/* Appointment Type Selection */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Appointment Type</h2>
          <div className="space-y-2">
            {appointmentTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  selectedType === type.id
                    ? 'border-[var(--primary)] bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">{type.label}</h3>
                    <p className="text-sm text-gray-600">{type.duration}</p>
                  </div>
                  {selectedType === type.id && (
                    <div className="w-6 h-6 bg-[var(--primary)] rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Date Selection */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Select Date</h2>
          <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => changeDate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Previous day"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-[var(--primary)]" />
                <span className="font-semibold text-gray-900">{formatDate(selectedDate)}</span>
              </div>
              <button
                onClick={() => changeDate(1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Next day"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </section>

        {/* Time Slot Selection */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Available Times</h2>
          <div className="grid grid-cols-3 gap-3">
            {timeSlots.map((slot) => (
              <button
                key={slot.time}
                onClick={() => slot.available && setSelectedTime(slot.time)}
                disabled={!slot.available}
                className={`p-3 rounded-lg text-sm font-medium transition-all ${
                  !slot.available
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : selectedTime === slot.time
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-[var(--primary)]'
                }`}
              >
                <div className="flex items-center justify-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{slot.time}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Confirm Button */}
        <div className="fixed bottom-24 left-0 right-0 px-6 pb-4 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent pt-6">
          <button
            onClick={handleSchedule}
            disabled={!selectedTime}
            className={`w-full py-4 rounded-xl font-semibold transition-all ${
              selectedTime
                ? 'bg-[var(--primary)] text-white hover:bg-[var(--secondary)]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {selectedTime
              ? `Schedule for ${formatDate(selectedDate)} at ${selectedTime}`
              : 'Select a time to continue'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default SchedulePage;
