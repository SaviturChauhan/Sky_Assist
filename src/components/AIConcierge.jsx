import React, { useState, useRef, useEffect } from "react";
import { StyledCard, AccentButton, PrimaryButton } from "./ui";
import { Sparkles } from "./icons.jsx";
import aiService from "../services/aiService";
import ReactMarkdown from "react-markdown";

const AIConcierge = ({ onBack, user }) => {
  const [prompt, setPrompt] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuggestedQuestions, setShowSuggestedQuestions] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleSend = async () => {
    if (!prompt.trim() || isLoading) return;

    const userMessage = prompt.trim();
    setPrompt("");
    setIsLoading(true);
    setError("");

    // Add user message to conversation
    const newConversation = [
      ...conversation,
      { role: "user", content: userMessage },
    ];
    setConversation(newConversation);

    try {
      // Build context with flight details for AI
      const flightContext = {
        passengerName: user?.name || "Passenger",
        seat: user?.seat || "Unknown",
        // Add more flight details as needed (e.g., route, duration, meal service, etc.)
      };
      // Get AI response
      const aiResponse = await aiService.sendMessage(
        userMessage,
        conversation,
        flightContext
      );

      // Add AI response to conversation
      setConversation([
        ...newConversation,
        { role: "assistant", content: aiResponse },
      ]);
    } catch (err) {
      setError(err.message);
      // Remove the user message if API call failed
      setConversation(conversation);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledCard className="p-6 animate-slideUp">
      {/* Back to Dashboard Button */}
      <div className="mb-4">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Dashboard
        </button>
      </div>

      <div className="flex items-center text-indigo-600 mb-4">
        <Sparkles className="w-8 h-8 mr-3" />
        <h2 className="text-2xl font-display">AI Concierge</h2>
      </div>
      <p className="text-text-secondary mb-4">
        Ask me anything about your flight, destination, or general topics.
      </p>

      {/* Suggested Questions */}
      {showSuggestedQuestions && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg mb-4 border border-indigo-200">
          <h3 className="text-sm font-semibold text-indigo-800 mb-2">
            Suggested Questions:
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              "What's the weather at my destination?",
              "How long is the flight?",
              "What meals are available?",
              "Can I use WiFi?",
              "What's my seat number?",
              "Are there any delays?",
            ].map((q) => (
              <button
                key={q}
                onClick={() => {
                  setPrompt(q);
                }}
                className="px-3 py-1 text-xs bg-white text-indigo-700 rounded-full border border-indigo-300 hover:bg-indigo-100 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="bg-white/80 p-4 rounded-lg h-64 overflow-y-auto mb-4 border border-slate-300">
        {conversation.length === 0 ? (
          <p className="text-text-secondary/50 text-center mt-12">
            Your conversation will appear here
          </p>
        ) : (
          <div className="space-y-3">
            {conversation.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-text-primary"
                  }`}
                >
                  {message.role === "user" ? (
                    <p className="text-sm">{message.content}</p>
                  ) : (
                    <div className="text-sm prose prose-sm max-w-none">
                      <ReactMarkdown
                        components={{
                          ul: ({ children }) => (
                            <ul className="list-disc list-inside space-y-1">
                              {children}
                            </ul>
                          ),
                          li: ({ children }) => (
                            <li className="text-text-primary">{children}</li>
                          ),
                          p: ({ children }) => (
                            <p className="text-text-primary mb-2 last:mb-0">
                              {children}
                            </p>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-semibold text-text-primary">
                              {children}
                            </strong>
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 text-text-primary p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Input Area */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          disabled={isLoading}
          className="flex-grow p-3 rounded-lg bg-white/80 border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder={isLoading ? "AI is responding..." : "Ask a question..."}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !prompt.trim()}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "..." : "Send"}
        </button>
      </div>

      {/* Clear Chat Button */}
      {conversation.length > 0 && (
        <div className="mt-4 flex justify-between">
          <button
            onClick={() => {
              setConversation([]);
              setShowSuggestedQuestions(true);
            }}
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Clear Chat
          </button>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Back to Services
          </button>
        </div>
      )}

      {/* Back Button (when no conversation) */}
      {conversation.length === 0 && (
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setShowSuggestedQuestions(!showSuggestedQuestions)}
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            {showSuggestedQuestions ? "Hide" : "Show"} Suggestions
          </button>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Back to Services
          </button>
        </div>
      )}
    </StyledCard>
  );
};

export default AIConcierge;
