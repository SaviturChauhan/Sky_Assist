// --- Placeholder UI Components (to replace your imports) ---
import {
  MessageSquare,
  LifeBuoy,
  Sparkles,
  UtensilsCrossed,
  Heart,
  Bot,
  Bell,
  Star,
} from "./icons.jsx";
// This StyledCard can be used by both FlightInfoCard and your main content.
import React, { useState, useEffect } from "react";
import { useAnnouncements } from "../contexts/AnnouncementContext";
import PassengerRequests from "./PassengerRequests";

// --- Placeholder UI Components (to replace your imports) ---

// This StyledCard can be used by both FlightInfoCard and your main content.
const StyledCard = ({ className, children }) => (
  <div className={`bg-white rounded-2xl shadow-lg ${className}`}>
    {children}
  </div>
);

// Placeholder HomeCard component with updated styles
const HomeCard = ({
  icon: Icon,
  title,
  description,
  onClick,
  isUrgent,
  isConcierge,
}) => {
  let cardClasses =
    "p-6 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex flex-col border-2";
  let titleClasses = "font-bold text-xl mb-2";
  let descriptionClasses = "text-sm leading-relaxed";
  let iconContainerClasses =
    "w-16 h-16 rounded-xl flex items-center justify-center mb-4 shadow-sm";

  if (isConcierge) {
    cardClasses +=
      " bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white border-indigo-500 shadow-lg";
    titleClasses += " text-white";
    descriptionClasses += " text-indigo-100";
    iconContainerClasses += " bg-white/20 backdrop-blur-sm";
  } else if (isUrgent) {
    cardClasses +=
      " bg-gradient-to-br from-red-50 to-red-100 border-red-300 shadow-md";
    titleClasses += " text-red-900";
    descriptionClasses += " text-red-700";
    iconContainerClasses += " bg-red-500";
  } else {
    cardClasses +=
      " bg-gradient-to-br from-slate-50 to-white border-slate-200 shadow-md hover:border-slate-300";
    titleClasses += " text-slate-800";
    descriptionClasses += " text-gray-600";
    iconContainerClasses += " bg-gradient-to-br from-indigo-500 to-indigo-600";
  }

  return (
    <div className={cardClasses} onClick={onClick}>
      <div className={iconContainerClasses}>
        <Icon
          className={`w-8 h-8 ${
            isConcierge ? "text-white" : isUrgent ? "text-white" : "text-white"
          }`}
        />
      </div>
      <h3 className={titleClasses}>{title}</h3>
      <p className={descriptionClasses}>{description}</p>
    </div>
  );
};

// --- Flight Announcements Card Component ---

