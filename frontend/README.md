# Frontend - SkyAssist In-Flight Assistance Platform

This is the frontend application for the SkyAssist platform, built with React and Vite.

## Project Structure

```
frontend/
├── public/                 # Static assets
│   └── site.webmanifest
├── src/
│   ├── components/         # React components
│   │   ├── dashboards/    # Dashboard components
│   │   │   ├── CrewDashboard.jsx
│   │   │   ├── PassengerDashboard.jsx
│   │   │   └── SkyTalkDashboard.jsx
│   │   ├── forms/         # Form components
│   │   │   ├── MedicalAssistanceForm.jsx
│   │   │   ├── OtherAssistanceForm.jsx
│   │   │   └── ServiceRequestForm.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── LoginPage.jsx
│   │   │   ├── PassengerHome.jsx
│   │   │   ├── PassengerRequestCard.jsx
│   │   │   ├── PassengerRequests.jsx
│   │   │   ├── RequestDetails.jsx
│   │   │   ├── RequestList.jsx
│   │   │   ├── RequestListItem.jsx
│   │   │   ├── RequestSortControls.jsx
│   │   │   └── ServiceItem.jsx
│   │   └── ui/            # UI components
│   │       ├── AIConcierge.jsx
│   │       ├── CreateAnnouncement.jsx
│   │       ├── FlightAnnouncements.jsx
│   │       ├── Header.jsx
│   │       ├── icons.js
│   │       ├── icons.jsx
│   │       ├── InfoBlock.jsx
│   │       ├── PriorityBadge.jsx
│   │       ├── StatusBadge.jsx
│   │       └── ui.jsx
│   ├── contexts/          # React contexts
│   │   ├── AnnouncementContext.jsx
│   │   └── RequestContext.jsx
│   ├── lib/               # Utility functions
│   │   └── utils.js
│   ├── services/         # API services
│   │   └── aiService.js
│   ├── assets/           # Static assets
│   │   ├── icons/
│   │   └── images/
│   ├── App.jsx           # Main App component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── index.html            # HTML template
├── package.json          # Dependencies
├── tailwind.config.js    # Tailwind CSS config
├── postcss.config.js     # PostCSS config
└── README.md            # This file
```

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start development server:

   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Features

- **Crew Dashboard**: Manage passenger requests and flight announcements
- **Passenger Dashboard**: Submit and track service requests
- **SkyTalk Dashboard**: Create and manage flight announcements
- **Real-time Updates**: Live feed of announcements
- **Responsive Design**: Works on all device sizes
- **Modern UI**: Built with Tailwind CSS and Material Icons

## Technologies Used

- React 18
- Vite
- Tailwind CSS
- Material Symbols
- Context API for state management
