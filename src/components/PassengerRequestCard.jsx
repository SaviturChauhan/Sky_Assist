import React, { useState } from "react";
import { StyledCard } from "./ui";
import StatusBadge from "./StatusBadge";
import { Send } from "./icons.jsx";

const PassengerRequestCard = ({ request, onAddChatMessage }) => {
  const [chatMessage, setChatMessage] = useState("");

  // Parse passenger notes from details and separate them from items
  const parseRequestDetails = (details) => {
    const itemsMatch = details.match(
      /Requested items: (.+?)(?:\s*\|\s*Passenger notes: (.+))?$/
    );
    if (itemsMatch) {
      return {
        items: itemsMatch[1],
        passengerNotes: itemsMatch[2] || null,
      };
    }
    return { items: details, passengerNotes: null };
  };

  const { items, passengerNotes } = parseRequestDetails(request.details);

  // Initialize chat history with passenger notes if they exist
  const initialChat = [...(request.chat || [])];
  if (passengerNotes) {
    initialChat.unshift({
      sender: request.passengerName,
      message: passengerNotes,
      timestamp: request.timestamp,
      isPassengerNote: true,
    });
  }

  const handleSendChat = () => {
    if (chatMessage.trim()) {
      onAddChatMessage(request.id, "Crew", chatMessage);
      setChatMessage("");
    }
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
          return "bg-red-100 text-red-800";
        case "High":
          return "bg-orange-100 text-orange-800";
        case "Medium":
          return "bg-green-100 text-green-800";
        case "Low":
          return "bg-green-100 text-green-800";
        default:
          return "bg-green-100 text-green-800";
      }
    }

    // Default colors for other categories
    switch (priority) {
      case "Urgent":
        return "bg-red-100 text-red-800";
      case "High":
        return "bg-orange-100 text-orange-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">{request.title}</h4>
          <p className="text-sm text-gray-600">
            {request.timestamp || request.submittedAt || "N/A"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={request.status} />
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(
              request.priority,
              request.category
            )}`}
          >
            {request.priority}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="mb-4">
        <p className="text-sm text-gray-700 bg-slate-50 p-3 rounded-lg">
          {items}
        </p>
      </div>

      {/* Communication Log */}
      <div>
        <h5 className="text-sm font-semibold text-gray-900 mb-2">Messages</h5>
        <div className="bg-slate-50 rounded-lg p-3 h-32 overflow-y-auto mb-3">
          {initialChat.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-4">
              No messages yet.
            </p>
          ) : (
            <div className="space-y-2">
              {initialChat.map((chat, index) => (
                <div
                  key={index}
                  className={`text-xs ${
                    chat.sender === "Crew" ? "text-right" : "text-left"
                  }`}
                >
                  <div className="flex items-center gap-1 mb-1">
                    <span className="font-medium text-gray-700 text-xs">
                      {chat.sender}
                    </span>
                    {chat.timestamp && (
                      <span className="text-xs text-gray-500">
                        {chat.timestamp}
                      </span>
                    )}
                  </div>
                  <div
                    className={`inline-block p-2 rounded-lg max-w-xs text-xs ${
                      chat.sender === "Crew"
                        ? "bg-indigo-500 text-white"
                        : "bg-white text-gray-800 border border-slate-200"
                    }`}
                  >
                    {chat.message}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendChat()}
            placeholder="Type a message..."
            className="flex-1 text-xs bg-white border border-slate-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={handleSendChat}
            className="flex items-center justify-center px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-xs transition-colors"
          >
            <Send className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PassengerRequestCard;
