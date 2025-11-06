import React, { useState } from "react";
import { ChevronLeft, LogOut, ChevronDown } from "./icons.jsx";
import { useRequests } from "../contexts/RequestContext";

const MedicalAssistanceForm = ({ onBack, user }) => {
  const [selectedSymptom, setSelectedSymptom] = useState("");
  const [painLevel, setPainLevel] = useState(5);
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const { addRequest } = useRequests();

  const symptoms = [
    "Select symptom...",
    "Dizziness",
    "Difficulty Breathing",
    "Chest Pain",
    "Nausea",
    "Headache",
    "Fever",
    "Fatigue",
    "Other",
  ];

  const handleSubmit = async () => {
    if (selectedSymptom && selectedSymptom !== "Select symptom...") {
      try {
      // Create medical assistance request
      const medicalReport = {
        symptom: selectedSymptom,
        painLevel: painLevel,
        additionalDetails: additionalDetails.trim(),
      };

      const newRequest = {
        title: "Medical Assistance",
        category: "medical",
        passengerName: user.name,
          seat: user.seat || user.seatNumber,
        priority: "Urgent",
        details: `Symptom: ${selectedSymptom}, Pain Level: ${painLevel}/10${
          additionalDetails ? `, Details: ${additionalDetails}` : ""
        }`,
        items: ["Medical Kit", "First Aid"],
        medicalReport: medicalReport,
      };

        await addRequest(newRequest);

      // Show success modal instead of alert
      setShowSuccessModal(true);
      } catch (error) {
        console.error("Failed to save medical request:", error);
        alert("Failed to save request. Please try again.");
      }
    } else {
      // Show error modal instead of alert
      setShowErrorModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          <button className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
            Sign Out
            <LogOut className="w-5 h-5 ml-2" />
          </button>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Medical Assistance
        </h1>
      </div>

      {/* Main Medical Report Card */}
      <div className="px-6 pb-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Medical Report
              </h2>
              <p className="text-gray-600">
                Please provide details about the medical concern.
              </p>
            </div>

            <div className="space-y-6">
              {/* Symptom Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Symptom
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="w-full p-3 text-left bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 flex justify-between items-center"
                  >
                    <span
                      className={
                        selectedSymptom ? "text-gray-900" : "text-gray-500"
                      }
                    >
                      {selectedSymptom || "Select symptom..."}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        showDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                      {symptoms.map((symptom, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedSymptom(symptom);
                            setShowDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left text-gray-900 hover:bg-purple-50 hover:text-purple-700 transition-colors flex items-center justify-between"
                        >
                          <span>{symptom}</span>
                          {selectedSymptom === symptom && (
                            <span className="text-purple-600">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Pain Level Slider */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pain Level: {painLevel}
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={painLevel}
                    onChange={(e) => setPainLevel(parseInt(e.target.value))}
                    className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${
                        (painLevel - 1) * 11.11
                      }%, #e5e7eb ${(painLevel - 1) * 11.11}%, #e5e7eb 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1</span>
                    <span>5</span>
                    <span>10</span>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Details (Optional)
                </label>

                {/* Helpful Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                    Duration
                  </span>
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                    Triggers
                  </span>
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                    Medications
                  </span>
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                    Allergies
                  </span>
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                    Medical History
                  </span>
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                    Severity
                  </span>
                </div>

                <textarea
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                  className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                  placeholder="Provide more information about your medical concern..."
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  onClick={handleSubmit}
                  className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl animate-slideUp">
            <div className="text-center">
              {/* Success Icon */}
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

              {/* Success Message */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Medical Report Submitted!
              </h3>
              <p className="text-gray-600 mb-4">
                Your medical report has been submitted. A crew member will be
                with you shortly.
              </p>

              {/* OK Button */}
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  onBack();
                }}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl animate-slideUp">
            <div className="text-center">
              {/* Error Icon */}
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
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
              </div>

              {/* Error Message */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Please Select a Symptom
              </h3>
              <p className="text-gray-600 mb-4">
                You need to select a symptom before submitting your medical
                report.
              </p>

              {/* OK Button */}
              <button
                onClick={() => setShowErrorModal(false)}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalAssistanceForm;
