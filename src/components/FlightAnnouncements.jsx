import React from "react";

const FlightAnnouncements = ({ onBack }) => {
  const announcements = [
    {
      id: 1,
      type: "priority",
      category: "PRIORITY",
      icon: "priority_high",
      title: "Turbulence Expected",
      message:
        "Please fasten your seatbelts and remain seated. We anticipate turbulence for the next 30 minutes.",
      timeAgo: "25m ago",
      color: "red",
    },
    {
      id: 2,
      type: "service",
      category: "Meal Service",
      icon: "restaurant_menu",
      title: "Meal Service Starting",
      message:
        "Meal service will begin shortly. Please select your meal option from the menu in front of you.",
      timeAgo: "1h ago",
      color: "primary",
      hasIndicator: true,
    },
    {
      id: 3,
      type: "info",
      category: "Arrival Information",
      icon: "info",
      title: "Arrival Information",
      message:
        "We are expected to arrive in London at 7:00 AM local time. Please ensure all personal belongings are collected.",
      timeAgo: "3h ago",
      color: "primary",
    },
    {
      id: 4,
      type: "welcome",
      category: "Welcome",
      icon: "waving_hand",
      title: "Welcome Aboard",
      message:
        "Welcome aboard AirLink Flight 345. We hope you have a pleasant journey.",
      timeAgo: "5h ago",
      color: "primary",
    },
  ];

  const getCardStyles = (announcement) => {
    if (announcement.type === "priority") {
      return "bg-white dark:bg-gray-900/50 p-6 rounded-xl shadow-lg border border-red-300/50 dark:border-red-500/30";
    }
    return "bg-white dark:bg-gray-900/50 p-6 rounded-xl shadow-md transition-shadow hover:shadow-lg";
  };

  const getIconStyles = (announcement) => {
    if (announcement.type === "priority") {
      return "w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center";
    }
    return "w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center";
  };

  const getIconColor = (announcement) => {
    if (announcement.type === "priority") {
      return "text-red-500 dark:text-red-400";
    }
    return "text-indigo-600 dark:text-indigo-400";
  };

  const getCategoryColor = (announcement) => {
    if (announcement.type === "priority") {
      return "text-red-600 dark:text-red-400";
    }
    return "text-indigo-600 dark:text-indigo-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Flight AI345
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  New York → London
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400">
                  flight_takeoff
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  In-Flight
                </span>
              </div>
            </div>
            <div className="mt-3">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div
                  className="bg-indigo-600 dark:bg-indigo-400 h-1.5 rounded-full"
                  style={{ width: "60%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {announcements.map((announcement) => (
            <div key={announcement.id} className={getCardStyles(announcement)}>
              <div className="flex gap-x-6">
                <div className="flex-shrink-0">
                  <div className={getIconStyles(announcement)}>
                    <span
                      className={`material-symbols-outlined ${getIconColor(
                        announcement
                      )} !text-3xl`}
                    >
                      {announcement.icon}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p
                      className={`text-sm font-semibold ${getCategoryColor(
                        announcement
                      )}`}
                    >
                      {announcement.category}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>{announcement.timeAgo}</span>
                      <div className="flex space-x-1">
                        <button className="font-semibold text-indigo-600 dark:text-indigo-400">
                          EN
                        </button>
                        <span className="text-gray-300 dark:text-gray-600">
                          |
                        </span>
                        <button className="text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400">
                          HI
                        </button>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {announcement.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {announcement.message}
                  </p>
                </div>
                {announcement.hasIndicator && (
                  <div className="w-4 h-4 mt-1 flex-shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-600/40"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Back Button */}
      <div className="fixed bottom-6 left-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
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
    </div>
  );
};

export default FlightAnnouncements;

