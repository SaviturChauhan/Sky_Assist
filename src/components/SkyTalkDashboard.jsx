import React from "react";
import { useAnnouncements } from "../contexts/AnnouncementContext";

const SkyTalkDashboard = ({ onBack, onCreateAnnouncement, user }) => {
  const { announcements } = useAnnouncements();
  const templates = [
    {
      id: 1,
      name: "Boarding Complete",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDG1tTD0FAI71H40K21M_psFlZHkd6wR9jBs_GK_k94WOa6yGPzvc9PfEd4V6cS2ciFbIql_sTLFxuT938EZ0CqgZrIiVCXJX6C62qEH3-96FcIJk0zmhGJ4_6aFb8wCNTTfZq7qXUz38T3P-Ugnqq3_VZLAunjOQLK7PtIqqZk0MclNcdJ6vOnOvNi_TuKmrkj5QbB80zEtl5YPBIo2Gavkbm4OkvCyxhqhvXcTScRJFe9l63BjYOoviHDRWK7fcCEJro8K2qQpw-c",
    },
    {
      id: 2,
      name: "Meal Service",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBdk649NHH8ifCKmZ4V8fnXl-T2QEA6U_EXTQSR6KWou2M1JrZicZ2BHBWknVu1fAczM73HeZXckhST8JjXH8ClN7mHhxJRpzHJdLwuEcwA7KovQE9aX4dKQR8vn8X8Bgi-naUAXAZe_2rbSGpUJE-2m5566IrQIotU7UE753WTtB4fbEv5ZWW3xuE5ZYfEa990EreolUOioxLu9H8-FfvmVzteIPPWb38lyOka0Nwg2WqNXrWHbtHdYukuOX8rT0htz4od8DivWOSb",
    },
    {
      id: 3,
      name: "Turbulence (Urgent)",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDQ-lwujPUnR0ieoKa1EdBwATnbFYYxO80rdHIFihrUhCTcNAc0eLB3S3E5n-lKVQ_wIWxQ7K9MVIOfLJkoL9uCX3JJjIvUW0KkhkIcl_T7auvjeqLMj2V-39P4zbZ1huw9fBdysr21Q6s01knHpNiyrHTEgocD4h9d3y1_g-m39vrEMS9V8CJQ1E8TwLFLvA1nUSFg5cE6MsnJVMtSoqjck_efyHt3qP99PYXDZpkfrvtyKs8StQojHioOqCZNhQkNj15GZHF1-DsQ",
      isUrgent: true,
    },
    {
      id: 4,
      name: "Final Descent",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBxozZdVrMa4YOXWbTlTghW2TeCHOmylU2VgRJtCc8aE49UQ9WJB-XHA7efcNJT9h1g-d4WiVqb4AHKN54buirhCOQyZkft3gVdaKE25s30OOM-VExcouchO10aTpH0X7sCFnN-EUCHP9Rvss8c89rHqb0vpw9uQ7pi2DSTJ8r-qoJ-L5tplyXdDgKnQgWHY3h6ra5Vltk1STM86ttAhZY2y8zeLsLGg_pDlER-fz99g6rrNMsDrymbONC-vFANYJWnINM4QreRBtRp",
    },
    {
      id: 5,
      name: "Welcome & Gate Info",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBh48TKouQnJ0iZiVI5GMca30iIGd-2qzyCmM_GrzIfJ9FGReTmsrBo1p2HMmGjXNjq0fR4NMAwnIZoD880NY45c_AaBw-xagZgtPeiMqcZonNX7XlOFeNeWbQgX6wH2OVzQipc9rAMnNQY9e9i9Sqi7A1l313M0ZWvXvqNmKcUZf0KOMPjfKZtjc3Er1LPD0k2kSK9ucoP7oUW3E4WaKFjae6-strHSlIX2JDWUkJBYs6gNLWS1iuNOInJVPXBPk3934M1ScMklciM",
    },
  ];

  const recentActivity = [
    { announcement: "Final Descent", status: "In Progress", time: "1:15 PM" },
    { announcement: "Turbulence Warning", status: "Urgent", time: "12:45 PM" },
    { announcement: "Meal Service", status: "Completed", time: "11:30 AM" },
    {
      announcement: "Boarding Complete",
      status: "Completed",
      time: "10:15 AM",
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Urgent":
        return "bg-pink-100 text-pink-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="font-sans bg-gray-50 text-gray-800 min-h-screen">
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between px-6 sm:px-10 py-4 bg-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 text-white bg-gradient-to-br from-purple-600 to-blue-500 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">
                flight_takeoff
              </span>
            </div>
            <h1 className="text-2xl font-display font-bold text-gray-900 hover-lift">
              <span className="text-indigo-600">Sky</span>
              <span className="text-purple-600 letter-float">Assist</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm font-semibold text-gray-600">
              <span className="material-symbols-outlined text-base text-gray-500">
                airplane_ticket
              </span>
              <span>Flight UA-345</span>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-white shadow-md"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCqVpsB-XFy1t5g1XN5pmhFWaXVZdoShQjeEVcr_XcWUie3wXB4mlOyRT3y0Vtea9DMBOrvGsuJwD4W2vJsVhhrGzXqpSB-XtUJ5PKrD-vgaAVYXfMGqhYyJezlVIXaJ4gH_8KSTh5fkoDMXfu0nteDSizat-hAeQIxLamTaKFUrQY7WLKBPMSGK3aIR6I6EVagobxexyKJS4hBcbZUVWLIhu8TOS2VS5bHJ03J5eDv0a7W9dDh2zmMkxJC832w0YauwJ7-iLd8Vfu1")',
                }}
              ></div>
              <div className="hidden md:block text-sm">
                <div className="font-bold text-gray-800">
                  {user?.name || "Amelia Earhart"}
                </div>
                <div className="text-gray-500">
                  Crew ID: {user?.id || "7890"}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Back Button */}
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 text-sm font-medium mb-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </button>
        </div>

        {/* Main Content */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-10">
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
                Announcement Page
              </h2>
              <p className="text-gray-500 mt-1">
                Welcome back, {user?.name || "Amelia"}!
              </p>
            </div>
            <button
              onClick={onCreateAnnouncement}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold shadow-lg shadow-purple-200 hover:opacity-90 transition-opacity w-full sm:w-auto"
            >
              <span className="material-symbols-outlined">add</span>
              <span className="truncate">New Announcement</span>
            </button>
          </div>

          <div className="max-w-4xl mx-auto space-y-12">
            {/* Quick Templates */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-5">
                Quick Templates
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                {templates.map((template) => (
                  <a
                    key={template.id}
                    className="group flex flex-col gap-3 text-center cursor-pointer"
                    onClick={() => onCreateAnnouncement(template.name)}
                  >
                    <div
                      className={`relative w-full aspect-square rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-2 ${
                        template.isUrgent
                          ? "bg-red-100 border border-red-200"
                          : "bg-white"
                      }`}
                    >
                      <div
                        className="w-full h-full rounded-lg bg-cover bg-center"
                        style={{
                          backgroundImage: `url("${template.image}")`,
                        }}
                      ></div>
                    </div>
                    <p
                      className={`text-base font-semibold transition-colors ${
                        template.isUrgent
                          ? "text-red-600"
                          : "text-gray-700 group-hover:text-purple-600"
                      }`}
                    >
                      {template.name}
                    </p>
                  </a>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-5">
                Recent Activity
              </h3>
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="max-h-96 overflow-y-auto request-list-scroll">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider"
                          scope="col"
                        >
                          Announcement
                        </th>
                        <th
                          className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider"
                          scope="col"
                        >
                          Status
                        </th>
                        <th
                          className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-right"
                          scope="col"
                        >
                          Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {announcements.map((announcement) => (
                        <tr
                          key={announcement.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                            {announcement.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                announcement.color === "red"
                                  ? "bg-red-100 text-red-800"
                                  : announcement.color === "purple"
                                  ? "bg-purple-100 text-purple-800"
                                  : announcement.color === "blue"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {announcement.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500">
                            {announcement.time}
                          </td>
                        </tr>
                      ))}

                      {announcements.length === 0 && (
                        <tr>
                          <td
                            colSpan="3"
                            className="px-6 py-8 text-center text-gray-500"
                          >
                            <span className="material-symbols-outlined text-4xl mb-2 block">
                              history
                            </span>
                            <p className="text-sm">No recent activity</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SkyTalkDashboard;
