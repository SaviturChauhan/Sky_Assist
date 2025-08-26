import React, { useState } from "react";
import { ArrowLeft, Heart, Shield, AlertTriangle, Send } from "lucide-react";
import { useAuth } from '../contexts/AuthContext';
import { useRequests } from '../contexts/RequestContext';

const Assistance: React.FC = () => {
  const { user } = useAuth();
  const { createRequest } = useRequests();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const assistanceTypes = [
    {
      id: "medical",
      label: "Medical Assistance",
      icon: Heart,
      description: "Feeling unwell or need medical help",
      color: "red",
      urgent: true,
    },
    {
      id: "security",
      label: "Security/Safety Issue",
      icon: Shield,
      description: "Report suspicious activity or safety concern",
      color: "orange",
      urgent: true,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType || !details.trim() || !user) return;

    setLoading(true);
    try {
      createRequest({
        type: selectedType as any,
        priority: 'urgent',
        passengerId: user.id,
        passengerSeat: user.seat || '',
        description: details,
      });

      setSuccess(true);
      setTimeout(() => {
        window.history.back();
        setSuccess(false);
        setSelectedType(null);
        setDetails("");
      }, 3000);
    } catch (error) {
      console.error("Error creating request:", error);
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
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            URGENT Request Sent
          </h2>
          <p className="text-gray-600 mb-4">
            Cabin crew has been immediately notified and will assist you
            shortly.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800 text-sm font-medium">Priority: URGENT</p>
            <p className="text-red-700 text-sm">
              Please remain calm. Help is on the way.
            </p>
          </div>
          <div className="animate-pulse text-sm text-gray-500">
            Returning to dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center space-x-4">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Need Assistance</h1>
            <p className="text-sm text-gray-500">
              Seat {user.seat}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
          {/* Warning Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              </div>
              <div>
                <h3 className="font-medium text-amber-800">
                  Urgent Assistance
                </h3>
                <p className="text-sm text-amber-700 mt-1">
                  These requests are marked as URGENT and will immediately alert
                  the cabin crew.
                </p>
              </div>
            </div>
          </div>

          {/* Assistance Type Selection */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Type of assistance needed
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {assistanceTypes.map((assistance) => {
                const Icon = assistance.icon;
                const isSelected = selectedType === assistance.id;

                return (
                  <button
                    key={assistance.id}
                    type="button"
                    onClick={() => setSelectedType(assistance.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all w-full transform hover:scale-105 ${
                      isSelected
                        ? `border-${assistance.color}-500 bg-${assistance.color}-50 shadow-md`
                        : "border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                          isSelected ? `bg-${assistance.color}-100` : "bg-gray-100"
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 transition-colors ${
                            isSelected ? `text-${assistance.color}-600` : "text-gray-600"
                          }`}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {assistance.label}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {assistance.description}
                        </p>
                        <span className="inline-block mt-1 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                          URGENT
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details */}
          {selectedType && (
            <div className="mb-6 animate-fadeIn">
              <label
                htmlFor="details"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Please describe the situation *
              </label>
              <textarea
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={4}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none transition-colors"
                placeholder={
                  selectedType === "medical"
                    ? "Describe your symptoms or medical concern..."
                    : "Describe the security or safety issue..."
                }
              />
              <p className="text-sm text-gray-500 mt-1">
                Please provide as much detail as possible to help our crew
                assist you effectively.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!selectedType || !details.trim() || loading}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-105"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                <span>Sending Urgent Request...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                <span>Send Urgent Request</span>
              </>
            )}
          </button>

          <p className="text-sm text-gray-500 text-center mt-4">
            This will immediately notify all cabin crew members.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Assistance;