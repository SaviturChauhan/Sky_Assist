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
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextId, setNextId] = useState(1);

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
        // Keep empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const addRequest = async (newRequest) => {
    try {
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

      // Save to backend
      const response = await requestAPI.create(backendData);
      
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
          chat: newRequest.chat || [],
        };

        // Update local state - add to beginning
        setRequests((prev) => [savedRequest, ...prev]);
        setNextId((prev) => prev + 1);
        return savedRequest;
      }
    } catch (error) {
      console.error("Error saving request to backend:", error);
      // Fallback: add to local state only if backend save fails
      const request = {
        ...newRequest,
        id: nextId,
        status: "New",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        chat: newRequest.chat || [],
      };
      setRequests((prev) => [request, ...prev]);
      setNextId((prev) => prev + 1);
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
      // Save message to backend
      await requestAPI.addMessage(requestId, message);
      
      // Update local state
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
      
      // Refresh requests to get updated data from backend
      await refreshRequests();
    } catch (error) {
      console.error("Error adding chat message:", error);
      // Fallback: add to local state only if backend save fails
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
      throw error;
    }
  };

  // Refresh requests from backend
  const refreshRequests = async () => {
    try {
      setLoading(true);
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
      }
    } catch (err) {
      console.error("Error refreshing requests:", err);
      setError(err.message);
    } finally {
      setLoading(false);
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
