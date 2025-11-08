import React, { useState, useEffect } from "react";
import { feedbackAPI } from "../services/api";

const StarDisplay = ({ rating, size = "text-2xl" }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`${size} ${
            star <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const FeedbackAnalytics = ({ user, onBack }) => {
  const [stats, setStats] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    flightNumber: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [statsResponse, feedbackResponse] = await Promise.all([
        feedbackAPI.getStats(filters),
        feedbackAPI.getAll(filters),
      ]);
      setStats(statsResponse.data);
      setFeedback(feedbackResponse.data || []);
    } catch (err) {
      setError(err.message || "Failed to load feedback data");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 3.5) return "text-blue-600";
    if (rating >= 2.5) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressBarColor = (percentage) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-blue-500";
    if (percentage >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading feedback analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Feedback Analytics
              </h2>
              <p className="text-gray-600 mt-1">
                View and analyze passenger feedback
              </p>
            </div>
            {onBack && (
              <button
                onClick={onBack}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Flight Number
                </label>
                <input
                  type="text"
                  value={filters.flightNumber}
                  onChange={(e) =>
                    handleFilterChange("flightNumber", e.target.value)
                  }
                  placeholder="e.g., AI345"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    handleFilterChange("startDate", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) =>
                    handleFilterChange("endDate", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {stats && (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-600">
                    Total Feedback
                  </h3>
                  <span className="material-symbols-outlined text-gray-400">
                    feedback
                  </span>
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {stats.overview.totalFeedback}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {stats.overview.recentFeedback} in last 30 days
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-600">
                    Average Rating
                  </h3>
                  <span className="material-symbols-outlined text-gray-400">
                    star
                  </span>
                </div>
                <div
                  className={`text-3xl font-bold ${getRatingColor(
                    stats.overview.averageRating
                  )}`}
                >
                  {stats.overview.averageRating.toFixed(1)}/5
                </div>
                <StarDisplay
                  rating={Math.round(stats.overview.averageRating)}
                  size="text-sm"
                />
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-600">
                    Recommendation Rate
                  </h3>
                  <span className="material-symbols-outlined text-gray-400">
                    thumb_up
                  </span>
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {stats.overview.recommendationPercentage}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className={`h-2 rounded-full ${getProgressBarColor(
                      stats.overview.recommendationPercentage
                    )}`}
                    style={{
                      width: `${stats.overview.recommendationPercentage}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-600">
                    Verified Feedback
                  </h3>
                  <span className="material-symbols-outlined text-gray-400">
                    verified
                  </span>
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {stats.overview.verifiedCount}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {stats.overview.totalFeedback > 0
                    ? (
                        (stats.overview.verifiedCount /
                          stats.overview.totalFeedback) *
                        100
                      ).toFixed(1)
                    : 0}
                  % of total
                </p>
              </div>
            </div>

            {/* Category Ratings */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Category Ratings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {Object.entries(stats.categoryRatings).map(([category, rating]) => (
                  <div key={category} className="text-center">
                    <h4 className="text-sm font-semibold text-gray-600 mb-2 capitalize">
                      {category}
                    </h4>
                    <div
                      className={`text-2xl font-bold mb-2 ${getRatingColor(
                        rating
                      )}`}
                    >
                      {rating.toFixed(1)}
                    </div>
                    <StarDisplay rating={Math.round(rating)} size="text-lg" />
                  </div>
                ))}
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Rating Distribution
              </h3>
              <div className="space-y-4">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const dist = stats.ratingDistribution[rating] || {
                    count: 0,
                    percentage: 0,
                  };
                  return (
                    <div key={rating} className="flex items-center gap-4">
                      <div className="w-16 text-center">
                        <StarDisplay rating={rating} size="text-lg" />
                        <span className="text-xs text-gray-600 mt-1">
                          {rating} stars
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">
                            {dist.count} feedback
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {dist.percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${getProgressBarColor(
                              dist.percentage
                            )}`}
                            style={{ width: `${dist.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Flights */}
            {stats.topFlights && stats.topFlights.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Top Rated Flights
                </h3>
                <div className="space-y-3">
                  {stats.topFlights.map((flight, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <span className="font-semibold text-gray-900">
                          {flight._id}
                        </span>
                        <span className="text-sm text-gray-600 ml-2">
                          ({flight.count} feedback)
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <StarDisplay
                          rating={Math.round(flight.averageRating)}
                          size="text-lg"
                        />
                        <span className="font-bold text-gray-900">
                          {flight.averageRating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Tags */}
            {stats.topTags && stats.topTags.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Most Common Tags
                </h3>
                <div className="flex flex-wrap gap-3">
                  {stats.topTags.map((tag, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                    >
                      {tag._id ? tag._id.replace(/-/g, " ") : "N/A"} (
                      {tag.count})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Feedback List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Recent Feedback ({feedback.length})
          </h3>
          <div className="space-y-4">
            {feedback.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <span className="material-symbols-outlined text-4xl mb-2 block">
                  feedback
                </span>
                <p>No feedback found</p>
              </div>
            ) : (
              feedback.map((item) => (
                <div
                  key={item._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="font-semibold text-gray-900">
                          {item.isAnonymous
                            ? "Anonymous"
                            : item.passenger?.name || "Passenger"}
                        </div>
                        <span className="text-sm text-gray-500">
                          Flight {item.flightNumber}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(item.flightDate).toLocaleDateString()}
                        </span>
                        {item.isVerified && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mb-2">
                        <StarDisplay
                          rating={item.overallRating}
                          size="text-lg"
                        />
                        <span className="text-sm font-semibold text-gray-700">
                          {item.overallRating}/5
                        </span>
                        {item.wouldRecommend && (
                          <span className="text-sm text-green-600">
                            ✓ Would recommend
                          </span>
                        )}
                      </div>
                      {item.comments && (
                        <p className="text-sm text-gray-700 mt-2">
                          {item.comments}
                        </p>
                      )}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {item.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                            >
                              {tag.replace(/-/g, " ")}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  {item.categoryRatings && (
                    <div className="grid grid-cols-5 gap-4 pt-3 border-t border-gray-100">
                      {Object.entries(item.categoryRatings).map(
                        ([category, rating]) =>
                          rating > 0 && (
                            <div key={category} className="text-center">
                              <div className="text-xs text-gray-600 capitalize mb-1">
                                {category}
                              </div>
                              <StarDisplay rating={rating} size="text-sm" />
                            </div>
                          )
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackAnalytics;

