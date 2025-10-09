import React from "react";

const PriorityBadge = ({ priority }) => {
  const priorityStyles = {
    Urgent: "bg-red-500 text-white",
    High: "bg-orange-500 text-white",
    Medium: "bg-yellow-500 text-white",
    Low: "bg-green-500 text-white",
  };

  const priorityIcons = {
    Urgent: "emergency",
    High: "priority_high",
    Medium: "warning",
    Low: "check_circle",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg shadow-sm border border-white/20 ${
        priorityStyles[priority] || "bg-slate-500 text-white"
      }`}
    >
      <span className="material-symbols-outlined text-sm">
        {priorityIcons[priority] || "circle"}
      </span>
      {priority}
    </span>
  );
};

export default PriorityBadge;
