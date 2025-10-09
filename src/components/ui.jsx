import React from "react";

// Styled Card Component
export const StyledCard = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-md border border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Primary Button Component
export const PrimaryButton = ({
  children,
  onClick,
  className = "",
  disabled = false,
  type = "button",
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-accent font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Accent Button Component
export const AccentButton = ({
  children,
  onClick,
  className = "",
  disabled = false,
  type = "button",
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-accent font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Secondary Button Component
export const SecondaryButton = ({
  children,
  onClick,
  className = "",
  disabled = false,
  type = "button",
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-white border-2 border-gray-300 hover:border-purple-500 hover:text-purple-700 disabled:border-gray-200 disabled:text-gray-400 text-gray-700 font-accent font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Input Component
export const Input = ({
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  className = "",
  error = "",
  ...props
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 ${
          error ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""
        }`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
    </div>
  );
};

// Textarea Component
export const Textarea = ({
  label,
  placeholder = "",
  value,
  onChange,
  className = "",
  error = "",
  rows = 4,
  ...props
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 resize-none ${
          error ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""
        }`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
    </div>
  );
};
