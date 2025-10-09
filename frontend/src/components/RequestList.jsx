import React, { useState } from "react";
import RequestListItem from "./RequestListItem";
import RequestDetails from "./RequestDetails";

const RequestList = ({ requests, onUpdateStatus, userRole = "crew" }) => {
  const [expandedRequestId, setExpandedRequestId] = useState(null);

  const handleRequestClick = (request) => {
    if (expandedRequestId === request.id) {
      // If clicking the same request, collapse it
      setExpandedRequestId(null);
    } else {
      // Otherwise, expand this request
      setExpandedRequestId(request.id);
    }
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-12 text-text-secondary/70">
        <p>No active requests.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((req) => (
        <div key={req.id}>
          <RequestListItem
            request={req}
            onClick={() => handleRequestClick(req)}
            isExpanded={expandedRequestId === req.id}
          />
          {expandedRequestId === req.id && (
            <div className="mt-4 animate-fadeIn">
              <RequestDetails
                request={req}
                onBack={() => setExpandedRequestId(null)}
                onUpdateStatus={onUpdateStatus}
                userRole={userRole}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RequestList;
