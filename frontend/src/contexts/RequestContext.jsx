import React, { createContext, useContext, useState, useEffect } from "react";
import { requestAPI } from "../services/api";

const RequestContext = createContext();

export const useRequests = () => {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error("useRequests must be used within a RequestProvider");
  }
  return context;
};

// Helper function to map backend category to frontend category
const mapBackendCategoryToFrontend = (backendCategory) => {
  const categoryMap = {
    "Snacks": "food",
    "Drinks": "drink",
    "Comfort": "comfort",
    "Medical": "medical",
    "General": "general",
    "Security": "general",
  };
  return categoryMap[backendCategory] || "general";
};

export const RequestProvider = ({ children }) => {
  // Try to load from localStorage first for instant display
  const [requests, setRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('skyassist_requests');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only use cached data if it's less than 5 minutes old
        if (parsed.timestamp && (Date.now() - parsed.timestamp < 5 * 60 * 1000)) {
          return parsed.data || [];
        }
      }
    } catch (e) {
      console.error("Error loading cached requests:", e);
    }
    return [];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextId, setNextId] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Save requests to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('skyassist_requests', JSON.stringify({
        data: requests,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.error("Error saving requests to cache:", e);
    }
  }, [requests]);

  // Fetch requests from backend on mount
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await requestAPI.getAll();
        
        if (response.success && response.data) {
          // Map backend requests to frontend format
          const mappedRequests = response.data.map((request) => ({
            id: request._id,
            title: request.title,
            category: mapBackendCategoryToFrontend(request.category),
            passengerName: request.passenger?.name || "Unknown Passenger",
            seat: request.seatNumber || "",
            priority: request.priority || "Medium",
            status: request.status || "New",
            timestamp: new Date(request.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            details: request.description || "",
            items: request.items || [],
            chat: request.chatMessages?.map(msg => ({
              sender: msg.sender === "passenger" ? request.passenger?.name : "Crew",
              message: msg.message,
              timestamp: new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            })) || [],
            createdAt: request.createdAt,
          }));
          
          // Sort by creation date, newest first
          mappedRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          
          setRequests(mappedRequests);
          
          // Set nextId based on highest ID (if using numeric IDs) or just use length
          if (mappedRequests.length > 0) {
            setNextId(mappedRequests.length + 1);
          }
        }
      } catch (err) {
        console.error("Error fetching requests:", err);
        setError(err.message);
        // Don't clear existing requests on error - keep cached data
        // Only show error if we have no cached data
        if (requests.length === 0) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const addRequest = async (newRequest) => {
    try {
      // Check if request already exists (prevent duplicates)
      // Only check if we have a createdAt timestamp to compare
      if (newRequest.createdAt) {
        const existingRequest = requests.find(r => 
          r.title === newRequest.title && 
          r.category === newRequest.category &&
          r.createdAt && 
          Math.abs(new Date(r.createdAt).getTime() - new Date(newRequest.createdAt).getTime()) < 60000 // Within last minute
        );
        
        if (existingRequest) {
          console.log("Request already exists, skipping duplicate");
          return existingRequest;
        }
      }

      // Map frontend request data to backend format
      // Map frontend category to backend category enum
      const categoryMap = {
        "food": "Snacks",
        "drink": "Drinks",
        "comfort": "Comfort",
        "entertainment": "General",
        "medical": "Medical",
        "general": "General",
        "other": "General",
      };

      const backendCategory = categoryMap[newRequest.category] || "General";

      const backendData = {
        title: newRequest.title || "Service Request",
        description: newRequest.details || newRequest.description || "",
        category: backendCategory,
        priority: newRequest.priority === "Urgent" ? "Urgent" : 
                  newRequest.priority === "High" ? "High" :
                  newRequest.priority === "Medium" ? "Medium" : "Low",
        seatNumber: newRequest.seat || newRequest.seatNumber || "",
        location: newRequest.location || newRequest.seat || "",
      };

      console.log("Creating request in backend:", backendData);

      // Save to backend
      const response = await requestAPI.create(backendData);
      
      console.log("Backend response:", response);
      
      if (response.success && response.data) {
        // Map backend response to frontend format
        const savedRequest = {
          id: response.data._id || nextId,
          title: response.data.title,
          category: response.data.category,
          passengerName: response.data.passenger?.name || newRequest.passengerName,
          seat: response.data.seatNumber || newRequest.seat,
          priority: response.data.priority,
          status: response.data.status || "New",
          timestamp: new Date(response.data.createdAt || Date.now()).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          details: response.data.description || newRequest.details,
          items: newRequest.items || [],
          chat: response.data.chatMessages?.map(msg => ({
            sender: msg.sender === "passenger" ? response.data.passenger?.name : "Crew",
            message: msg.message,
            timestamp: new Date(msg.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          })) || newRequest.chat || [],
          createdAt: response.data.createdAt || new Date().toISOString(),
        };

        // Update local state - add to beginning and remove duplicates
        setRequests((prev) => {
          // Remove any duplicate requests
          const filtered = prev.filter(r => r.id !== savedRequest.id);
          return [savedRequest, ...filtered];
        });
        setNextId((prev) => prev + 1);
        
        // Refresh requests to get latest from backend
        setTimeout(() => refreshRequests(), 1000);
        
        return savedRequest;
      }
    } catch (error) {
      console.error("Error saving request to backend:", error);
      // Don't add to local state if backend save fails - show error instead
      throw error; // Re-throw so caller can handle it
    }
  };

  const updateRequestStatus = async (id, status) => {
    try {
      // Ensure we have a valid request ID
      if (!id) {
        throw new Error("Request ID is missing");
      }

      // Save status update to backend
      await requestAPI.update(id, { status });

      // Update local state
      setRequests((prev) =>
        prev.map((request) =>
          request.id === id ? { ...request, status } : request
        )
      );

      // Refresh requests to get updated data from backend
      await refreshRequests();
    } catch (error) {
      console.error("Error updating request status:", error);
      // Fallback: update local state only if backend save fails
    setRequests((prev) =>
      prev.map((request) =>
        request.id === id ? { ...request, status } : request
      )
    );
      throw error;
    }
  };

  const updateRequest = (id, updates) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === id ? { ...request, ...updates } : request
      )
    );
  };

  const addChatMessage = async (requestId, sender, message) => {
    try {
      console.log("Sending chat message:", { requestId, sender, message });
      
      // Optimistically update UI first
      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      
      setRequests((prev) =>
        prev.map((request) =>
          request.id === requestId
            ? {
                ...request,
                chat: [...(request.chat || []), { sender, message, timestamp }],
              }
            : request
        )
      );
      
      // Save message to backend
      const response = await requestAPI.addMessage(requestId, message);
      console.log("Chat message saved:", response);
      
      // Refresh requests to get updated data from backend (with a small delay)
      setTimeout(() => refreshRequests(), 500);
      
      return response;
    } catch (error) {
      console.error("Error adding chat message:", error);
      // Revert optimistic update on error
      setRequests((prev) =>
        prev.map((request) =>
          request.id === requestId
            ? {
                ...request,
                chat: request.chat?.slice(0, -1) || [], // Remove last message
              }
            : request
        )
      );
      throw error;
    }
  };

  // Refresh requests from backend
  const refreshRequests = async () => {
    // Prevent concurrent refresh calls
    if (isRefreshing) {
      console.log("Refresh already in progress, skipping...");
      return;
    }

    try {
      setIsRefreshing(true);
      // Don't set loading to true on refresh - keep current data visible
      const response = await requestAPI.getAll();
      
      if (response.success && response.data) {
        const mappedRequests = response.data.map((request) => ({
          id: request._id,
          title: request.title,
          category: mapBackendCategoryToFrontend(request.category),
          passengerName: request.passenger?.name || "Unknown Passenger",
          seat: request.seatNumber || "",
          priority: request.priority || "Medium",
          status: request.status || "New", // Ensure status is preserved from backend
          timestamp: new Date(request.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          details: request.description || "",
          items: request.items || [],
          chat: request.chatMessages?.map(msg => ({
            sender: msg.sender === "passenger" ? request.passenger?.name : "Crew",
            message: msg.message,
            timestamp: new Date(msg.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          })) || [],
          createdAt: request.createdAt,
        }));
        
        mappedRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRequests(mappedRequests);
        setError(null); // Clear error on successful refresh
      }
    } catch (err) {
      console.error("Error refreshing requests:", err);
      // Only set error if we don't have cached data
      if (requests.length === 0) {
        setError(err.message);
      }
      // Don't clear existing requests on error - keep showing cached data
    } finally {
      setIsRefreshing(false);
    }
  };

  const value = {
    requests,
    loading,
    error,
    addRequest,
    refreshRequests,
    updateRequestStatus,
    updateRequest,
    addChatMessage,
  };

  return (
    <RequestContext.Provider value={value}>{children}</RequestContext.Provider>
  );
};
