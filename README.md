# SkyAssist - In-Flight Assistance Platform

A comprehensive platform for managing in-flight passenger assistance requests and crew communications.

## Project Structure

```
project-4/
├── frontend/              # React frontend application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md
├── backend/               # Backend API (to be added)
├── node_modules/          # Shared dependencies
├── .gitignore
└── README.md             # This file
```

## Frontend

The frontend is a React application built with Vite, featuring:

- **Crew Dashboard**: Manage passenger requests and announcements
- **Passenger Dashboard**: Submit and track service requests
- **SkyTalk Dashboard**: Create flight announcements
- **Real-time Live Feed**: Live updates of announcements
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Getting Started

1. Navigate to frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Backend (Planned)

The backend will be added to provide:

- REST API endpoints
- Real-time WebSocket connections
- Database management
- Authentication and authorization
- AI integration for assistance

## Features

- ✅ **Crew Management**: Handle passenger requests efficiently
- ✅ **Passenger Interface**: Easy request submission and tracking
- ✅ **Live Announcements**: Real-time flight updates
- ✅ **Request Categorization**: Medical, comfort, security, and general requests
- ✅ **Priority Management**: Urgent, high, medium, and low priority levels
- ✅ **Status Tracking**: New, acknowledged, in progress, and resolved states
- ✅ **Responsive Design**: Works on all devices

## Technologies

### Frontend

- React 18
- Vite
- Tailwind CSS
- Material Symbols
- Context API

### Backend (Planned)

- Node.js/Express
- WebSocket
- Database (TBD)
- Authentication
- AI Services

## Development

This project is organized to support both frontend and backend development in the same repository, making it easy to:

- Share common configurations
- Maintain consistent code standards
- Deploy as a full-stack application
- Collaborate on both frontend and backend features
