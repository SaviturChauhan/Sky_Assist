import React, { createContext, useContext, useState, useEffect } from "react";
import { announcementAPI } from "../services/api";

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

// Helper function to map backend type to frontend type
const mapBackendTypeToFrontend = (backendType) => {
  const typeMap = {
    "General": "info",
    "Safety": "priority",
    "Service": "service",
    "Weather": "info",
    "Delay": "info",
    "Emergency": "priority",
  };
  return typeMap[backendType] || "info";
};

// Helper function to map backend type to frontend category
const mapBackendTypeToCategory = (backendType, priority) => {
  if (priority === "Urgent" || backendType === "Safety" || backendType === "Emergency") {
    return "PRIORITY";
  }
  if (backendType === "Service") {
    return "Meal Service";
  }
  return "General Information";
};

// Helper function to calculate relative time
const getRelativeTime = (timestamp) => {
  const now = new Date();
  const diff = now - new Date(timestamp);
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) {
    return "Just now";
  } else if (minutes < 60) {
    return `${minutes}m ago`;
  } else if (hours < 24) {
    return `${hours}h ago`;
  } else if (days < 7) {
    return `${days}d ago`;
  } else {
    return new Date(timestamp).toLocaleDateString();
  }
};

export const AnnouncementProvider = ({ children }) => {
  // Try to load from localStorage first for instant display
  const [announcements, setAnnouncements] = useState(() => {
    try {
      const saved = localStorage.getItem('skyassist_announcements');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only use cached data if it's less than 5 minutes old
        if (parsed.timestamp && (Date.now() - parsed.timestamp < 5 * 60 * 1000)) {
          return parsed.data || [];
        }
      }
    } catch (e) {
      console.error("Error loading cached announcements:", e);
    }
    return [];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Save announcements to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('skyassist_announcements', JSON.stringify({
        data: announcements,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.error("Error saving announcements to cache:", e);
    }
  }, [announcements]);

  // Fetch announcements from backend on mount
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await announcementAPI.getAll();
        
        if (response.success && response.data) {
          // Map backend announcements to frontend format
          const mappedAnnouncements = response.data.map((announcement) => ({
            id: announcement._id,
            timestamp: new Date(announcement.createdAt),
            time: getRelativeTime(announcement.createdAt),
            title: announcement.title,
            message: announcement.message,
            type: mapBackendTypeToFrontend(announcement.type),
            icon: announcement.icon || "campaign",
            category: mapBackendTypeToCategory(announcement.type, announcement.priority),
            color: announcement.color || "blue",
            priority: announcement.priority,
            isUrgent: announcement.priority === "Urgent",
          }));
          
          setAnnouncements(mappedAnnouncements);
          setError(null); // Clear error on success
        }
      } catch (err) {
        console.error("Error fetching announcements:", err);
        // Only set error if we don't have cached data
        if (announcements.length === 0) {
          setError(err.message);
        }
        // Don't clear existing announcements on error - keep cached data
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const addAnnouncement = async (announcementData) => {
    try {
      // Map frontend announcement data to backend format
      // Map frontend type to backend type enum
      const typeMap = {
        "info": "General",
        "priority": "Safety",
        "service": "Service",
        "welcome": "General",
      };
      
      // Map frontend category to backend type
      const categoryToType = {
        "General Information": "General",
        "In-flight Service": "Service",
        "Safety": "Safety",
        "Turbulence": "Safety",
        "Boarding": "General",
        "Landing": "General",
        "PRIORITY": "Safety",
        "Meal Service": "Service",
      };

      const backendType = typeMap[announcementData.type] || 
                          categoryToType[announcementData.category] || 
                          "General";

      const backendData = {
        title: announcementData.title || "General Announcement",
        message: announcementData.message || "",
        type: backendType,
        priority: announcementData.isUrgent ? "Urgent" : 
                  announcementData.priority === "high" ? "High" :
                  announcementData.priority === "medium" ? "Medium" : "Low",
        color: announcementData.color || "blue",
        icon: announcementData.icon || "campaign",
        targetAudience: "All",
      };

      // Save to backend
      const response = await announcementAPI.create(backendData);
      
      if (response.success && response.data) {
        // Map backend response to frontend format
        const savedAnnouncement = {
          id: response.data._id || Date.now(),
          timestamp: new Date(response.data.createdAt || Date.now()),
          time: "Just now",
          title: response.data.title,
          message: response.data.message,
          type: response.data.type,
          icon: response.data.icon,
          category: response.data.category || response.data.type,
          color: response.data.color,
        };

        // Update local state - add to beginning
        setAnnouncements((prev) => [savedAnnouncement, ...prev]);
        return savedAnnouncement;
      }
    } catch (error) {
      console.error("Error saving announcement to backend:", error);
      // Fallback: add to local state only if backend save fails
    const newAnnouncement = {
        id: Date.now(),
      timestamp: new Date(),
      time: "Just now",
      ...announcementData,
    };
    setAnnouncements((prev) => [newAnnouncement, ...prev]);
      throw error; // Re-throw so caller can handle it
    }
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

  // Refresh announcements from backend
  const refreshAnnouncements = async () => {
    try {
      // Don't set loading to true on refresh - keep current data visible
      const response = await announcementAPI.getAll();
      
      if (response.success && response.data) {
        const mappedAnnouncements = response.data.map((announcement) => ({
          id: announcement._id,
          timestamp: new Date(announcement.createdAt),
          time: getRelativeTime(announcement.createdAt),
          title: announcement.title,
          message: announcement.message,
          type: mapBackendTypeToFrontend(announcement.type),
          icon: announcement.icon || "campaign",
          category: mapBackendTypeToCategory(announcement.type, announcement.priority),
          color: announcement.color || "blue",
          priority: announcement.priority,
          isUrgent: announcement.priority === "Urgent",
        }));
        
        setAnnouncements(mappedAnnouncements);
        setError(null); // Clear error on successful refresh
      }
    } catch (err) {
      console.error("Error refreshing announcements:", err);
      // Only set error if we don't have cached data
      if (announcements.length === 0) {
        setError(err.message);
      }
      // Don't clear existing announcements on error - keep cached data
    }
  };

  return (
    <AnnouncementContext.Provider
      value={{
        announcements,
        loading,
        error,
        addAnnouncement,
        refreshAnnouncements,
        updateAnnouncementTime,
        updateRelativeTimes,
      }}
    >
      {children}
    </AnnouncementContext.Provider>
  );
};

