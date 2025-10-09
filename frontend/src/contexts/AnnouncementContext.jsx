import React, { createContext, useContext, useState } from "react";

const AnnouncementContext = createContext();

export const useAnnouncements = () => {
  const context = useContext(AnnouncementContext);
  if (!context) {
    throw new Error(
      "useAnnouncements must be used within an AnnouncementProvider"
    );
  }
  return context;
};

export const AnnouncementProvider = ({ children }) => {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      type: "priority",
      icon: "priority_high",
      category: "PRIORITY",
      title: "Turbulence Expected",
      message:
        "Please fasten your seatbelts and remain seated. We anticipate turbulence for the next 30 minutes.",
      time: "25m ago",
      color: "red",
      timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
    },
    {
      id: 2,
      type: "service",
      icon: "restaurant",
      category: "Meal Service",
      title: "Meal Service Starting",
      message:
        "Meal service will begin shortly. Please select your meal option from the menu in front of you.",
      time: "1h ago",
      color: "purple",
      timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    },
    {
      id: 3,
      type: "info",
      icon: "info",
      category: "Arrival Information",
      title: "Arrival Information",
      message:
        "We are expected to arrive in London at 7:00 AM local time. Please ensure all personal belongings are collected.",
      time: "3h ago",
      color: "blue",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    },
    {
      id: 4,
      type: "welcome",
      icon: "waving_hand",
      category: "Welcome",
      title: "Welcome Aboard",
      message:
        "Welcome aboard AirLink Flight 345. We hope you have a pleasant journey.",
      time: "5h ago",
      color: "purple",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    },
  ]);

  const addAnnouncement = (announcementData) => {
    const newAnnouncement = {
      id: Date.now(), // Simple ID generation
      timestamp: new Date(),
      time: "Just now",
      ...announcementData,
    };

    setAnnouncements((prev) => [newAnnouncement, ...prev]);
  };

  const updateAnnouncementTime = (id, timeString) => {
    setAnnouncements((prev) =>
      prev.map((announcement) =>
        announcement.id === id
          ? { ...announcement, time: timeString }
          : announcement
      )
    );
  };

  // Update relative times periodically
  const updateRelativeTimes = () => {
    setAnnouncements((prev) =>
      prev.map((announcement) => {
        const now = new Date();
        const diff = now - announcement.timestamp;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));

        let timeString;
        if (minutes < 1) {
          timeString = "Just now";
        } else if (minutes < 60) {
          timeString = `${minutes}m ago`;
        } else if (hours < 24) {
          timeString = `${hours}h ago`;
        } else {
          timeString = announcement.timestamp.toLocaleDateString();
        }

        return { ...announcement, time: timeString };
      })
    );
  };

  return (
    <AnnouncementContext.Provider
      value={{
        announcements,
        addAnnouncement,
        updateAnnouncementTime,
        updateRelativeTimes,
      }}
    >
      {children}
    </AnnouncementContext.Provider>
  );
};

