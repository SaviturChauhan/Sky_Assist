import React, { useState } from "react";
import { feedbackAPI } from "../services/api";

const StarRating = ({ rating, onRatingChange, label }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className={`text-3xl transition-all duration-200 ${
              star <= rating
                ? "text-yellow-400 hover:text-yellow-500"
                : "text-gray-300 hover:text-gray-400"
            }`}
          >
            ★
          </button>
        ))}
        {rating > 0 && (
          <span className="ml-2 text-sm text-gray-600 self-center">
            {rating}/5
          </span>
        )}
      </div>
    </div>
  );
};

const FeedbackForm = ({ user, onBack, onSuccess }) => {
  const [formData, setFormData] = useState({
    flightNumber: user?.flightNumber || "",
    flightDate: new Date().toISOString().split("T")[0],
    overallRating: 0,
    categoryRatings: {
      service: 0,
      comfort: 0,
      cleanliness: 0,
      crew: 0,
      food: 0,
    },
    comments: "",
    isAnonymous: false,
    tags: [],
    wouldRecommend: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const availableTags = [
    "excellent-service",
    "delayed-flight",
    "comfortable-seats",
    "friendly-crew",
    "clean-cabin",
    "good-food",
    "poor-service",
    "uncomfortable",
    "dirty-cabin",
    "rude-crew",
    "poor-food",
    "on-time",
    "late-boarding",
    "lost-luggage",
    "entertainment-issues",
  ];

  const handleCategoryRatingChange = (category, rating) => {
    setFormData({
      ...formData,
      categoryRatings: {
        ...formData.categoryRatings,
        [category]: rating,
      },
    });
  };

  const handleTagToggle = (tag) => {
    setFormData({
      ...formData,
      tags: formData.tags.includes(tag)
        ? formData.tags.filter((t) => t !== tag)
        : [...formData.tags, tag],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!formData.flightNumber) {
      setError("Please enter your flight number");
      setLoading(false);
      return;
    }

    if (formData.overallRating === 0) {
      setError("Please provide an overall rating");
      setLoading(false);
      return;
    }

    try {
      const response = await feedbackAPI.create(formData);
      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess(response.data);
        if (onBack) onBack();
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Thank You for Your Feedback!
            </h2>
            <p className="text-gray-600 mb-6">
              Your feedback has been submitted successfully. We appreciate your
              input and will use it to improve our services.
            </p>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Flight Feedback
              </h2>
              <p className="text-gray-600 mt-1">
                Help us improve by sharing your experience
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Flight Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Flight Number *
                </label>
                <input
                  type="text"
                  value={formData.flightNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, flightNumber: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Flight Date *
                </label>
                <input
                  type="date"
                  value={formData.flightDate}
                  onChange={(e) =>
                    setFormData({ ...formData, flightDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Overall Rating */}
            <div className="border-t pt-6">
              <StarRating
                rating={formData.overallRating}
                onRatingChange={(rating) =>
                  setFormData({ ...formData, overallRating: rating })
                }
                label="Overall Flight Experience *"
              />
            </div>

            {/* Category Ratings */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Category Ratings
              </h3>
              <div className="space-y-4">
                <StarRating
                  rating={formData.categoryRatings.service}
                  onRatingChange={(rating) =>
                    handleCategoryRatingChange("service", rating)
                  }
                  label="Service Quality"
                />
                <StarRating
                  rating={formData.categoryRatings.comfort}
                  onRatingChange={(rating) =>
                    handleCategoryRatingChange("comfort", rating)
                  }
                  label="Seat Comfort"
                />
                <StarRating
                  rating={formData.categoryRatings.cleanliness}
                  onRatingChange={(rating) =>
                    handleCategoryRatingChange("cleanliness", rating)
                  }
                  label="Cabin Cleanliness"
                />
                <StarRating
                  rating={formData.categoryRatings.crew}
                  onRatingChange={(rating) =>
                    handleCategoryRatingChange("crew", rating)
                  }
                  label="Crew Service"
                />
                <StarRating
                  rating={formData.categoryRatings.food}
                  onRatingChange={(rating) =>
                    handleCategoryRatingChange("food", rating)
                  }
                  label="Food & Beverages"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="border-t pt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Tags (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      formData.tags.includes(tag)
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {tag.replace(/-/g, " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Comments */}
            <div className="border-t pt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Additional Comments
              </label>
              <textarea
                value={formData.comments}
                onChange={(e) =>
                  setFormData({ ...formData, comments: e.target.value })
                }
                rows={5}
                maxLength={1000}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Tell us more about your experience..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.comments.length}/1000 characters
              </p>
            </div>

            {/* Options */}
            <div className="border-t pt-6 space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isAnonymous}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isAnonymous: e.target.checked,
                    })
                  }
                  className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">
                  Submit feedback anonymously
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.wouldRecommend}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      wouldRecommend: e.target.checked,
                    })
                  }
                  className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">
                  I would recommend this airline to others
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit Feedback"}
              </button>
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;

