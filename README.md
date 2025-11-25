# SkyAssist - In-Flight Assistance Platform

A comprehensive full-stack platform for managing in-flight passenger assistance requests, crew communications, flight announcements, and passenger feedback. Built with React, Node.js, Express, and MongoDB.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Usage](#usage)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Overview

SkyAssist is an in-flight assistance platform that enables:


- **Link to Deployed Site** https://skyassist-frontend.onrender.com
- **Passengers** to submit service requests, medical assistance requests, and provide flight feedback
- **Crew Members** to manage passenger requests, create flight announcements, and view analytics
- **Real-time Communication** between passengers and crew members
- **Analytics Dashboard** for crew to monitor feedback and performance metrics

## Features

### Passenger Features

- ✅ **Service Request Submission** - Request snacks, drinks, comfort items
- ✅ **Medical Assistance** - Submit medical assistance requests with priority levels
- ✅ **Other Assistance** - Custom requests for any other needs
- ✅ **AI Concierge** - Get flight information and travel tips
- ✅ **Request Tracking** - View status of all submitted requests
- ✅ **Chat with Crew** - Real-time messaging with crew members
- ✅ **Flight Announcements** - View real-time flight announcements
- ✅ **Post-Flight Feedback** - Submit detailed feedback with ratings and comments
- ✅ **Anonymous Feedback** - Option to submit feedback anonymously

### Crew Features

- ✅ **Request Management** - View, filter, and manage all passenger requests
- ✅ **Request Assignment** - Assign requests to specific crew members
- ✅ **Status Updates** - Update request status (New, Acknowledged, In Progress, Resolved)
- ✅ **Chat System** - Communicate with passengers about their requests
- ✅ **Flight Announcements** - Create and send flight announcements
- ✅ **Announcement Templates** - Use pre-built templates for common announcements
- ✅ **Feedback Analytics** - View comprehensive feedback statistics and analytics
- ✅ **Performance Metrics** - Monitor ratings, recommendations, and category performance
- ✅ **Filtering & Search** - Filter feedback by flight number, date range, and ratings

### System Features

- ✅ **Authentication & Authorization** - JWT-based authentication with role-based access control
- ✅ **Real-time Updates** - Live updates for announcements and requests
- ✅ **Priority Management** - Urgent, High, Medium, and Low priority levels
- ✅ **Request Categorization** - Medical, Comfort, Security, Snacks, Drinks, General
- ✅ **Responsive Design** - Mobile-first design that works on all devices
- ✅ **Security** - Rate limiting, CORS protection, helmet.js security headers
- ✅ **Error Handling** - Comprehensive error handling and validation

## Tech Stack

### Frontend

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Context API** - State management
- **Axios** - HTTP client

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Express Rate Limit** - Rate limiting
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger

## Project Structure

```
Sky_Assist/
├── Backend/                          # Backend API
│   ├── config/
│   │   └── db.js                    # Database configuration
│   ├── controllers/                 # Request handlers
│   │   ├── authController.js
│   │   ├── requestController.js
│   │   ├── announcementController.js
│   │   └── feedbackController.js
│   ├── middlewares/                 # Custom middlewares
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/                      # Database models
│   │   ├── userModel.js
│   │   ├── requestModel.js
│   │   ├── announcementModel.js
│   │   └── feedbackModel.js
│   ├── routes/                      # API routes
│   │   ├── authRoutes.js
│   │   ├── requestRoutes.js
│   │   ├── announcementRoutes.js
│   │   └── feedbackRoutes.js
│   ├── server.js                    # Server entry point
│   ├── package.json
│   └── env.example
│
├── frontend/                         # Frontend application
│   ├── src/
│   │   ├── components/              # React components
│   │   │   ├── dashboards/
│   │   │   │   ├── CrewDashboard.jsx
│   │   │   │   └── PassengerDashboard.jsx
│   │   │   ├── FeedbackForm.jsx
│   │   │   ├── FeedbackAnalytics.jsx
│   │   │   ├── ServiceRequestForm.jsx
│   │   │   ├── MedicalAssistanceForm.jsx
│   │   │   ├── AIConcierge.jsx
│   │   │   ├── SkyTalkDashboard.jsx
│   │   │   └── ...
│   │   ├── contexts/                # React contexts
│   │   │   ├── RequestContext.jsx
│   │   │   └── AnnouncementContext.jsx
│   │   ├── services/                # API services
│   │   │   └── api.js
│   │   ├── App.jsx                  # Main app component
│   │   └── main.jsx                 # Entry point
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── README.md                         # This file
└── .gitignore
```

## Installation

### Prerequisites

- Node.js (>=16.0.0)
- MongoDB (local or Atlas)
- npm or yarn

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Sky_Assist
```

### Step 2: Install Backend Dependencies

```bash
cd Backend
npm install
```

### Step 3: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### Step 4: Set Up Environment Variables

#### Backend Environment Variables

Create a `.env` file in the `Backend` directory:

```bash
cp env.example .env
```

Edit `.env` with your configuration:

```env
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/skyassist
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/skyassist

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_very_long_and_secure
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000
```

### Step 5: Start the Development Servers

#### Start Backend Server

```bash
cd Backend
npm run dev
```

The backend server will run on `http://localhost:5000`

#### Start Frontend Server

```bash
cd frontend
npm run dev
```

The frontend application will run on `http://localhost:5173`

## Database Schema

### User Model

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['passenger', 'crew', 'admin']),
  seatNumber: String,
  flightNumber: String,
  crewId: String (unique, for crew),
  department: String (for crew),
  isActive: Boolean,
  preferences: {
    notifications: Boolean,
    language: String
  },
  timestamps: true
}
```

### Request Model

```javascript
{
  passenger: ObjectId (ref: User),
  title: String,
  description: String,
  category: String (enum: ['Medical', 'Comfort', 'Security', 'Snacks', 'Drinks', 'General']),
  priority: String (enum: ['Low', 'Medium', 'High', 'Urgent']),
  status: String (enum: ['New', 'Acknowledged', 'In Progress', 'Resolved', 'Cancelled']),
  seatNumber: String,
  flightNumber: String,
  assignedTo: ObjectId (ref: User),
  chatMessages: [{
    sender: String,
    senderId: ObjectId,
    message: String,
    timestamp: Date
  }],
  resolution: String,
  resolvedAt: Date,
  tags: [String],
  timestamps: true
}
```

### Announcement Model

```javascript
{
  title: String,
  message: String,
  category: String,
  priority: String,
  flightNumber: String,
  createdBy: ObjectId (ref: User),
  isActive: Boolean,
  timestamps: true
}
```

### Feedback Model

```javascript
{
  passenger: ObjectId (ref: User),
  flightNumber: String,
  flightDate: Date,
  overallRating: Number (1-5),
  categoryRatings: {
    service: Number (1-5),
    comfort: Number (1-5),
    cleanliness: Number (1-5),
    crew: Number (1-5),
    food: Number (1-5)
  },
  comments: String (max 1000 chars),
  isAnonymous: Boolean,
  tags: [String],
  wouldRecommend: Boolean,
  isVerified: Boolean,
  timestamps: true
}
```

## API Documentation

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "passenger",
  "seatNumber": "12A",
  "flightNumber": "AI345"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User

```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Request Endpoints

