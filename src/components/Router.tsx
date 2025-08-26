import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from './LoginForm';
import PassengerDashboard from './PassengerDashboard';
import CrewDashboard from './CrewDashboard';
import ServiceRequest from './ServiceRequest';
import Assistance from './Assistance';
import RequestDetails from './RequestDetails';

interface RouterProps {
  currentPath?: string;
  requestId?: string;
}

const Router: React.FC<RouterProps> = ({ currentPath = '/', requestId }) => {
  const { isAuthenticated, user } = useAuth();

  // Handle routing based on current path
  const renderComponent = () => {
    if (!isAuthenticated) {
      return <LoginForm />;
    }

    switch (currentPath) {
      case '/service-request':
        return user?.type === 'passenger' ? <ServiceRequest /> : <PassengerDashboard />;
      
      case '/assistance':
        return user?.type === 'passenger' ? <Assistance /> : <PassengerDashboard />;
      
      case '/request-details':
        return <RequestDetails requestId={requestId} />;
      
      case '/dashboard':
      case '/':
      default:
        if (user?.type === 'passenger') {
          return <PassengerDashboard />;
        } else if (user?.type === 'crew') {
          return <CrewDashboard />;
        }
        return <LoginForm />;
    }
  };

  return <>{renderComponent()}</>;
};

export default Router;