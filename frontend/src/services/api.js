// API utility functions for making authenticated requests

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

// Get auth token from localStorage
const getToken = () => {
  return localStorage.getItem("authToken");
};

// Get user data from localStorage
export const getUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

// Set auth token and user data
export const setAuth = (token, user) => {
  localStorage.setItem("authToken", token);
  localStorage.setItem("user", JSON.stringify(user));
};

// Clear auth data
export const clearAuth = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
};

// Make authenticated API request
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    if (!response.ok) {
      // Log detailed error for debugging
      console.error("API Error:", {
        endpoint,
        status: response.status,
        statusText: response.statusText,
        data,
      });
      throw new Error(data.message || `Request failed: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    // Log network errors
    console.error("Network Error:", {
      endpoint,
      error: error.message,
    });
    throw error;
  }
};

// Announcement API calls
export const announcementAPI = {
  getAll: () => apiRequest("/api/announcements"),
  getById: (id) => apiRequest(`/api/announcements/${id}`),
  create: (announcementData) =>
    apiRequest("/api/announcements", {
      method: "POST",
      body: JSON.stringify(announcementData),
    }),
  update: (id, announcementData) =>
    apiRequest(`/api/announcements/${id}`, {
      method: "PUT",
      body: JSON.stringify(announcementData),
    }),
  delete: (id) =>
    apiRequest(`/api/announcements/${id}`, {
      method: "DELETE",
    }),
  getLiveFeed: () => apiRequest("/api/announcements/live-feed"),
};

// Request API calls
export const requestAPI = {
  getAll: () => apiRequest("/api/requests"),
  getById: (id) => apiRequest(`/api/requests/${id}`),
  create: (requestData) =>
    apiRequest("/api/requests", {
      method: "POST",
      body: JSON.stringify(requestData),
    }),
  update: (id, requestData) =>
    apiRequest(`/api/requests/${id}`, {
      method: "PUT",
      body: JSON.stringify(requestData),
    }),
  delete: (id) =>
    apiRequest(`/api/requests/${id}`, {
      method: "DELETE",
    }),
  addMessage: (id, message) => {
    // Ensure ID is a string (MongoDB ObjectIds need to be strings)
    const requestId = String(id);
    return apiRequest(`/api/requests/${requestId}/messages`, {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  },
};

// Feedback API calls
export const feedbackAPI = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/api/feedback${queryParams ? `?${queryParams}` : ""}`);
  },
  getById: (id) => apiRequest(`/api/feedback/${id}`),
  create: (feedbackData) =>
    apiRequest("/api/feedback", {
      method: "POST",
      body: JSON.stringify(feedbackData),
    }),
  update: (id, feedbackData) =>
    apiRequest(`/api/feedback/${id}`, {
      method: "PUT",
      body: JSON.stringify(feedbackData),
    }),
  delete: (id) =>
    apiRequest(`/api/feedback/${id}`, {
      method: "DELETE",
    }),
  getStats: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/api/feedback/stats${queryParams ? `?${queryParams}` : ""}`);
  },
};