#### Get All Requests

```http
GET /api/requests
Authorization: Bearer <token>
Query Parameters:
  - status: String (optional)
  - category: String (optional)
  - priority: String (optional)
  - sortBy: String (optional, default: "createdAt")
  - sortOrder: String (optional, default: "desc")
```

#### Get Single Request

```http
GET /api/requests/:id
Authorization: Bearer <token>
```

#### Create Request

```http
POST /api/requests
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Need water",
  "description": "I need a bottle of water",
  "category": "Drinks",
  "priority": "Medium",
  "seatNumber": "12A",
  "flightNumber": "AI345"
}
```

#### Update Request

```http
PUT /api/requests/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "In Progress",
  "assignedTo": "crew_id"
}
```

#### Delete Request

```http
DELETE /api/requests/:id
Authorization: Bearer <token>
```

#### Add Chat Message

```http
POST /api/requests/:id/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "We'll bring that right away!"
}
```

#### Get Request Statistics

```http
GET /api/requests/stats
Authorization: Bearer <token>
Access: Crew/Admin only
```

### Announcement Endpoints

#### Get All Announcements

```http
GET /api/announcements
Authorization: Bearer <token>
```

#### Create Announcement

```http
POST /api/announcements
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Meal Service",
  "message": "Lunch will be served in 30 minutes",
  "category": "Service",
  "priority": "Medium",
  "flightNumber": "AI345"
}
```

