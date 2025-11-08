# SkyAssist API Documentation

Complete API reference for SkyAssist backend.

## Base URL
```
http://localhost:5000/api
```

## Authentication

All endpoints (except `/api/auth/register` and `/api/auth/login`) require authentication using JWT tokens.

### Headers
```http
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

---

## Authentication Endpoints

### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "passenger",
  "seatNumber": "12A",
  "flightNumber": "AI345"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "passenger",
    "seatNumber": "12A",
    "flightNumber": "AI345"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "User already exists"
}
```

---

### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "passenger"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### Get Current User
```http
GET /api/auth/me
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "passenger",
    "seatNumber": "12A",
    "flightNumber": "AI345"
  }
}
```

---

## Request Endpoints

### Get All Requests
```http
GET /api/requests
```

**Query Parameters:**
- `status` (optional): Filter by status (New, Acknowledged, In Progress, Resolved, Cancelled)
- `category` (optional): Filter by category (Medical, Comfort, Security, Snacks, Drinks, General)
- `priority` (optional): Filter by priority (Low, Medium, High, Urgent)
- `sortBy` (optional): Sort field (default: "createdAt")
- `sortOrder` (optional): Sort order (asc/desc, default: "desc")

**Response (200):**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "request_id",
      "passenger": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "seatNumber": "12A"
      },
      "title": "Need water",
      "description": "I need a bottle of water",
      "category": "Drinks",
      "priority": "Medium",
      "status": "New",
      "seatNumber": "12A",
      "flightNumber": "AI345",
      "assignedTo": null,
      "chatMessages": [],
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

---

