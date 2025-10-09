import React from "react";

const StatusBadge = ({ status }) => {
  const statusStyles = {
    New: "bg-blue-500 text-white",
    "In Progress": "bg-amber-500 text-white",
    Acknowledged: "bg-purple-500 text-white",
    Resolved: "bg-green-500 text-white",
    Completed: "bg-green-600 text-white",
    Pending: "bg-yellow-500 text-white",
    Urgent: "bg-red-600 text-white animate-pulse",
  };

  const statusIcons = {
    New: "new_releases",
    "In Progress": "pending_actions",
    Acknowledged: "check_circle_outline",
    Resolved: "done_all",
    Completed: "verified",
    Pending: "schedule",
    Urgent: "emergency",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg shadow-sm border border-white/20 ${
        statusStyles[status] || "bg-slate-500 text-white"
      }`}
    >
      <span className="material-symbols-outlined text-sm">
        {statusIcons[status] || "circle"}
      </span>
      {status}
    </span>
  );
};

export default StatusBadge;