#### Update Announcement

```http
PUT /api/announcements/:id
Authorization: Bearer <token>
```

#### Delete Announcement

```http
DELETE /api/announcements/:id
Authorization: Bearer <token>
```

### Feedback Endpoints

#### Get All Feedback

```http
GET /api/feedback
Authorization: Bearer <token>
Query Parameters:
  - flightNumber: String (optional)
  - flightDate: Date (optional)
  - minRating: Number (optional)
  - maxRating: Number (optional)
  - sortBy: String (optional)
  - sortOrder: String (optional)
```

#### Get Single Feedback

```http
GET /api/feedback/:id
Authorization: Bearer <token>
```

#### Create Feedback

```http
POST /api/feedback
Authorization: Bearer <token>
Content-Type: application/json

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

#### Update Feedback

```http
PUT /api/feedback/:id
Authorization: Bearer <token>
```

#### Delete Feedback

```http
DELETE /api/feedback/:id
Authorization: Bearer <token>
```

#### Get Feedback Statistics

```http
GET /api/feedback/stats
Authorization: Bearer <token>
Access: Crew/Admin only
Query Parameters:
  - flightNumber: String (optional)
  - startDate: Date (optional)
  - endDate: Date (optional)
```

## Usage

### For Passengers

1. **Login/Register**: Create an account or login with existing credentials
2. **Submit Requests**: Use the dashboard to submit service requests, medical assistance, or other requests
3. **Track Requests**: View the status of all your requests in real-time
4. **Chat with Crew**: Communicate with crew members about your requests
5. **View Announcements**: Stay updated with flight announcements
6. **Submit Feedback**: After the flight, submit feedback with ratings and comments

### For Crew Members

1. **Login**: Login with crew credentials
2. **Manage Requests**: View and manage all passenger requests
3. **Update Status**: Update request status and assign to crew members
4. **Chat with Passengers**: Respond to passenger messages
5. **Create Announcements**: Create and send flight announcements
6. **View Analytics**: Monitor feedback statistics and performance metrics

## Development

### Running in Development Mode

#### Backend

```bash
cd Backend
npm run dev
```

#### Frontend

```bash
cd frontend
npm run dev
```

### Building for Production

#### Backend

```bash
cd Backend
npm start
```

#### Frontend

```bash
cd frontend
npm run build
npm run preview
```

### Database Setup

1. Install MongoDB locally or use MongoDB Atlas
2. Update `MONGO_URI` in `.env` file
3. The application will automatically create collections on first run

### Testing

Run tests (when implemented):

```bash
npm test
```

## Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs for password security
- **Rate Limiting** - Protection against brute force attacks
- **CORS** - Cross-origin resource sharing protection
- **Helmet.js** - Security headers
- **Input Validation** - Mongoose schema validation
- **Role-Based Access Control** - Different permissions for passengers, crew, and admin

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Use ESLint for code linting
- Follow existing code style and conventions
- Write meaningful commit messages
- Add comments for complex logic

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@skyassist.com or create an issue in the repository.

## Acknowledgments

- Material Symbols for icons
- Lucide React for additional icons
- Tailwind CSS for styling
- MongoDB for database
- Express.js community for excellent documentation

## Changelog

### Version 1.0.0 (Current)

- ✅ Initial release
- ✅ User authentication and authorization
- ✅ Request management system
- ✅ Announcement system
- ✅ Feedback system with analytics
- ✅ Real-time chat functionality
- ✅ Crew and passenger dashboards
- ✅ AI Concierge integration
- ✅ Responsive design

---

**Built with ❤️ by the SkyAssist Team**
