import React from "react";

const InfoBlock = ({ title, content, className = "" }) => {
  return (
    <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
      <h4 className="font-semibold text-gray-700 text-sm mb-2 uppercase tracking-wide">
        {title}
      </h4>
      <div className="text-gray-900">{content}</div>
    </div>
  );
};

export default InfoBlock;

