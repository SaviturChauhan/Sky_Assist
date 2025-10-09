import React from "react";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import { getIconForCategory } from "./icons.jsx";

const RequestListItem = ({ request, onClick, isExpanded = false }) => {
  const Icon = getIconForCategory(request.category);

  // Get priority color for icon background
  const getPriorityColor = (priority, category) => {
    // Use green colors for all food items
    if (
      ["Snacks", "Drinks", "Main Course", "Desserts", "Fruits"].includes(
        category
      )
    ) {
      switch (priority) {
        case "Urgent":
          return "bg-gradient-to-br from-red-100 to-red-200";
        case "High":
          return "bg-gradient-to-br from-orange-100 to-orange-200";
        case "Medium":
          return "bg-gradient-to-br from-green-100 to-green-200";
        case "Low":
          return "bg-gradient-to-br from-green-100 to-green-200";
        default:
          return "bg-gradient-to-br from-green-100 to-green-200";
      }
    }

    // Default colors for other categories
    switch (priority) {
      case "Urgent":
        return "bg-gradient-to-br from-red-100 to-red-200";
      case "High":
        return "bg-gradient-to-br from-orange-100 to-orange-200";
      case "Medium":
        return "bg-gradient-to-br from-yellow-100 to-yellow-200";
      case "Low":
        return "bg-gradient-to-br from-green-100 to-green-200";
      default:
        return "bg-gradient-to-br from-indigo-100 to-indigo-200";
    }
  };

  const getPriorityIconColor = (priority, category) => {
    // Use green colors for all food items
    if (
      ["Snacks", "Drinks", "Main Course", "Desserts", "Fruits"].includes(
        category
      )
    ) {
      switch (priority) {
        case "Urgent":
          return "text-red-600";
        case "High":
          return "text-orange-600";
        case "Medium":
          return "text-green-600";
        case "Low":
          return "text-green-600";
        default:
          return "text-green-600";
      }
    }

    // Default colors for other categories
    switch (priority) {
      case "Urgent":
        return "text-red-600";
      case "High":
        return "text-orange-600";
      case "Medium":
        return "text-yellow-600";
      case "Low":
        return "text-green-600";
      default:
        return "text-indigo-600";
    }
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border ${
        isExpanded
          ? "border-indigo-400 shadow-lg bg-indigo-50/30"
          : "border-slate-200 hover:border-indigo-300"
      } transform hover:-translate-y-1`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          <div
            className={`w-16 h-16 ${getPriorityColor(
              request.priority,
              request.category
            )} rounded-xl flex items-center justify-center mr-5 shadow-sm`}
          >
            <Icon
              className={`w-8 h-8 ${getPriorityIconColor(
                request.priority,
                request.category
              )}`}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-bold text-gray-900 text-lg">
                {request.title}
              </h3>
              {request.priority === "Urgent" && (
                <span className="material-symbols-outlined text-red-500 text-lg">
                  emergency
                </span>
              )}
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-gray-400 text-base">
                  event_seat
                </span>
                <span className="font-medium">Seat {request.seat}</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-gray-400 text-base">
                  schedule
                </span>
                <span className="font-medium">{request.timestamp}</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-gray-400 text-base">
                  person
                </span>
                <span className="font-medium text-gray-700">
                  {request.passengerName}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2.5 ml-4">
          <PriorityBadge priority={request.priority} />
          <StatusBadge status={request.status} />
        </div>
      </div>
    </div>
  );
};

export default RequestListItem;
