// API utility functions for making authenticated requests

// Use environment variable for API URL (set in Render), or default to localhost for development
const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "https://skyassist-backend.onrender.com" : "http://localhost:5000");

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

// Request queue to prevent simultaneous requests
let requestQueue = [];
let isProcessingQueue = false;

// Process request queue with delays
const processQueue = async () => {
  if (isProcessingQueue || requestQueue.length === 0) return;
  
  isProcessingQueue = true;
  
  while (requestQueue.length > 0) {
    const { endpoint, options, resolve, reject } = requestQueue.shift();
    
    try {
      const result = await makeRequest(endpoint, options);
      resolve(result);
    } catch (error) {
      reject(error);
    }
    
    // Small delay between requests to prevent rate limiting
    if (requestQueue.length > 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  isProcessingQueue = false;
};

// Queue a request
const queueRequest = (endpoint, options) => {
  return new Promise((resolve, reject) => {
    requestQueue.push({ endpoint, options, resolve, reject });
    processQueue();
  });
};

// Make authenticated API request with retry logic for rate limits
const makeRequest = async (endpoint, options = {}, retryCount = 0) => {
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

    // Handle rate limiting with exponential backoff
    if (response.status === 429) {
      const maxRetries = 3;
      if (retryCount < maxRetries) {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff: 1s, 2s, 4s
        console.warn(`Rate limited. Retrying in ${delay}ms... (attempt ${retryCount + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return makeRequest(endpoint, options, retryCount + 1);
      } else {
        console.error("Rate limit exceeded after retries");
        throw new Error("Too many requests from this IP, please try again later.");
      }
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

// Make authenticated API request (public interface)
const apiRequest = async (endpoint, options = {}) => {
  // For GET requests, queue them to prevent simultaneous calls
  // POST/PUT/DELETE requests go through immediately (they're excluded from rate limiting)
  const method = (options.method || 'GET').toUpperCase();
  
  if (method === 'GET') {
    return queueRequest(endpoint, options);
  } else {
    return makeRequest(endpoint, options);
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