const FlightAnnouncementsCard = () => {
  const { announcements, updateRelativeTimes } = useAnnouncements();
  const [isAnnouncementsExpanded, setIsAnnouncementsExpanded] = useState(true);

  // Update relative times every minute
  useEffect(() => {
    const interval = setInterval(() => {
      updateRelativeTimes();
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [updateRelativeTimes]);

  const flightDetails = {
    flightNumber: "AI345",
    route: "New York → London",
    pilot: "Captain Sarah Johnson",
    crew: "First Officer Mike Chen, Flight Attendants: Emma, David, Lisa",
    progress: 65,
    timeRemaining: "5h 42m",
    altitude: "38,000 ft",
    speed: "550 mph",
    fromTo: "New York → London",
  };

  const getColorClasses = (color) => {
    switch (color) {
      case "red":
        return {
          bg: "bg-red-100",
          icon: "bg-red-500",
          text: "text-red-700",
          border: "border-red-200",
        };
      case "purple":
        return {
          bg: "bg-purple-100",
          icon: "bg-purple-500",
          text: "text-purple-700",
          border: "border-purple-200",
        };
      case "blue":
        return {
          bg: "bg-blue-100",
          icon: "bg-blue-500",
          text: "text-blue-700",
          border: "border-blue-200",
        };
      default:
        return {
          bg: "bg-gray-100",
          icon: "bg-gray-500",
          text: "text-gray-700",
          border: "border-gray-200",
        };
    }
  };

  return (
    <StyledCard className="mb-8 p-6">
      {/* Flight Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Flight {flightDetails.flightNumber}
            </h2>
            <p className="text-gray-600">{flightDetails.route}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="material-symbols-outlined text-lg">flight</span>
              <span>In-Flight</span>
            </div>
          </div>
        </div>

        {/* Flight Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Flight Progress</span>
            <span>{flightDetails.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${flightDetails.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Flight Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-gray-500 text-sm mb-1">From/To</p>
            <p className="font-bold text-gray-800 text-lg">
              {flightDetails.fromTo}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Time Remaining</p>
            <p className="font-bold text-gray-800 text-lg">
              {flightDetails.timeRemaining}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Altitude</p>
            <p className="font-bold text-gray-800 text-lg">
              {flightDetails.altitude}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Speed</p>
            <p className="font-bold text-gray-800 text-lg">
              {flightDetails.speed}
            </p>
          </div>
        </div>

        {/* Crew Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4 pt-4 border-t border-gray-200">
          <div>
            <p className="text-gray-500 mb-1">Pilot</p>
            <p className="font-semibold text-gray-800">{flightDetails.pilot}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Crew</p>
            <p className="font-semibold text-gray-800">{flightDetails.crew}</p>
          </div>
        </div>
      </div>

      {/* Announcements Feed */}
      <div className="space-y-4" data-announcements-section>
        <div
          className="flex items-center justify-between cursor-pointer group"
          onClick={() => setIsAnnouncementsExpanded(!isAnnouncementsExpanded)}
        >
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-200">
            Latest Announcements
          </h3>
          <span
            className={`material-symbols-outlined text-gray-500 transition-transform duration-200 ${
              isAnnouncementsExpanded ? "rotate-180" : ""
            }`}
          >
            expand_more
          </span>
        </div>

        {isAnnouncementsExpanded && (
          <div className="space-y-4 animate-fadeIn">
            {announcements.map((announcement) => {
              const colors = getColorClasses(announcement.color);
              return (
                <div
                  key={announcement.id}
                  className={`p-4 rounded-xl border-l-4 ${colors.border} ${colors.bg} shadow-sm`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-full ${colors.icon} flex items-center justify-center flex-shrink-0`}
                    >
                      <span className="material-symbols-outlined text-white text-lg">
                        {announcement.icon}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs font-bold uppercase ${colors.text}`}
                        >
                          {announcement.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {announcement.time}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {announcement.title}
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {announcement.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <span>EN</span>
                        <span>HI</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </StyledCard>
  );
};

// --- YOUR UPDATED PASSENGER HOME COMPONENT ---

const PassengerHome = ({ user, onNavigate }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
    {/* FlightAnnouncementsCard replaces FlightInfoCard */}
    <FlightAnnouncementsCard />

    <StyledCard className="p-8 shadow-xl border border-slate-200">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        How can we assist you, {user.name}?
      </h2>
      <p className="text-gray-600 mb-8">
        Choose from our available services below
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <HomeCard
          icon={UtensilsCrossed}
          title="Request Service"
          description="Snacks, drinks, comfort items"
          onClick={() => onNavigate("request")}
        />
        <HomeCard
          icon={Heart}
          title="Medical Assistance"
          description="Request help for medical concerns"
          onClick={() => onNavigate("assistance")}
          isUrgent
        />
        <HomeCard
          icon={Bot}
          title="AI Concierge"
          description="Get flight info, travel tips & more"
          onClick={() => onNavigate("concierge")}
          isConcierge
        />
        <HomeCard
          icon={MessageSquare}
          title="Other Assistance"
          description="Make custom requests to crew members"
          onClick={() => onNavigate("other-assistance")}
        />
      </div>
    </StyledCard>

    {/* Feedback Section */}
    <StyledCard className="p-6 shadow-xl border border-slate-200 mt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Share Your Flight Experience
          </h3>
          <p className="text-gray-600">
            Help us improve by providing feedback about your flight
          </p>
        </div>
        <button
          onClick={() => onNavigate("feedback")}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
        >
          <Star className="w-5 h-5" />
          <span className="font-semibold">Submit Feedback</span>
        </button>
      </div>
    </StyledCard>

    {/* Your Requests Section */}
    <PassengerRequests user={user} />
  </div>
);

export default PassengerHome;
