import React, { useState } from 'react';
import { 
  Coffee, 
  Cookie, 
  Bed, 
  Heart, 
  Shield, 
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useRequests, ServiceRequest } from '../contexts/RequestContext';

const PassengerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { createRequest, getRequestsByPassenger, sendMessage, getMessagesByRequest } = useRequests();
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');

  const serviceTypes = [
    { type: 'drinks' as const, icon: Coffee, label: 'Beverages', priority: 'low' as const, color: 'blue' },
    { type: 'snacks' as const, icon: Cookie, label: 'Snacks', priority: 'low' as const, color: 'green' },
    { type: 'comfort' as const, icon: Bed, label: 'Comfort Items', priority: 'medium' as const, color: 'purple' },
    { type: 'medical' as const, icon: Heart, label: 'Medical Assistance', priority: 'high' as const, color: 'orange' },
    { type: 'security' as const, icon: Shield, label: 'Security', priority: 'urgent' as const, color: 'red' },
  ];

  const myRequests = getRequestsByPassenger(user?.id || '');

  const handleServiceRequest = (type: ServiceRequest['type'], priority: ServiceRequest['priority']) => {
    if (!user) return;

    createRequest({
      type,
      priority,
      passengerId: user.id,
      passengerSeat: user.seat || '',
      description: `${serviceTypes.find(s => s.type === type)?.label} request from seat ${user.seat}`,
    });
  };

  const handleSendMessage = (requestId: string) => {
    if (!messageText.trim() || !user) return;

    sendMessage({
      requestId,
      senderId: user.id,
      senderName: user.name,
      senderType: 'passenger',
      content: messageText,
    });

    setMessageText('');
  };

  const getStatusColor = (status: ServiceRequest['status']) => {
    switch (status) {
      case 'new': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'acknowledged': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getStatusIcon = (status: ServiceRequest['status']) => {
    switch (status) {
      case 'new': return Clock;
      case 'acknowledged': return AlertCircle;
      case 'in-progress': return Clock;
      case 'resolved': return CheckCircle;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">SkyAssist</h1>
              <p className="text-sm text-gray-600">Seat {user?.seat} • {user?.name}</p>
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Service Request Buttons */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Request Assistance</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {serviceTypes.map(({ type, icon: Icon, label, priority, color }) => (
              <button
                key={type}
                onClick={() => handleServiceRequest(type, priority)}
                className={`p-4 rounded-xl border-2 border-transparent bg-white hover:border-${color}-200 hover:bg-${color}-50 shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105 group`}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-${color}-100 text-${color}-600 rounded-lg mb-3 group-hover:bg-${color}-200`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">{label}</h3>
                <p className={`text-xs text-${color}-600 capitalize`}>{priority} Priority</p>
              </button>
            ))}
          </div>
        </div>

        {/* Active Requests */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Your Requests</h2>
          {myRequests.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No active requests</p>
              <p className="text-sm text-gray-400 mt-1">Tap a service button above to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myRequests.map((request) => {
                const StatusIcon = getStatusIcon(request.status);
                const messages = getMessagesByRequest(request.id);
                
                return (
                  <div key={request.id} className="bg-white rounded-xl shadow-sm border">
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <div className={`inline-flex items-center justify-center w-8 h-8 bg-${serviceTypes.find(s => s.type === request.type)?.color}-100 text-${serviceTypes.find(s => s.type === request.type)?.color}-600 rounded-lg mr-3`}>
                            {React.createElement(serviceTypes.find(s => s.type === request.type)?.icon || Coffee, { className: 'w-4 h-4' })}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {serviceTypes.find(s => s.type === request.type)?.label}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {new Date(request.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {request.status.replace('-', ' ').toUpperCase()}
                        </div>
                      </div>

                      {request.assignedCrew && (
                        <div className="mb-3 text-sm text-gray-600">
                          Assigned to: {request.assignedCrew}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-700">{request.description}</p>
                        <button
                          onClick={() => setSelectedRequest(selectedRequest === request.id ? null : request.id)}
                          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Chat ({messages.length})
                        </button>
                      </div>
                    </div>

                    {selectedRequest === request.id && (
                      <div className="border-t bg-gray-50">
                        <div className="p-4">
                          <div className="max-h-48 overflow-y-auto mb-4 space-y-2">
                            {messages.map((message) => (
                              <div
                                key={message.id}
                                className={`flex ${message.senderType === 'passenger' ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                                    message.senderType === 'passenger'
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-white border text-gray-900'
                                  }`}
                                >
                                  <p>{message.content}</p>
                                  <p className={`text-xs mt-1 ${message.senderType === 'passenger' ? 'text-blue-100' : 'text-gray-500'}`}>
                                    {message.senderName} • {new Date(message.timestamp).toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={messageText}
                              onChange={(e) => setMessageText(e.target.value)}
                              placeholder="Type a message..."
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(request.id)}
                            />
                            <button
                              onClick={() => handleSendMessage(request.id)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PassengerDashboard;