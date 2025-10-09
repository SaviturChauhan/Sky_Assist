import React, { useState, useEffect, useRef } from "react";
import { PlaneTakeoff as PlaneDepart, Bell, LogOut } from "./icons.jsx";
import { useAnnouncements } from "../contexts/AnnouncementContext";

const Header = ({ user, onLogout }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [readNotifications, setReadNotifications] = useState(new Set());
  const dropdownRef = useRef(null);

  // Get announcements for all users
  const { announcements } = useAnnouncements();

  // Get recent announcements (last 5) - for all users
  const recentAnnouncements = announcements.slice(0, 5);

  // Calculate unread notifications count
  const unreadCount = recentAnnouncements.filter(
    (announcement) => !readNotifications.has(announcement.id)
  ).length;

  // Handle notification click
  const handleNotificationClick = (announcement) => {
    // Mark as read
    setReadNotifications((prev) => new Set([...prev, announcement.id]));

    // Close dropdown
    setIsNotificationOpen(false);

    // Redirect to announcements section (you can customize this)
    // For now, we'll just scroll to the announcements section
    const announcementsSection = document.querySelector(
      "[data-announcements-section]"
    );
    if (announcementsSection) {
      announcementsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center animate-fadeIn">
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center pulse-scale transform -rotate-45 hover:rotate-0 transition-transform duration-300">
              <PlaneDepart className="w-7 h-7 text-white" />
            </div>
            <div className="absolute inset-0 bg-indigo-200 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-lg"></div>
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-900 tracking-tight hover-lift">
              <span className="text-indigo-600">Welcome,</span> {user.name}
            </h1>
            <p className="text-sm text-gray-600 font-body font-medium">
              {user.seat ? `Seat ${user.seat}` : user.role}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {/* Notification Button with Dropdown - For All Users */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className={`p-3 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200 relative ${
                unreadCount > 0 ? "text-purple-600 bg-purple-50" : ""
              }`}
            >
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full border-2 border-white flex items-center justify-center px-1 shadow-md">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden">
                <div className="max-h-80 overflow-y-auto notification-scroll">
                  {recentAnnouncements.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {recentAnnouncements.map((announcement) => {
                        const isRead = readNotifications.has(announcement.id);
                        return (
                          <div
                            key={announcement.id}
                            onClick={() =>
                              handleNotificationClick(announcement)
                            }
                            className={`p-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                              !isRead ? "bg-blue-50/30" : ""
                            }`}
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
                                <span className="material-symbols-outlined text-white text-xs">
                                  {announcement.icon}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h4
                                    className={`font-semibold text-sm ${
                                      !isRead
                                        ? "text-gray-900"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    {announcement.title}
                                    {!isRead && (
                                      <span className="ml-2 w-1.5 h-1.5 bg-red-500 rounded-full inline-block"></span>
                                    )}
                                  </h4>
                                  <span className="text-xs text-gray-500">
                                    {announcement.time}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-600 line-clamp-1">
                                  {announcement.message.length > 50
                                    ? announcement.message.substring(0, 50) +
                                      "..."
                                    : announcement.message}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <span className="material-symbols-outlined text-4xl mb-2 block">
                        notifications_off
                      </span>
                      <p className="text-sm">No new notifications</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transform hover:-translate-y-0.5"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
