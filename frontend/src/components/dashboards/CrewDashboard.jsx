import React, { useState, useMemo } from "react";
import RequestDetails from "../pages/RequestDetails";
import RequestList from "../pages/RequestList";
import RequestSortControls from "../pages/RequestSortControls";
import Header from "../ui/Header";
import StatusBadge from "../ui/StatusBadge";
import PassengerRequestCard from "../pages/PassengerRequestCard";
import { StyledCard } from "../ui/ui";
import { useRequests } from "../../contexts/RequestContext";
import { useAnnouncements } from "../../contexts/AnnouncementContext";

const CrewDashboard = ({ user, onLogout, onNavigate }) => {
  const { requests, updateRequestStatus, addChatMessage } = useRequests();
  const { announcements } = useAnnouncements();
  const [sortBy, setSortBy] = useState("priority");
  const [sortOrder, setSortOrder] = useState("asc");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedPassenger, setExpandedPassenger] = useState(null);

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateRequestStatus(id, status);
    } catch (error) {
      console.error("Failed to update status:", error);
      alert(`Failed to update status: ${error.message}. Please try again.`);
    }
  };

  const handleAddChatMessage = (requestId, sender, message) => {
    addChatMessage(requestId, sender, message);
  };

  const handlePassengerClick = (passengerKey) => {
    if (expandedPassenger === passengerKey) {
      // If clicking the same passenger, collapse it
      setExpandedPassenger(null);
    } else {
      // Otherwise, expand this passenger
      setExpandedPassenger(passengerKey);
    }
  };

  const handleSortChange = (newSortBy, newSortOrder) => {
    if (newSortOrder) {
      setSortOrder(newSortOrder);
    } else {
      setSortBy(newSortBy);
      // Toggle order if same sort field is clicked
      if (sortBy === newSortBy) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortOrder("asc");
      }
    }
  };

  // Filter and sort requests based on current settings
  const filteredAndSortedRequests = useMemo(() => {
    // First filter by status
    let filteredRequests = requests;
    if (statusFilter !== "All") {
      filteredRequests = requests.filter(
        (request) => request.status === statusFilter
      );
    }

    // Then sort the filtered results
    const priorityOrder = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
    const statusOrder = {
      New: 4,
      "In Progress": 3,
      Acknowledged: 2,
      Resolved: 1,
    };

    return [...filteredRequests].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "priority":
          comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
          break;
        case "time":
          // Parse time for comparison (assuming HH:MM AM/PM format)
          const timeA = new Date(`2000-01-01 ${a.timestamp}`);
          const timeB = new Date(`2000-01-01 ${b.timestamp}`);
          comparison = timeB - timeA; // Newest first by default
          break;
        case "status":
          comparison = statusOrder[b.status] - statusOrder[a.status];
          break;
        case "seat":
          // Extract seat number for comparison
          const seatA = parseInt(a.seat.match(/\d+/)[0]);
          const seatB = parseInt(b.seat.match(/\d+/)[0]);
          comparison = seatA - seatB;
          break;
        default:
          comparison = 0;
      }

      return sortOrder === "asc" ? -comparison : comparison;
    });
  }, [requests, sortBy, sortOrder, statusFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header user={user} onLogout={onLogout} />
      <div className="p-6 animate-fadeIn">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <div className="relative">
                  <h1 className="text-4xl font-display font-bold text-gray-900 mb-2 tracking-tight hover-lift">
                    <span className="text-indigo-600">Crew</span>
                    <span className="text-purple-600 ml-2 letter-float">
                      Dashboard
                    </span>
                  </h1>
                  <div className="absolute -bottom-1 left-0 w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full gradient-shift opacity-70"></div>
                </div>
                <p className="text-gray-600 font-body font-medium">
                  Manage passenger requests and flight announcements
                </p>
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Flight Announcement Component */}
            <div
              onClick={() => onNavigate("skytalk")}
              className="group cursor-pointer bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl p-8 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                    <span className="material-symbols-outlined text-white text-4xl">
                      campaign
                    </span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold mb-2">
                      Make Announcement
                    </h3>
                    <p className="text-white/90 text-lg">
                      Create and send flight announcements to passengers
                    </p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                  <span className="material-symbols-outlined text-white text-2xl">
                    arrow_forward
                  </span>
                </div>
              </div>
            </div>

            {/* Feedback Analytics Component */}
            <div
              onClick={() => onNavigate("feedback-analytics")}
              className="group cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                    <span className="material-symbols-outlined text-white text-4xl">
                      star
                    </span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold mb-2">
                      Feedback Analytics
                    </h3>
                    <p className="text-white/90 text-lg">
                      View and analyze passenger feedback and ratings
                    </p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                  <span className="material-symbols-outlined text-white text-2xl">
                    arrow_forward
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Overview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
            {/* Request Overview */}
            <div className="lg:col-span-3">
              <StyledCard className="p-8 shadow-xl border border-slate-200 h-full">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Request Overview
                </h2>
                <p className="text-gray-600 mb-8">
                  Monitor and manage all passenger requests
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Total Requests Card */}
                  <button className="p-6 rounded-xl text-left transition-all transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white focus:ring-indigo-300">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined text-white text-2xl">
                        assignment_turned_in
                      </span>
                    </div>
                    <h3 className="font-bold text-lg font-display mb-1">
                      All Requests
                    </h3>
                    <p className="text-sm opacity-90 mb-2">
                      Total passenger requests
                    </p>
                    <div className="text-2xl font-bold">
                      {filteredAndSortedRequests.length}
                    </div>
                  </button>

                  {/* New Requests Card */}
                  <button className="p-6 rounded-xl text-left transition-all transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 bg-blue-600/80 hover:bg-blue-600 text-white focus:ring-blue-400">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined text-white text-2xl">
                        add_task
                      </span>
                    </div>
                    <h3 className="font-bold text-lg font-display mb-1">
                      New Requests
                    </h3>
                    <p className="text-sm opacity-90 mb-2">Pending review</p>
                    <div className="text-2xl font-bold">
                      {requests.filter((r) => r.status === "New").length}
                    </div>
                  </button>

                  {/* In Progress Card */}
                  <button className="p-6 rounded-xl text-left transition-all transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white focus:ring-amber-300">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined text-white text-2xl">
                        pending_actions
                      </span>
                    </div>
                    <h3 className="font-bold text-lg font-display mb-1">
                      In Progress
                    </h3>
                    <p className="text-sm opacity-90 mb-2">Active requests</p>
                    <div className="text-2xl font-bold">
                      {
                        requests.filter((r) => r.status === "In Progress")
                          .length
                      }
                    </div>
                  </button>

                  {/* Urgent Requests Card */}
                  <button className="p-6 rounded-xl text-left transition-all transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 bg-red-600/80 hover:bg-red-600 text-white focus:ring-red-400">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined text-white text-2xl">
                        emergency
                      </span>
                    </div>
                    <h3 className="font-bold text-lg font-display mb-1">
                      Urgent Items
                    </h3>
                    <p className="text-sm opacity-90 mb-2">Priority requests</p>
                    <div className="text-2xl font-bold">
                      {requests.filter((r) => r.priority === "Urgent").length}
                    </div>
                  </button>
                </div>
              </StyledCard>
            </div>

            {/* Live Feed Section */}
            <div className="lg:col-span-1">
              <StyledCard className="p-6 shadow-xl border border-slate-200 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Live Feed</h2>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600">Live</span>
                  </div>
                </div>

                <div className="overflow-hidden" style={{ maxHeight: "400px" }}>
                  {announcements.length > 0 ? (
                    <div
                      className="overflow-y-auto live-feed-scroll pr-2"
                      style={{ maxHeight: "400px" }}
                    >
                      <div className="space-y-3">
                        {announcements.map((announcement, index) => (
                          <div
                            key={announcement.id}
                            className="p-3 rounded-lg border border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50 hover:shadow-md transition-all duration-200"
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  announcement.color === "red"
                                    ? "bg-red-500"
                                    : announcement.color === "purple"
                                    ? "bg-purple-500"
                                    : announcement.color === "blue"
                                    ? "bg-blue-500"
                                    : "bg-gray-500"
                                }`}
                              >
                                <span className="material-symbols-outlined text-white text-sm">
                                  {announcement.icon}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold text-sm text-gray-900">
                                    {announcement.title}
                                  </h4>
                                  <span className="text-xs text-gray-500">
                                    {announcement.time}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-600 leading-relaxed break-words line-clamp-2">
                                  {announcement.message}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div
                      className="flex flex-col items-center justify-center text-gray-500 py-8"
                      style={{ height: "400px" }}
                    >
                      <span className="material-symbols-outlined text-4xl mb-2 block">
                        campaign
                      </span>
                      <p className="text-sm">No announcements yet</p>
                    </div>
                  )}
                </div>
              </StyledCard>
            </div>
          </div>

          {/* Main Content Area */}
          <StyledCard className="p-8 shadow-xl border border-slate-200">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Passenger Requests
                </h2>
                <p className="text-gray-600">
                  Click on any request to view details and respond
                </p>
              </div>
              <RequestSortControls
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
              {/* Request List with Expandable Details */}
              <div className="lg:col-span-7">
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Active Requests ({filteredAndSortedRequests.length})
                    </h3>

                    {/* Status Filter Tabs */}
                    <div className="flex flex-wrap gap-2">
                      {[
                        "All",
                        "New",
                        "Acknowledged",
                        "In Progress",
                        "Resolved",
                      ].map((status) => {
                        // Map backend status to display text
                        const displayText = status === "Resolved" ? "Service Provided" : status;
                        return (
                        <button
                          key={status}
                          onClick={() => setStatusFilter(status)}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                            statusFilter === status
                              ? "bg-indigo-500 text-white shadow-md"
                              : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                          }`}
                        >
                            {displayText}
                          {status !== "All" && (
                            <span className="ml-2 text-xs opacity-75">
                              (
                              {
                                requests.filter((r) => r.status === status)
                                  .length
                              }
                              )
                            </span>
                          )}
                        </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="max-h-96 overflow-y-auto request-list-scroll">
                    <RequestList
                      requests={filteredAndSortedRequests}
                      onUpdateStatus={handleUpdateStatus}
                      userRole="crew"
                    />
                  </div>
                </div>
              </div>

              {/* Passenger Overview Panel */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-xl border border-slate-200 p-6 h-fit">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Passenger Overview
                  </h3>
                  <div className="max-h-96 overflow-y-auto request-list-scroll space-y-4">
                    {(() => {
                      // Group requests by passenger
                      const passengerGroups = requests.reduce(
                        (groups, request) => {
                          const passengerKey = `${request.passengerName}-${request.seat}`;
                          if (!groups[passengerKey]) {
                            groups[passengerKey] = {
                              passengerName: request.passengerName,
                              seat: request.seat,
                              requests: [],
                              totalRequests: 0,
                              activeRequests: 0,
                            };
                          }
                          groups[passengerKey].requests.push(request);
                          groups[passengerKey].totalRequests++;
                          if (request.status !== "Resolved") {
                            groups[passengerKey].activeRequests++;
                          }
                          return groups;
                        },
                        {}
                      );

                      const passengerList = Object.values(passengerGroups);

                      if (passengerList.length === 0) {
                        return (
                          <div className="text-center py-8 text-gray-500">
                            <span className="material-symbols-outlined text-4xl mb-2 block">
                              person_off
                            </span>
                            <p>No passengers found</p>
                          </div>
                        );
                      }

                      return passengerList.map((passenger, index) => {
                        const passengerKey = `${passenger.passengerName}-${passenger.seat}`;
                        const isExpanded = expandedPassenger === passengerKey;

                        return (
                          <div key={index}>
                            <div
                              onClick={() => handlePassengerClick(passengerKey)}
                              className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                                isExpanded
                                  ? "bg-indigo-50 border-indigo-300 shadow-md"
                                  : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <h4 className="font-semibold text-gray-900">
                                    {passenger.passengerName}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    Seat {passenger.seat}
                                  </p>
                                </div>
                                <div className="text-right flex items-center gap-2">
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {passenger.activeRequests} Active
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {passenger.totalRequests} Total
                                    </div>
                                  </div>
                                  <span
                                    className={`material-symbols-outlined text-gray-400 transition-transform duration-200 ${
                                      isExpanded ? "rotate-180" : ""
                                    }`}
                                  >
                                    expand_more
                                  </span>
                                </div>
                              </div>

                              <div className="space-y-2">
                                {passenger.requests
                                  .slice(
                                    0,
                                    isExpanded ? passenger.requests.length : 3
                                  )
                                  .map((request, reqIndex) => (
                                    <div
                                      key={reqIndex}
                                      className="flex items-center justify-between p-2 bg-white rounded border border-slate-100"
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm text-gray-400">
                                          {request.category === "Medical"
                                            ? "medical_services"
                                            : request.category === "Security"
                                            ? "security"
                                            : request.category === "Comfort"
                                            ? "hotel"
                                            : request.category === "Snacks"
                                            ? "restaurant"
                                            : request.category === "Drinks"
                                            ? "local_drink"
                                            : "help"}
                                        </span>
                                        <span className="text-sm font-medium text-gray-700">
                                          {request.title}
                                        </span>
                                      </div>
                                      <StatusBadge status={request.status} />
                                    </div>
                                  ))}
                                {!isExpanded &&
                                  passenger.requests.length > 3 && (
                                    <div className="text-xs text-gray-500 text-center pt-1">
                                      +{passenger.requests.length - 3} more
                                      requests
                                    </div>
                                  )}
                              </div>
                            </div>

                            {isExpanded && (
                              <div className="mt-3 animate-fadeIn">
                                <h5 className="font-semibold text-gray-900 mb-3 px-4 text-sm">
                                  All Requests & Messages
                                </h5>
                                <div className="space-y-3">
                                  {passenger.requests.map(
                                    (request, reqIndex) => (
                                      <PassengerRequestCard
                                        key={reqIndex}
                                        request={request}
                                        onAddChatMessage={handleAddChatMessage}
                                      />
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </StyledCard>
        </div>
      </div>
    </div>
  );
};

export default CrewDashboard;
