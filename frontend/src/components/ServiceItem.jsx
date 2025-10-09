import React from "react";

const ServiceItem = ({ icon: Icon, name, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center p-4 rounded-xl text-center transition-all duration-300 border-2 cursor-pointer group animate-fadeIn ${
        isSelected
          ? "bg-purple-100 border-purple-400 text-purple-700 shadow-lg scale-105"
          : "bg-white border-slate-200 hover:border-purple-400 hover:shadow-xl hover:scale-105 text-slate-600 hover:text-purple-600"
      }`}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
          <svg
            className="w-4 h-4 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      <Icon
        className={`w-8 h-8 mb-2 transition-colors duration-300 ${
          isSelected
            ? "text-purple-600"
            : "text-slate-500 group-hover:text-purple-500"
        }`}
      />
      <span className="text-sm font-medium">{name}</span>
    </button>
  );
};

export default ServiceItem;
