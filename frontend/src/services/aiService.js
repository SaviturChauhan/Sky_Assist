import axios from "axios";

class AIService {
  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    this.anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    this.googleKey = import.meta.env.VITE_GOOGLE_API_KEY;
    this.service = import.meta.env.VITE_AI_SERVICE || "openai";
    this.customUrl = import.meta.env.VITE_CUSTOM_API_URL;
  }

  async sendMessage(message, conversationHistory = [], flightContext = {}) {
    try {
      // For demo purposes, use mock responses if no API keys are configured
      if (
        !this.apiKey &&
        !this.anthropicKey &&
        !this.googleKey &&
        !this.customUrl
      ) {
        return await this.getMockResponse(message, flightContext);
      }

      switch (this.service) {
        case "openai":
          return await this.callOpenAI(
            message,
            conversationHistory,
            flightContext
          );
        case "anthropic":
          return await this.callAnthropic(
            message,
            conversationHistory,
            flightContext
          );
        case "google":
          return await this.callGoogle(
            message,
            conversationHistory,
            flightContext
          );
        case "custom":
          return await this.callCustomAPI(
            message,
            conversationHistory,
            flightContext
          );
        default:
          return await this.getMockResponse(message, flightContext);
      }
    } catch (error) {
      console.error("AI Service Error:", error);
      // Fallback to mock response on error
      return await this.getMockResponse(message, flightContext);
    }
  }

  async callOpenAI(message, conversationHistory, flightContext = {}) {
    if (!this.apiKey) {
      throw new Error("OpenAI API key not configured");
    }

    const messages = [
      {
        role: "system",
        content: `You are an AI concierge for an airline service. Help passengers with flight information, 
        travel assistance, general questions, and provide friendly, helpful responses. Keep responses 
        concise but informative.

Flight Details:
- Passenger Name: ${flightContext.passengerName || "Unknown"}
- Seat Number: ${flightContext.seat || "Unknown"}
- Current Flight: International Flight
- Destination: Various international destinations
- Flight Duration: 8-12 hours typical
- Meal Service: Available (vegetarian and non-vegetarian options)
- WiFi: Available for purchase
- Entertainment: Personal seatback screens with movies, TV shows, and games`,
      },
      ...conversationHistory,
      { role: "user", content: message },
    ];

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  }

  async callAnthropic(message, conversationHistory, flightContext = {}) {
    if (!this.anthropicKey) {
      throw new Error("Anthropic API key not configured");
    }

    // Build conversation context
    let context = "";
    conversationHistory.forEach((msg) => {
      context += `${msg.role === "user" ? "Human" : "Assistant"}: ${
        msg.content
      }\n\n`;
    });

    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-3-haiku-20240307",
        max_tokens: 500,
        messages: [{ role: "user", content: message }],
        system: `You are an AI concierge for an airline service. Help passengers with flight information, 
        travel assistance, general questions, and provide friendly, helpful responses. Keep responses 
        concise but informative.

Flight Details:
- Passenger Name: ${flightContext.passengerName || "Unknown"}
- Seat Number: ${flightContext.seat || "Unknown"}
- Current Flight: International Flight
- Destination: Various international destinations
- Flight Duration: 8-12 hours typical
- Meal Service: Available (vegetarian and non-vegetarian options)
- WiFi: Available for purchase
- Entertainment: Personal seatback screens with movies, TV shows, and games`,
      },
      {
        headers: {
          "x-api-key": this.anthropicKey,
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
        },
      }
    );

    return response.data.content[0].text;
  }

  async callGoogle(message, conversationHistory, flightContext = {}) {
    if (!this.googleKey) {
      throw new Error("Google API key not configured");
    }

    // Build conversation context
    let context = "";
    if (conversationHistory.length > 0) {
      context =
        conversationHistory
          .slice(-6) // Keep last 6 messages for context
          .map(
            (msg) =>
              `${msg.role === "user" ? "Human" : "Assistant"}: ${msg.content}`
          )
          .join("\n\n") + "\n\n";
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.googleKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: `You are an AI concierge for an airline service. Help passengers with flight information, 
            travel assistance, general questions, and provide friendly, helpful responses. Keep responses 
            concise but informative.

Flight Details:
- Passenger Name: ${flightContext.passengerName || "Unknown"}
- Seat Number: ${flightContext.seat || "Unknown"}
- Current Flight: International Flight
- Destination: Various international destinations
- Flight Duration: 8-12 hours typical
- Meal Service: Available (vegetarian and non-vegetarian options)
- WiFi: Available for purchase
- Entertainment: Personal seatback screens with movies, TV shows, and games

${context}Human: ${message}`,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  }

  async callCustomAPI(message, conversationHistory, flightContext = {}) {
    if (!this.customUrl) {
      throw new Error("Custom API URL not configured");
    }

    const response = await axios.post(this.customUrl, {
      message,
      conversationHistory,
    });

    return response.data.response;
  }

  async getMockResponse(message, flightContext = {}) {
    // Simulate API delay
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 1000)
    );

    const lowerMessage = message.toLowerCase();

    // Flight information responses
    if (
      lowerMessage.includes("weather") ||
      lowerMessage.includes("destination")
    ) {
      return "I'd be happy to help with weather information! For current weather at your destination, I recommend checking the weather app on your seatback screen or asking a crew member for the latest updates. Most international destinations have varying weather patterns, so it's always good to check before arrival.";
    }

    if (lowerMessage.includes("flight") && lowerMessage.includes("long")) {
      return `Our current flight duration is approximately 8-12 hours, depending on your specific destination. You can find the exact arrival time on your seatback screen or by asking a crew member. We're currently cruising at 35,000 feet and making good time!`;
    }

    if (lowerMessage.includes("meal") || lowerMessage.includes("food")) {
      return "We offer a variety of meal options including vegetarian, vegan, and special dietary requirements. Our meal service typically begins 1-2 hours after takeoff. You can find the full menu on your seatback screen or ask a crew member for assistance with special dietary needs.";
    }

    if (lowerMessage.includes("wifi") || lowerMessage.includes("internet")) {
      return "Yes, WiFi is available for purchase! You can connect to our onboard WiFi network and choose from different packages. Basic browsing starts at $9.99 for the flight duration. You can purchase access through your seatback screen or ask a crew member for assistance.";
    }

    if (lowerMessage.includes("seat") && lowerMessage.includes("number")) {
      return `Your seat number is ${
        flightContext.seat || "displayed on your boarding pass"
      }. If you need assistance finding your seat or have any seating preferences, please don't hesitate to ask a crew member. We're here to help make your flight comfortable!`;
    }

    if (lowerMessage.includes("delay") || lowerMessage.includes("late")) {
      return "Currently, we're on schedule and making good time! If there are any delays or schedule changes, we'll make announcements and update the flight information screens. You can also check your seatback screen for real-time updates.";
    }

    if (
      lowerMessage.includes("entertainment") ||
      lowerMessage.includes("movie") ||
      lowerMessage.includes("tv")
    ) {
      return "We have a great selection of movies, TV shows, music, and games available on your personal seatback screen! You'll find the latest releases, classic films, and a variety of genres. We also have noise-canceling headphones available for purchase if you'd like to enhance your viewing experience.";
    }

    if (lowerMessage.includes("help") || lowerMessage.includes("assistance")) {
      return "I'm here to help! I can assist with flight information, entertainment options, meal services, WiFi access, and general questions about your journey. If you need anything specific or have concerns, please don't hesitate to ask. Our crew members are also available to assist you throughout the flight.";
    }

    // General responses
    const generalResponses = [
      "That's a great question! I'm here to help make your flight as comfortable as possible. Could you provide a bit more detail about what you're looking for?",
      "I'd be happy to assist you with that! Our crew members are also available if you need immediate assistance with anything specific.",
      "Thanks for asking! I can help with flight information, services, and general questions. What else can I help you with today?",
      "I'm here to help! Feel free to ask me about our services, flight information, or anything else that would make your journey more enjoyable.",
    ];

    return generalResponses[
      Math.floor(Math.random() * generalResponses.length)
    ];
  }
}

export default new AIService();
