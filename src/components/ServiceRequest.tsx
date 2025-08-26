import React, { useState } from 'react';
import { ArrowLeft, Coffee, Utensils, Send, Bed, Headphones, Plane as Blanket } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useRequests } from '../contexts/RequestContext';

const ServiceRequest: React.FC = () => {
  const { user } = useAuth();
  const { createRequest } = useRequests();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const serviceTypes = [
    { 
      id: 'drinks', 
      label: 'Beverages', 
      icon: Coffee, 
      description: 'Water, coffee, tea, juice, soft drinks',
      color: 'blue'
    },
    { 
      id: 'snacks', 
      label: 'Snacks', 
      icon: Utensils, 
      description: 'Crackers, nuts, cookies, light meals',
      color: 'green'
    },
    { 
      id: 'comfort', 
      label: 'Comfort Items', 
      icon: Bed, 
      description: 'Blanket, pillow, headphones, eye mask',
      color: 'purple'
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType || !user) return;

    setLoading(true);
    try {
      createRequest({
        type: selectedType as any,
        priority: 'low',
        passengerId: user.id,
        passengerSeat: user.seat || '',
        description: details || `${serviceTypes.find(s => s.id === selectedType)?.label} request from seat ${user.seat}`,
      });
      
      setSuccess(true);
      setTimeout(() => {
        window.history.back();
        setSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error creating request:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.type !== 'passenger') {
    return null;
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full mx-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h2>
          <p className="text-gray-600 mb-4">Our cabin crew will be with you shortly.</p>
          <div className="animate-pulse text-sm text-gray-500">Returning to dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center space-x-4 max-w-lg mx-auto">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Service Request</h1>
            <p className="text-sm text-gray-500">Seat {user.seat}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
          {/* Service Type Selection */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">What would you like?</h2>
            <div className="grid grid-cols-1 gap-3">
              {serviceTypes.map((service) => {
                const Icon = service.icon;
                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setSelectedType(service.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all w-full transform hover:scale-105 ${
                      selectedType === service.id
                        ? `border-${service.color}-500 bg-${service.color}-50 shadow-md`
                        : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                        selectedType === service.id ? `bg-${service.color}-100` : 'bg-gray-100'
                      }`}>
                        <Icon className={`w-6 h-6 transition-colors ${
                          selectedType === service.id ? `text-${service.color}-600` : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{service.label}</h3>
                        <p className="text-sm text-gray-600">{service.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Additional Details */}
          {selectedType && (
            <div className="mb-6 animate-fadeIn">
              <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-2">
                Specific requests or preferences (optional)
              </label>
              <textarea
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
                placeholder="Any specific preferences or special requests..."
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!selectedType || loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-105"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                <span>Sending Request...</span>
              </>
            ) : (
              'Send Request'
            )}
          </button>

          <p className="text-sm text-gray-500 text-center mt-4">
            Your request will be sent to the cabin crew immediately
          </p>
        </form>
      </div>
    </div>
  );
};

export default ServiceRequest;