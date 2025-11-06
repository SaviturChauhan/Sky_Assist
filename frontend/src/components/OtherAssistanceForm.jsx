import React, { useState } from "react";
import { useRequests } from "../contexts/RequestContext";
import { StyledCard, PrimaryButton } from "./ui";
import { ChevronLeft, Send, AlertTriangle } from "./icons.jsx";

const OtherAssistanceForm = ({ onBack, user }) => {
  const { addRequest } = useRequests();
  const [formData, setFormData] = useState({
    title: "",
    category: "Other",
    details: "",
    priority: "Medium",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.details.trim()) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setIsSubmitting(true);

    try {
      const newRequest = {
        title: formData.title,
        category: formData.category,
        details: formData.details,
        priority: formData.priority,
        passengerName: user.name,
        seat: user.seat || user.seatNumber,
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "New",
        items: [],
        chat: [
          {
            sender: user.name,
            message: formData.details,
            timestamp: new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ],
      };

      await addRequest(newRequest);
      setShowSuccess(true);
      setFormData({
        title: "",
        category: "Other",
        details: "",
        priority: "Medium",
      });

      setTimeout(() => {
        setShowSuccess(false);
        onBack();
      }, 2000);
    } catch (error) {
      console.error("Failed to save request:", error);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors duration-200"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">Back to Dashboard</span>
        </button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Other Assistance Request
          </h1>
          <p className="text-lg text-gray-600">
            Need something specific? Let our crew know how we can help you.
          </p>
        </div>
      </div>

      {/* Main Form */}
      <div className="max-w-2xl mx-auto">
        <StyledCard className="p-8 shadow-xl border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Request Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-gray-700 mb-3"
              >
                Request Title *
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Need extra pillow, Request magazine, etc."
                  className="w-full px-4 py-3 pr-10 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-gray-800 placeholder-gray-500 transition-all duration-200"
                  required
                />
                {formData.title && (
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, title: "" }))
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    title="Clear selection"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
              {formData.title && (
                <p className="mt-2 text-xs text-gray-500">
                  Click on any tag below to change your selection
                </p>
              )}
            </div>

            {/* Priority Level */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Priority Level
              </label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "Low", label: "Low", desc: "Not urgent" },
                  { value: "Medium", label: "Medium", desc: "Normal priority" },
                  { value: "High", label: "High", desc: "Important" },
                  {
                    value: "Urgent",
                    label: "Urgent",
                    desc: "Immediate attention",
                  },
                ].map((option) => (
                  <label key={option.value} className="flex items-center group">
                    <div className="relative">
                      <input
                        type="radio"
                        name="priority"
                        value={option.value}
                        checked={formData.priority === option.value}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-white peer-checked:border-purple-600 peer-checked:bg-purple-600 peer-focus:ring-4 peer-focus:ring-purple-200 peer-focus:ring-offset-2 transition-all duration-300 flex items-center justify-center shadow-sm group-hover:border-purple-400">
                        {formData.priority === option.value && (
                          <div className="w-3 h-3 rounded-full bg-white shadow-sm"></div>
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-semibold text-gray-800 cursor-pointer transition-colors duration-200 group-hover:text-purple-600">
                        {option.label}
                      </div>
                      <div className="text-xs text-gray-500">{option.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Request Details */}
            <div>
              <label
                htmlFor="details"
                className="block text-sm font-semibold text-gray-700 mb-3"
              >
                Detailed Description *
              </label>
              <textarea
                id="details"
                name="details"
                value={formData.details}
                onChange={handleInputChange}
                rows={6}
                placeholder="Please provide detailed information about your request. The more specific you are, the better we can assist you."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-gray-800 placeholder-gray-500 transition-all duration-200 resize-none"
                required
              />
            </div>

            {/* Helpful Tags */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                Common requests include:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Extra blanket",
                  "Magazine/Newspaper",
                  "WiFi help",
                  "Seat adjustment",
                  "Temperature change",
                  "Entertainment system",
                  "Translation assistance",
                  "Special dietary needs",
                  "Childcare assistance",
                  "Baggage inquiry",
                ].map((tag) => (
                  <span
                    key={tag}
                    className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors duration-200 ${
                      formData.title === tag
                        ? "bg-purple-100 text-purple-700 border-2 border-purple-300"
                        : "bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700"
                    }`}
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, title: tag }));
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <PrimaryButton
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 py-4 text-lg font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting Request...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Request
                  </>
                )}
              </PrimaryButton>
            </div>
          </form>
        </StyledCard>

        {/* Success Modal */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Request Submitted!
              </h3>
              <p className="text-gray-600">
                Your request has been sent to the crew. We'll get back to you
                soon.
              </p>
            </div>
          </div>
        )}

        {/* Error Modal */}
        {showError && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Please Fill Required Fields
              </h3>
              <p className="text-gray-600">
                Title and description are required to submit your request.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OtherAssistanceForm;
