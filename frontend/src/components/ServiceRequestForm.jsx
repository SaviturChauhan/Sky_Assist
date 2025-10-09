import React, { useState } from "react";
import { StyledCard, AccentButton, PrimaryButton } from "./ui";
import { serviceCategories } from "../lib/utils";
import ServiceItem from "./ServiceItem";
import { useRequests } from "../contexts/RequestContext";
import {
  UtensilsCrossed,
  GlassWater,
  Bed,
  Headphones,
  Monitor,
  Wifi,
  MessageCircle,
  Tv,
  Map,
  Gamepad2,
  Music,
  Film,
  Eye,
  Coffee,
  Apple,
  Cookie,
  Pizza,
  Wine,
  Beer,
  Sandwich,
  CakeSlice,
  IceCream,
  Beef,
  Grape,
  Donut,
  Circle,
  Brush,
  Box,
  Banana,
  Square,
  Gift,
  BedSingle,
  Armchair,
} from "lucide-react";

const ServiceRequestForm = ({ onBack, user }) => {
  const [activeTab, setActiveTab] = useState("food");
  const [selectedItems, setSelectedItems] = useState({});
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedItems, setSubmittedItems] = useState([]);
  const { addRequest } = useRequests();

  // Reorganized service categories into 4 tabs
  const tabbedCategories = {
    food: {
      title: "Food Items",
      icon: UtensilsCrossed,
      items: [
        { name: "Pizza", icon: Pizza, category: "food" },
        { name: "Cookie", icon: Cookie, category: "food" },
        { name: "Sandwich", icon: Sandwich, category: "food" },
        { name: "Burger", icon: Beef, category: "food" },
        { name: "Soup", icon: Coffee, category: "food" },
        { name: "Rice", icon: Circle, category: "food" },
        { name: "Apple", icon: Apple, category: "food" },
        { name: "Banana", icon: Banana, category: "food" },
        { name: "Grapes", icon: Grape, category: "food" },
        { name: "Cake Slice", icon: CakeSlice, category: "food" },
        { name: "Ice Cream", icon: IceCream, category: "food" },
        { name: "Donut", icon: Donut, category: "food" },
      ],
    },
    beverages: {
      title: "Beverages",
      icon: GlassWater,
      items: [
        { name: "Water", icon: GlassWater, category: "beverages" },
        { name: "Coffee", icon: Coffee, category: "beverages" },
        { name: "Tea", icon: Coffee, category: "beverages" },
        { name: "Apple Juice", icon: GlassWater, category: "beverages" },
        { name: "Orange Juice", icon: GlassWater, category: "beverages" },
        { name: "Soda", icon: GlassWater, category: "beverages" },
        { name: "Beer", icon: Beer, category: "beverages" },
        { name: "Wine", icon: Wine, category: "beverages" },
      ],
    },
    comfort: {
      title: "Comfort Items",
      icon: Bed,
      items: [
        { name: "Pillow", icon: BedSingle, category: "comfort" },
        { name: "Blanket", icon: BedSingle, category: "comfort" },
        { name: "Eye Mask", icon: Eye, category: "comfort" },
        { name: "Earplugs", icon: Headphones, category: "comfort" },
        { name: "Toothbrush", icon: Brush, category: "comfort" },
        { name: "Amenity Kit", icon: Gift, category: "comfort" },
        { name: "Extra Pillow", icon: BedSingle, category: "comfort" },
        { name: "Duvet", icon: Armchair, category: "comfort" },
      ],
    },
    entertainment: {
      title: "Entertainment",
      icon: Monitor,
      items: [
        { name: "Seatback Screen", icon: Monitor, category: "entertainment" },
        {
          name: "Personal Device Streaming",
          icon: Monitor,
          category: "entertainment",
        },
        { name: "Live TV", icon: Tv, category: "entertainment" },
        { name: "Moving Map", icon: Map, category: "entertainment" },
        { name: "WiFi Access", icon: Wifi, category: "entertainment" },
        {
          name: "Free Messaging",
          icon: MessageCircle,
          category: "entertainment",
        },
        { name: "Games", icon: Gamepad2, category: "entertainment" },
        { name: "Music", icon: Music, category: "entertainment" },
        { name: "Movies", icon: Film, category: "entertainment" },
      ],
    },
  };

  const toggleItem = (itemName, category) => {
    setSelectedItems((prev) => {
      // Create a deep copy of the previous state
      const newSelection = JSON.parse(JSON.stringify(prev));

      // Initialize category array if it doesn't exist
      if (!newSelection[category]) {
        newSelection[category] = [];
      }

      // Check if item is already selected
      const itemIndex = newSelection[category].indexOf(itemName);

      if (itemIndex > -1) {
        // Item is selected, remove it (deselect)
        newSelection[category].splice(itemIndex, 1);
      } else {
        // Item is not selected, add it (select)
        newSelection[category].push(itemName);
      }

      // If category array is empty, remove the category
      if (newSelection[category].length === 0) {
        delete newSelection[category];
      }

      return newSelection;
    });
  };

  const sendChatMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        sender: user.name,
        message: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChatMessages((prev) => [...prev, message]);
      setNewMessage("");
    }
  };

  const handleSubmit = () => {
    // Get all selected items
    const allItems = [];
    Object.values(selectedItems).forEach((categoryItems) => {
      allItems.push(...categoryItems);
    });

    if (allItems.length === 0) {
      alert("Please select at least one item to request.");
      return;
    }

    // Determine the main category and title
    const categories = Object.keys(selectedItems).filter(
      (cat) => selectedItems[cat].length > 0
    );
    const mainCategory = categories[0] || "General";
    const title =
      allItems.length === 1 ? allItems[0] : `${allItems.length} Items`;

    // Map category to request type
    const categoryMap = {
      food: "food",
      beverages: "drink",
      comfort: "comfort",
      entertainment: "entertainment",
    };

    // Combine selected items and chat messages for details
    let details = `Requested items: ${allItems.join(", ")}`;
    if (chatMessages.length > 0) {
      const messages = chatMessages
        .map((msg) => `${msg.timestamp}: ${msg.message}`)
        .join(" | ");
      details += ` | Passenger notes: ${messages}`;
    }

    // Create the request
    const newRequest = {
      title: title,
      category: categoryMap[mainCategory] || "general",
      passengerName: user.name,
      seat: user.seat,
      priority: "Medium",
      details: details,
      items: allItems,
      chat: chatMessages, // Include chat messages in the request
    };

    // Add to requests
    addRequest(newRequest);

    // Show success modal instead of alert
    setSubmittedItems(allItems);
    setShowSuccessModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header with Back to Dashboard */}
      <div className="bg-white shadow-sm border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto">
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
      </div>

      <div className="p-6">
        <StyledCard className="p-8 animate-fadeIn shadow-xl border border-slate-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Request Service
          </h2>
          <p className="text-gray-600 mb-8">
            Select your preferred items from the categories below
          </p>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200">
            {Object.entries(tabbedCategories).map(([tabKey, tabData]) => {
              const IconComponent = tabData.icon;
              const isActive = activeTab === tabKey;
              return (
                <button
                  key={tabKey}
                  onClick={() => setActiveTab(tabKey)}
                  className={`flex items-center gap-3 px-6 py-4 rounded-t-xl font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transform scale-105"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  {tabData.title}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {Object.entries(tabbedCategories).map(([tabKey, tabData]) => {
              if (activeTab !== tabKey) return null;

              return (
                <div key={tabKey} className="animate-fadeIn">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {tabData.items.map((item) => {
                      const IconComponent = item.icon;
                      const isSelected = selectedItems[item.category]?.includes(
                        item.name
                      );

                      return (
                        <div
                          key={item.name}
                          onClick={() => toggleItem(item.name, item.category)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                            isSelected
                              ? "border-purple-500 bg-purple-50 shadow-md"
                              : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-sm"
                          }`}
                        >
                          <div className="text-center">
                            <div
                              className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center ${
                                isSelected
                                  ? "bg-purple-500 text-white"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              <IconComponent className="w-6 h-6" />
                            </div>
                            <h3
                              className={`font-medium text-sm ${
                                isSelected ? "text-purple-700" : "text-gray-800"
                              }`}
                            >
                              {item.name}
                            </h3>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Selection Summary */}
          {Object.values(selectedItems).flat().length > 0 && (
            <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-800 mb-2">
                Selected Items:
              </h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(selectedItems).map(([category, items]) =>
                  items.map((item, index) => (
                    <span
                      key={`${category}-${item}-${index}`}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                    >
                      {item}
                    </span>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Chat Section */}
          {Object.values(selectedItems).flat().length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-800">
                  Send preferences to crew
                </h4>
                <button
                  onClick={() => setShowChat(!showChat)}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  {showChat ? "Hide Chat" : "Add Message"}
                  <span className="text-xs">{showChat ? "−" : "+"}</span>
                </button>
              </div>

              {showChat && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  {/* Chat Messages */}
                  {chatMessages.length > 0 && (
                    <div className="mb-4 max-h-32 overflow-y-auto">
                      {chatMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className="mb-2 p-2 bg-blue-50 rounded text-sm"
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-medium text-blue-800">
                              {msg.sender}
                            </span>
                            <span className="text-xs text-gray-500">
                              {msg.timestamp}
                            </span>
                          </div>
                          <p className="text-gray-700 mt-1">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Message Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Add any special preferences or notes..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                    />
                    <button
                      onClick={sendChatMessage}
                      disabled={!newMessage.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {Object.values(selectedItems).flat().length} item(s) selected
              {Object.values(selectedItems).flat().length > 0 && (
                <span className="ml-2 text-purple-600">
                  • Click items to deselect
                </span>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onBack}
                className="px-6 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
              >
                Submit Request
              </button>
            </div>
          </div>
        </StyledCard>

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl animate-slideUp">
              <div className="text-center">
                {/* Success Icon */}
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                {/* Success Message */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Request Sent!
                </h3>
                <p className="text-gray-600 mb-4">
                  Your request for{" "}
                  <span className="font-semibold text-purple-600">
                    {submittedItems.join(", ")}
                  </span>{" "}
                  has been sent to the crew.
                </p>

                {/* OK Button */}
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    onBack();
                  }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceRequestForm;
