import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  Send,
} from "./icons.jsx";
import { StyledCard, AccentButton, PrimaryButton } from "./ui";
import StatusBadge from "./StatusBadge";
import InfoBlock from "./InfoBlock.jsx";
import { requestAPI } from "../services/api";
import { useRequests } from "../contexts/RequestContext";

const RequestDetails = ({ request, onBack, onUpdateStatus, userRole }) => {
  const [chatMessage, setChatMessage] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const { refreshRequests } = useRequests();

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
    // Add passenger notes as the first message in chat
    initialChat.unshift({
      sender: request.passengerName,
      message: passengerNotes,
      timestamp: request.timestamp,
      isPassengerNote: true,
    });
  }

  const [chatHistory, setChatHistory] = useState(initialChat);

  // Sync chat history when request.chat updates (after refresh)
  useEffect(() => {
    const updatedChat = [...(request.chat || [])];
    if (passengerNotes) {
      updatedChat.unshift({
        sender: request.passengerName,
        message: passengerNotes,
        timestamp: request.timestamp,
        isPassengerNote: true,
      });
    }
    setChatHistory(updatedChat);
  }, [request.chat, request.passengerName, request.timestamp, passengerNotes]);

  // Refresh requests periodically to get new messages and status updates
  useEffect(() => {
    const interval = setInterval(() => {
      refreshRequests();
    }, 3000); // Refresh every 3 seconds to catch status updates quickly

    return () => clearInterval(interval);
  }, [refreshRequests]);

  const handleSendChat = async () => {
    if (!chatMessage.trim() || isSendingMessage) return;

    try {
      setIsSendingMessage(true);
      
      // Ensure we have a valid request ID
      if (!request.id) {
        throw new Error("Request ID is missing");
      }
      
      console.log("Sending message to request:", request.id);
      
      // Save message to backend
      const response = await requestAPI.addMessage(request.id, chatMessage.trim());
      
      console.log("Message sent successfully:", response);
      
      // Add message to local chat history immediately for better UX
      const sender = userRole === "crew" ? "Crew" : request.passengerName;
      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      
      const newMessage = {
        sender,
        message: chatMessage.trim(),
        timestamp,
      };
      
      setChatHistory([...chatHistory, newMessage]);
      setChatMessage("");
      
      // Refresh requests to get updated data from backend
      await refreshRequests();
    } catch (error) {
      console.error("Error sending message:", error);
      console.error("Request ID:", request.id);
      console.error("Error details:", error.message);
      alert(`Failed to send message: ${error.message}. Please try again.`);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "Urgent":
        return <AlertTriangle className="text-rose-500" />;
      case "High":
        return <AlertTriangle className="text-amber-500" />;
      case "Medium":
        return <Info className="text-sky-500" />;
      default:
        return <Info className="text-slate-400" />;
    }
  };

  return (
    <div className="animate-fadeIn">
      <StyledCard className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-display text-text-primary">
              {request.title}
            </h2>
            <p className="text-text-secondary">
              From: {request.passengerName} (Seat {request.seat})
            </p>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-100">
            {getPriorityIcon(request.priority)}
            <span className="font-bold text-text-secondary">
              {request.priority} Priority
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Details & Status */}
          <div className="md:col-span-1 space-y-4">
            <InfoBlock
              title="Status"
              content={<StatusBadge status={request.status} />}
            />
            <InfoBlock
              title="Submitted At"
              content={request.timestamp || request.submittedAt || "N/A"}
            />
            <InfoBlock title="Details" content={items} />

            {userRole === "crew" && (
              <div>
                <h4 className="font-bold text-text-secondary mb-2">
                  Update Status
                </h4>
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => onUpdateStatus(request.id, "Acknowledged")}
                    className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <CheckCircle className="mr-2 w-4 h-4" /> Acknowledge
                  </button>
                  <button
                    onClick={() => onUpdateStatus(request.id, "In Progress")}
                    className="flex items-center justify-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Clock className="mr-2 w-4 h-4" /> In Progress
                  </button>
                  <button
                    onClick={() => onUpdateStatus(request.id, "Resolved")}
                    className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <CheckCircle className="mr-2 w-4 h-4" /> Service Provided
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Chat */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-display text-text-primary mb-3">
              Communication Log
            </h3>
            <div className="bg-white/70 rounded-lg p-4 h-80 flex flex-col border border-slate-200">
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {chatHistory.length === 0 ? (
                  <p className="text-text-secondary text-center mt-8">
                    No messages yet.
                  </p>
                ) : (
                  chatHistory.map((chat, index) => (
                    <div
                      key={index}
                      className={`text-sm ${
                        chat.sender === "Crew" ? "text-right" : "text-left"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-text-secondary">
                          {chat.sender}
                        </span>
                        {chat.timestamp && (
                          <span className="text-xs text-slate-500">
                            {chat.timestamp}
                          </span>
                        )}
                        {chat.isPassengerNote && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                            Original Note
                          </span>
                        )}
                      </div>
                      <div
                        className={`inline-block p-3 rounded-lg max-w-xs ${
                          chat.sender === "Crew"
                            ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white"
                            : "bg-slate-100 text-text-primary"
                        }`}
                      >
                        <p className="text-sm">{chat.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4 flex gap-2 pt-3 border-t border-slate-200">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendChat()}
                  placeholder="Type a message..."
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-text-primary"
                />
                <button
                  onClick={handleSendChat}
                  disabled={isSendingMessage || !chatMessage.trim()}
                  className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </StyledCard>
    </div>
  );
};

export default RequestDetails;