### Get Single Request
```http
GET /api/requests/:id
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "request_id",
    "passenger": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "seatNumber": "12A"
    },
    "title": "Need water",
    "description": "I need a bottle of water",
    "category": "Drinks",
    "priority": "Medium",
    "status": "New",
    "seatNumber": "12A",
    "flightNumber": "AI345",
    "assignedTo": null,
    "chatMessages": [
      {
        "sender": "passenger",
        "senderId": "user_id",
        "message": "I need water",
        "timestamp": "2024-01-15T10:00:00.000Z"
      }
    ],
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### Create Request
```http
POST /api/requests
```

**Request Body:**
```json
{
  "title": "Need water",
  "description": "I need a bottle of water",
  "category": "Drinks",
  "priority": "Medium",
  "seatNumber": "12A",
  "flightNumber": "AI345",
  "location": "Seat 12A"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Request created successfully",
  "data": {
    "_id": "request_id",
    "passenger": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "seatNumber": "12A"
    },
    "title": "Need water",
    "description": "I need a bottle of water",
    "category": "Drinks",
    "priority": "Medium",
    "status": "New",
    "seatNumber": "12A",
    "flightNumber": "AI345",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### Update Request
```http
PUT /api/requests/:id
```

**Request Body (Passenger can update):**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "priority": "High",
  "location": "Seat 12A"
}
```

**Request Body (Crew can update all fields):**
```json
{
  "status": "In Progress",
  "assignedTo": "crew_user_id",
  "priority": "High"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Request updated successfully",
  "data": {
    "_id": "request_id",
    "status": "In Progress",
    "assignedTo": {
      "_id": "crew_user_id",
      "name": "Crew Member",
      "email": "crew@example.com"
    },
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

### Delete Request
```http
DELETE /api/requests/:id
```

**Response (200):**
```json
{
  "success": true,
  "message": "Request deleted successfully"
}
```

---

### Add Chat Message to Request
```http
POST /api/requests/:id/messages
```

**Request Body:**
```json
{
  "message": "We'll bring that right away!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Message added successfully",
  "data": {
    "sender": "crew",
    "senderId": "crew_user_id",
    "message": "We'll bring that right away!",
    "timestamp": "2024-01-15T11:00:00.000Z"
  }
}
```

---

### Get Request Statistics
```http
GET /api/requests/stats
```

**Access:** Crew/Admin only

**Response (200):**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalRequests": 50,
      "newRequests": 10,
      "inProgressRequests": 15,
      "resolvedRequests": 20,
      "urgentRequests": 5
    },
    "byCategory": [
      {
        "_id": "Medical",
        "count": 10
      },
      {
        "_id": "Drinks",
        "count": 15
      }
    ]
  }
}
```

---

## Announcement Endpoints

### Get All Announcements
```http
GET /api/announcements
```

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "announcement_id",
      "title": "Meal Service",
      "message": "Lunch will be served in 30 minutes",
      "category": "Service",
      "priority": "Medium",
      "flightNumber": "AI345",
      "createdBy": {
        "_id": "crew_user_id",
        "name": "Crew Member"
      },
      "isActive": true,
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

---

### Create Announcement
```http
POST /api/announcements
```

**Request Body:**
```json
{
  "title": "Meal Service",
  "message": "Lunch will be served in 30 minutes",
  "category": "Service",
  "priority": "Medium",
  "flightNumber": "AI345"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Announcement created successfully",
  "data": {
    "_id": "announcement_id",
    "title": "Meal Service",
    "message": "Lunch will be served in 30 minutes",
    "category": "Service",
    "priority": "Medium",
    "flightNumber": "AI345",
    "createdBy": "crew_user_id",
    "isActive": true,
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### Update Announcement
```http
PUT /api/announcements/:id
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "message": "Updated message",
  "isActive": false
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Announcement updated successfully",
  "data": {
    "_id": "announcement_id",
    "title": "Updated Title",
    "message": "Updated message",
    "isActive": false,
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

### Delete Announcement
```http
DELETE /api/announcements/:id
```

**Response (200):**
```json
{
  "success": true,
  "message": "Announcement deleted successfully"
}
```

---

## Feedback Endpoints

### Get All Feedback
```http
GET /api/feedback
```

**Query Parameters:**
- `flightNumber` (optional): Filter by flight number
- `flightDate` (optional): Filter by flight date (YYYY-MM-DD)
- `minRating` (optional): Minimum rating (1-5)
- `maxRating` (optional): Maximum rating (1-5)
- `sortBy` (optional): Sort field (default: "createdAt")
- `sortOrder` (optional): Sort order (asc/desc, default: "desc")

**Response (200):**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "feedback_id",
      "passenger": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "seatNumber": "12A",
        "flightNumber": "AI345"
      },
      "flightNumber": "AI345",
      "flightDate": "2024-01-15T00:00:00.000Z",
      "overallRating": 5,
      "categoryRatings": {
        "service": 5,
        "comfort": 4,
        "cleanliness": 5,
        "crew": 5,
        "food": 4
      },
      "comments": "Excellent service!",
      "isAnonymous": false,
      "tags": ["excellent-service", "friendly-crew"],
      "wouldRecommend": true,
      "isVerified": false,
      "createdAt": "2024-01-15T12:00:00.000Z"
    }
  ]
}
```

---

### Get Single Feedback
```http
GET /api/feedback/:id
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "feedback_id",
    "passenger": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "flightNumber": "AI345",
    "flightDate": "2024-01-15T00:00:00.000Z",
    "overallRating": 5,
    "categoryRatings": {
      "service": 5,
      "comfort": 4,
      "cleanliness": 5,
      "crew": 5,
      "food": 4
    },
    "comments": "Excellent service!",
    "isAnonymous": false,
    "tags": ["excellent-service", "friendly-crew"],
    "wouldRecommend": true,
    "isVerified": false,
    "createdAt": "2024-01-15T12:00:00.000Z"
  }
}
```

---

### Create Feedback
```http
POST /api/feedback
```

**Request Body:**
```json
{
  "flightNumber": "AI345",
  "flightDate": "2024-01-15",
  "overallRating": 5,
  "categoryRatings": {
    "service": 5,
    "comfort": 4,
    "cleanliness": 5,
    "crew": 5,
    "food": 4
  },
  "comments": "Excellent service!",
  "isAnonymous": false,
  "tags": ["excellent-service", "friendly-crew"],
  "wouldRecommend": true
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Feedback submitted successfully",
  "data": {
    "_id": "feedback_id",
    "passenger": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "seatNumber": "12A",
      "flightNumber": "AI345"
    },
    "flightNumber": "AI345",
    "flightDate": "2024-01-15T00:00:00.000Z",
    "overallRating": 5,
    "categoryRatings": {
      "service": 5,
      "comfort": 4,
      "cleanliness": 5,
      "crew": 5,
      "food": 4
    },
    "comments": "Excellent service!",
    "isAnonymous": false,
    "tags": ["excellent-service", "friendly-crew"],
    "wouldRecommend": true,
    "isVerified": false,
    "createdAt": "2024-01-15T12:00:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "You have already submitted feedback for this flight"
}
```

---

### Update Feedback
```http
PUT /api/feedback/:id
```

**Request Body (Passenger):**
```json
{
  "overallRating": 4,
  "categoryRatings": {
    "service": 4,
    "comfort": 4,
    "cleanliness": 4,
    "crew": 4,
    "food": 4
  },
  "comments": "Updated comments",
  "isAnonymous": false,
  "tags": ["good-service"],
  "wouldRecommend": true
}
```

**Request Body (Admin - Verification):**
```json
{
  "isVerified": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Feedback updated successfully",
  "data": {
    "_id": "feedback_id",
    "overallRating": 4,
    "isVerified": true,
    "updatedAt": "2024-01-15T13:00:00.000Z"
  }
}
```

---

### Delete Feedback
```http
DELETE /api/feedback/:id
```

**Response (200):**
```json
{
  "success": true,
  "message": "Feedback deleted successfully"
}
```

---

### Get Feedback Statistics
```http
GET /api/feedback/stats
```

**Access:** Crew/Admin only

**Query Parameters:**
- `flightNumber` (optional): Filter by flight number
- `startDate` (optional): Start date for date range (YYYY-MM-DD)
- `endDate` (optional): End date for date range (YYYY-MM-DD)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalFeedback": 100,
      "averageRating": 4.5,
      "minRating": 1,
      "maxRating": 5,
      "recommendationPercentage": 85.5,
      "verifiedCount": 80,
      "recentFeedback": 25
    },
    "categoryRatings": {
      "service": 4.6,
      "comfort": 4.4,
      "cleanliness": 4.7,
      "crew": 4.8,
      "food": 4.3
    },
    "ratingDistribution": {
      "5": {
        "count": 50,
        "percentage": "50.00"
      },
      "4": {
        "count": 30,
        "percentage": "30.00"
      },
      "3": {
        "count": 15,
        "percentage": "15.00"
      },
      "2": {
        "count": 3,
        "percentage": "3.00"
      },
      "1": {
        "count": 2,
        "percentage": "2.00"
      }
    },
    "topFlights": [
      {
        "_id": "AI345",
        "count": 25,
        "averageRating": 4.8
      },
      {
        "_id": "AI346",
        "count": 20,
        "averageRating": 4.6
      }
    ],
    "topTags": [
      {
        "_id": "excellent-service",
        "count": 45
      },
      {
        "_id": "friendly-crew",
        "count": 40
      }
    ]
  }
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this resource"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Not authorized to perform this action"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server error message"
}
```

---

## Rate Limiting

The API implements rate limiting to prevent abuse:
- **Window**: 15 minutes (900000 ms)
- **Max Requests**: 100 requests per window per IP
- Rate limiting is disabled in development mode

---

## Notes

1. **Authentication**: Most endpoints require a valid JWT token in the Authorization header
2. **Role-Based Access**: Some endpoints are restricted to specific roles (crew, admin)
3. **Date Format**: Dates should be in ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ)
4. **Pagination**: Currently not implemented, but can be added if needed
5. **File Uploads**: Not currently supported, but can be added for attachments

---

**Last Updated**: January 2024
**API Version**: 1.0.0

