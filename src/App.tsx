import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { RequestProvider } from './contexts/RequestContext';
import LoginForm from './components/LoginForm';
import PassengerDashboard from './components/PassengerDashboard';
import CrewDashboard from './components/CrewDashboard';
import ServiceRequest from './components/ServiceRequest';
import Assistance from './components/Assistance';
import RequestDetails from './components/RequestDetails';

// Simple router state management
const useRouter = () => {
  const [currentPath, setCurrentPath] = React.useState('/');
  const [requestId, setRequestId] = React.useState<string | undefined>();

  const navigate = (path: string, id?: string) => {
    setCurrentPath(path);
    setRequestId(id);
  };

  return { currentPath, requestId, navigate };
};

const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { currentPath, requestId, navigate } = useRouter();

  // Provide navigation context to components
  React.useEffect(() => {
    (window as any).navigate = navigate;
  }, [navigate]);

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

function App() {
  return (
    <AuthProvider>
      <RequestProvider>
        <AppContent />
      </RequestProvider>
    </AuthProvider>
  );
}

export default App;