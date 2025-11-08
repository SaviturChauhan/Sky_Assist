import React, { useState } from "react";
import ServiceRequestForm from "./ServiceRequestForm";
import MedicalAssistanceForm from "./MedicalAssistanceForm";
import AIConcierge from "./AIConcierge";
import OtherAssistanceForm from "./OtherAssistanceForm";
import PassengerHome from "./PassengerHome";
import FeedbackForm from "./FeedbackForm";
import Header from "./Header";

const PassengerDashboard = ({ user, onLogout, onNavigate }) => {
  const [activeView, setActiveView] = useState("home"); // 'home', 'request', 'assistance', 'concierge', 'other-assistance', 'feedback'

  const renderContent = () => {
    switch (activeView) {
      case "request":
        return (
          <ServiceRequestForm
            onBack={() => setActiveView("home")}
            user={user}
          />
        );
      case "assistance":
        return (
          <MedicalAssistanceForm
            onBack={() => setActiveView("home")}
            user={user}
          />
        );
      case "concierge":
        return <AIConcierge onBack={() => setActiveView("home")} user={user} />;
      case "other-assistance":
        return (
          <OtherAssistanceForm
            onBack={() => setActiveView("home")}
            user={user}
          />
        );
      case "feedback":
        return (
          <FeedbackForm
            onBack={() => setActiveView("home")}
            user={user}
            onSuccess={() => {
              // Feedback submitted successfully
              console.log("Feedback submitted successfully");
            }}
          />
        );
      case "home":
      default:
        return <PassengerHome user={user} onNavigate={setActiveView} />;
    }
  };

  return (
    <div>
      <Header user={user} onLogout={onLogout} />
      <div className="mt-6 animate-fadeIn">{renderContent()}</div>
    </div>
  );
};

export default PassengerDashboard;
