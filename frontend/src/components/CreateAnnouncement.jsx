import React, { useState, useEffect, useRef } from "react";
import { useAnnouncements } from "../contexts/AnnouncementContext";
import { ChevronDown } from "./icons.jsx";

const CreateAnnouncement = ({ onBack, templateName = null, user }) => {
  const { addAnnouncement } = useAnnouncements();
  const [formData, setFormData] = useState({
    message: templateName ? getTemplateMessage(templateName) : "",
    category: "General Information",
    isUrgent: false,
    audience: "All Cabins",
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function getTemplateMessage(templateName) {
    const templates = {
      "Boarding Complete":
        "Boarding is now complete. Please ensure your seatbelts are fastened and all electronic devices are in airplane mode.",
      "Meal Service":
        "Meal service will begin shortly. Please select your meal option from the menu in front of you.",
      "Turbulence (Urgent)":
        "We are experiencing some turbulence. Please fasten your seatbelts and remain seated until further notice.",
      "Final Descent":
        "We will be landing shortly. Please ensure your seatbelts are fastened and tray tables are in their upright position.",
      "Welcome & Gate Info":
        "We have landed safely. Please collect your belongings from the overhead compartments. Baggage claim information will be available on the screens.",
    };
    return templates[templateName] || "";
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Map category to announcement type and styling
    const getAnnouncementConfig = (category, isUrgent) => {
      if (isUrgent) {
        return {
          type: "priority",
          icon: "priority_high",
          category: "PRIORITY",
          color: "red",
        };
      }

      switch (category) {
        case "In-flight Service":
          return {
            type: "service",
            icon: "restaurant",
            category: "Meal Service",
            color: "purple",
          };
        case "Safety":
        case "Turbulence":
          return {
            type: "priority",
            icon: "warning",
            category: "SAFETY",
            color: "red",
          };
        case "Boarding":
          return {
            type: "info",
            icon: "flight_takeoff",
            category: "Boarding",
            color: "blue",
          };
        case "Landing":
          return {
            type: "info",
            icon: "flight_land",
            category: "Arrival Information",
            color: "blue",
          };
        default:
          return {
            type: "info",
            icon: "info",
            category: "General Information",
            color: "blue",
          };
      }
    };

    const config = getAnnouncementConfig(formData.category, formData.isUrgent);

    const newAnnouncement = {
      title:
        formData.category === "In-flight Service"
          ? "Meal Service Starting"
          : formData.category === "Boarding"
          ? "Boarding Information"
          : formData.category === "Landing"
          ? "Arrival Information"
          : formData.category === "Safety"
          ? "Safety Notice"
          : formData.category === "Turbulence"
          ? "Turbulence Notice"
          : "General Announcement",
      message: formData.message,
      ...config,
    };

    try {
      // Add announcement to context (now saves to backend)
      await addAnnouncement(newAnnouncement);
    console.log("Announcement created:", formData);
    setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to create announcement:", error);
      alert("Failed to save announcement. Please try again.");
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    onBack(); // Go back to dashboard after closing modal
  };

  return (
    <div className="font-sans bg-gray-50 text-gray-800 min-h-screen">
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between px-6 sm:px-10 py-4 bg-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 text-white bg-gradient-to-br from-purple-600 to-blue-500 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">
                flight_takeoff
              </span>
            </div>
            <h1 className="text-2xl font-display font-bold text-gray-900 hover-lift">
              <span className="text-indigo-600">Sky</span>
              <span className="text-purple-600 letter-float">Assist</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm font-semibold text-gray-600">
              <span className="material-symbols-outlined text-base text-gray-500">
                airplane_ticket
              </span>
              <span>Flight UA-345</span>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-white shadow-md"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCqVpsB-XFy1t5g1XN5pmhFWaXVZdoShQjeEVcr_XcWUie3wXB4mlOyRT3y0Vtea9DMBOrvGsuJwD4W2vJsVhhrGzXqpSB-XtUJ5PKrD-vgaAVYXfMGqhYyJezlVIXaJ4gH_8KSTh5fkoDMXfu0nteDSizat-hAeQIxLamTaKFUrQY7WLKBPMSGK3aIR6I6EVagobxexyKJS4hBcbZUVWLIhu8TOS2VS5bHJ03J5eDv0a7W9dDh2zmMkxJC832w0YauwJ7-iLd8Vfu1")',
                }}
              ></div>
              <div className="hidden md:block text-sm">
                <div className="font-bold text-gray-800">
                  {user?.name || "James Wilson"}
                </div>
                <div className="text-gray-500">
                  Crew ID: {user?.id || "7890"}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Back Button */}
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 text-sm font-medium mb-2"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </button>
        </div>

        {/* Main Content */}
        <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Page Header */}
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
                Create Announcement
              </h2>
              <p className="text-gray-500 mt-1">
                Craft a new announcement to be broadcasted to passengers.
              </p>
            </div>

            {/* Message Input */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div>
                <label
                  className="block text-sm font-semibold text-gray-700 mb-3"
                  htmlFor="message"
                >
                  Announcement Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border-2 border-gray-200 bg-white shadow-md focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-gray-800 placeholder-gray-400 resize-none py-4 px-5 font-medium transition-all duration-200 hover:border-gray-300"
                  placeholder="Enter your announcement message..."
                  rows="6"
                />
              </div>
            </div>

            {/* Configuration */}
            <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
              <h3 className="text-2xl font-bold text-gray-800">
                Configuration
              </h3>

              {/* Category */}
              <div>
                <label
                  className="block text-sm font-semibold text-gray-700 mb-3"
                  htmlFor="category"
                >
                  Category
                </label>
                <div className="relative" ref={dropdownRef}>
                  {/* Custom Dropdown Button */}
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full rounded-xl border-2 border-gray-200 bg-white shadow-md focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-gray-800 py-4 px-5 pr-12 cursor-pointer font-medium transition-all duration-200 hover:border-gray-300 flex items-center justify-between"
                  >
                    <span>{formData.category}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Custom Dropdown Options */}
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                      {[
                        "General Information",
                        "In-flight Service",
                        "Safety",
                        "Turbulence",
                        "Boarding",
                        "Landing",
                      ].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              category: option,
                            }));
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full px-5 py-4 text-left font-medium transition-colors duration-200 hover:bg-purple-50 hover:text-purple-700 ${
                            formData.category === option
                              ? "bg-purple-50 text-purple-700 border-l-4 border-purple-500"
                              : "text-gray-800"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Urgent Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Urgent</p>
                  <p className="text-xs text-gray-500">
                    Urgent announcements will be pinned.
                  </p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    className="sr-only peer"
                    name="isUrgent"
                    type="checkbox"
                    checked={formData.isUrgent}
                    onChange={handleInputChange}
                  />
                  <div className="relative w-12 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                </label>
              </div>

              {/* Audience */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-4">
                  Audience
                </h4>
                <fieldset className="grid grid-cols-2 gap-4">
                  {[
                    "All Cabins",
                    "Business Class",
                    "Premium Economy",
                    "Economy",
                  ].map((option) => (
                    <div key={option} className="flex items-center group">
                      <div className="relative">
                        <input
                          id={option.toLowerCase().replace(" ", "-")}
                          name="audience"
                          type="radio"
                          value={option}
                          checked={formData.audience === option}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-white peer-checked:border-purple-600 peer-checked:bg-purple-600 peer-focus:ring-4 peer-focus:ring-purple-200 peer-focus:ring-offset-2 transition-all duration-300 flex items-center justify-center shadow-sm group-hover:border-purple-400">
                          {formData.audience === option && (
                            <div className="w-3 h-3 rounded-full bg-white shadow-sm"></div>
                          )}
                        </div>
                      </div>
                      <label
                        className="ml-4 text-sm font-semibold text-gray-800 cursor-pointer transition-colors duration-200 group-hover:text-purple-600"
                        htmlFor={option.toLowerCase().replace(" ", "-")}
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </fieldset>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold rounded-lg shadow-lg hover:opacity-90 transition-opacity"
              >
                <span className="material-symbols-outlined">campaign</span>
                Create Announcement
              </button>
            </div>
          </form>
        </main>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8">
            <div className="text-center">
              {/* Success Icon */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <span className="material-symbols-outlined text-green-600 text-3xl">
                  check_circle
                </span>
              </div>

              {/* Success Message */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Announcement Created!
              </h3>
              <p className="text-gray-600 mb-8">
                Your announcement has been successfully created and will be
                broadcasted to passengers.
              </p>

              {/* Action Button */}
              <button
                onClick={handleCloseSuccessModal}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold rounded-lg shadow-lg hover:opacity-90 transition-opacity"
              >
                <span className="material-symbols-outlined">check</span>
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAnnouncement;
