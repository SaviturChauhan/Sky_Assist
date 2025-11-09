import React, { useState, useEffect } from "react";
import { useRequests } from "../contexts/RequestContext";
import { getIconForCategory } from "./icons.jsx";
import { requestAPI } from "../services/api";

const PassengerRequests = ({ user }) => {
  const { requests, updateRequest, refreshRequests } = useRequests();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Filter requests for the current passenger
  const passengerRequests = requests.filter(
    (request) => request.passengerName === user.name
  );

  // Refresh requests periodically to get new messages and status updates
  useEffect(() => {
    // Refresh immediately on mount
    refreshRequests();
    
    // Refresh every 30 seconds to catch status updates (increased interval to reduce API calls)
    // Only refresh if page is visible to user
    const interval = setInterval(() => {
      // Check if page is visible before refreshing
      if (!document.hidden) {
        refreshRequests();
      }
    }, 30000); // Refresh every 30 seconds (reduced from 10 seconds)

    return () => clearInterval(interval);
  }, [refreshRequests]);

  const handleSendMessage = async (requestId) => {
    if (!newMessage.trim() || isSendingMessage) return;

    try {
      setIsSendingMessage(true);
      
      // Ensure we have a valid request ID
      if (!requestId) {
        throw new Error("Request ID is missing");
      }
      
      console.log("Sending message to request:", requestId);
      
      // Save message to backend
      const response = await requestAPI.addMessage(requestId, newMessage.trim());
      
      console.log("Message sent successfully:", response);
      
      // Clear message input immediately for better UX
      setNewMessage("");
      
      // Refresh requests to get updated data including the new message
      // Use a small delay to ensure backend has processed the message
      setTimeout(() => {
        refreshRequests();
      }, 500);
    } catch (error) {
      console.error("Error sending message:", error);
      console.error("Request ID:", requestId);
      console.error("Error details:", error.message);
      alert(`Failed to send message: ${error.message}. Please try again.`);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "New":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Acknowledged":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "In Progress":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Resolved":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Map backend status to display text
  const getStatusDisplayText = (status) => {
    if (status === "Resolved") {
      return "Service Provided";
    }
    return status;
  };

  const getPriorityColor = (priority, category) => {
    // Use green colors for all food items
    if (
      ["Snacks", "Drinks", "Main Course", "Desserts", "Fruits"].includes(
        category
      )
    ) {
      switch (priority) {
        case "Urgent":
          return "bg-red-500";
        case "High":
          return "bg-orange-500";
        case "Medium":
          return "bg-green-600";
        case "Low":
          return "bg-green-500";
        default:
          return "bg-green-500";
      }
    }

    // Default colors for other categories
    switch (priority) {
      case "Urgent":
        return "bg-red-500";
      case "High":
        return "bg-orange-500";
      case "Medium":
        return "bg-yellow-500";
      case "Low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  if (passengerRequests.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Requests</h2>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-gray-400 text-2xl">
              assignment
            </span>
          </div>
          <p className="text-gray-500 text-lg">No requests yet</p>
          <p className="text-gray-400 text-sm mt-2">
            Submit a request to start chatting with the crew
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Requests</h2>

      <div className="space-y-4">
        {passengerRequests.map((request) => {
          const Icon = getIconForCategory(request.category);
          const chatCount = request.chat ? request.chat.length : 0;

          return (
            <div
              key={request.id}
              className={`rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-colors duration-200 ${
                [
                  "Snacks",
                  "Drinks",
                  "Main Course",
                  "Desserts",
                  "Fruits",
                ].includes(request.category)
                  ? "bg-green-50"
                  : "bg-gray-50"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Request Icon */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${getPriorityColor(
                    request.priority,
                    request.category
                  )}`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Request Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {request.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {getStatusDisplayText(request.status)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">
                        schedule
                      </span>
                      {request.timestamp}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">
                        event_seat
                      </span>
                      Seat {request.seat}
                    </span>
                  </div>

                  <p className="text-gray-700 text-sm mb-3">
                    {request.details}
                  </p>

                  {/* Chat Section */}
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex items-center justify-end mb-2">
                      <button
                        onClick={() =>
                          setSelectedRequest(
                            selectedRequest === request.id ? null : request.id
                          )
                        }
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-base">
                          chat
                        </span>
                        {selectedRequest === request.id
                          ? "Hide Chat"
                          : "Show Chat"}
                      </button>
                    </div>

                    {/* Chat Messages */}
                    {selectedRequest === request.id && (
                      <div className="space-y-3 mb-4">
                        {request.chat && request.chat.length > 0 ? (
                          request.chat.map((message, index) => (
                            <div
                              key={index}
                              className={`p-3 rounded-lg ${
                                message.sender === user.name
                                  ? "bg-blue-50 ml-4"
                                  : "bg-gray-100 mr-4"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-gray-600">
                                  {message.sender}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {message.timestamp}
                                </span>
                              </div>
                              <p className="text-sm text-gray-800">
                                {message.message}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm italic">
                            No messages yet
                          </p>
                        )}

                        {/* Chat Input */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                handleSendMessage(request.id);
                              }
                            }}
                            placeholder="Type your message..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                          <button
                            onClick={() => handleSendMessage(request.id)}
                            disabled={!newMessage.trim() || isSendingMessage}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-base">
                              send
                            </span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PassengerRequests;
