import React from "react";
import { ChevronDown } from "./icons.jsx";

const RequestSortControls = ({ sortBy, sortOrder, onSortChange }) => {
  const sortOptions = [
    { value: "priority", label: "Priority", icon: "priority_high" },
    { value: "time", label: "Time", icon: "schedule" },
    { value: "status", label: "Status", icon: "flag" },
    { value: "seat", label: "Seat", icon: "event_seat" },
  ];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>

          <div className="flex items-center gap-2">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onSortChange(option.value)}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  sortBy === option.value
                    ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent"
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {option.icon}
                </span>
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() =>
            onSortChange(sortBy, sortOrder === "asc" ? "desc" : "asc")
          }
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined text-base">
            {sortOrder === "asc" ? "keyboard_arrow_up" : "keyboard_arrow_down"}
          </span>
          <span className="text-xs">
            Sort {sortOrder === "asc" ? "↑" : "↓"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default RequestSortControls;
