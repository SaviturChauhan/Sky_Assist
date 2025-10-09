import React, { createContext, useContext, useState } from "react";
import { initialRequests } from "../lib/utils";

const RequestContext = createContext();

export const useRequests = () => {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error("useRequests must be used within a RequestProvider");
  }
  return context;
};

export const RequestProvider = ({ children }) => {
  const [requests, setRequests] = useState(initialRequests);
  const [nextId, setNextId] = useState(6);

  const addRequest = (newRequest) => {
    const request = {
      ...newRequest,
      id: nextId,
      status: "New",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      chat: [],
    };
    setRequests((prev) => [request, ...prev]);
    setNextId((prev) => prev + 1);
    return request;
  };

  const updateRequestStatus = (id, status) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === id ? { ...request, status } : request
      )
    );
  };

  const updateRequest = (id, updates) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === id ? { ...request, ...updates } : request
      )
    );
  };

  const addChatMessage = (requestId, sender, message) => {
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setRequests((prev) =>
      prev.map((request) =>
        request.id === requestId
          ? {
              ...request,
              chat: [...request.chat, { sender, message, timestamp }],
            }
          : request
      )
    );
  };

  const value = {
    requests,
    addRequest,
    updateRequestStatus,
    updateRequest,
    addChatMessage,
  };

  return (
    <RequestContext.Provider value={value}>{children}</RequestContext.Provider>
  );
};
