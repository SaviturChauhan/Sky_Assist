import React, { useState } from "react";
import LoginPage from "./components/LoginPage";
import PassengerDashboard from "./components/PassengerDashboard";
import CrewDashboard from "./components/CrewDashboard";
import FlightAnnouncements from "./components/FlightAnnouncements";
import SkyTalkDashboard from "./components/SkyTalkDashboard";
import CreateAnnouncement from "./components/CreateAnnouncement";
import { mockPassenger, mockCrew } from "./lib/utils";
import { RequestProvider } from "./contexts/RequestContext";
import { AnnouncementProvider } from "./contexts/AnnouncementContext";

// Main App Component
const App = () => {
  const [page, setPage] = useState("login"); // 'login', 'passenger', 'crew', 'flight-announcements', 'skytalk', 'create-announcement'
  const [user, setUser] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleLogin = (userType, userData) => {
    setUser(userData);
    if (userType === "passenger") {
      setPage("passenger");
    } else if (userType === "crew") {
      setPage("crew");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setPage("login");
  };

  const renderPage = () => {
    switch (page) {
      case "passenger":
        return (
          <PassengerDashboard
            user={user}
            onLogout={handleLogout}
            onNavigate={setPage}
          />
        );
      case "crew":
        return (
          <CrewDashboard
            user={user}
            onLogout={handleLogout}
            onNavigate={setPage}
          />
        );
      case "flight-announcements":
        return <FlightAnnouncements onBack={() => setPage("passenger")} />;
      case "skytalk":
        return (
          <SkyTalkDashboard
            onBack={() => setPage("crew")}
            onCreateAnnouncement={(templateName) => {
              setSelectedTemplate(templateName);
              setPage("create-announcement");
            }}
            user={user}
          />
        );
      case "create-announcement":
        return (
          <CreateAnnouncement
            onBack={() => setPage("skytalk")}
            templateName={selectedTemplate}
            user={user}
          />
        );
      case "login":
      default:
        return <LoginPage onLogin={handleLogin} />;
    }
  };

  return (
    <RequestProvider>
      <AnnouncementProvider>
        <div className="min-h-screen w-full bg-background text-text-primary font-sans">
          <main className="w-full">{renderPage()}</main>
        </div>
      </AnnouncementProvider>
    </RequestProvider>
  );
};

export default App;
