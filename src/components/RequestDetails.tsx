import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  User, 
  Clock, 
  AlertTriangle, 
  MessageCircle, 
  Send, 
  CheckCircle,
  Heart,
  Shield,
  Utensils,
  Phone,
  Coffee,
  Cookie,
  Bed
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useRequests, ServiceRequest } from '../contexts/RequestContext';

interface RequestDetailsProps {
  requestId?: string;
}

const RequestDetails: React.FC<RequestDetailsProps> = ({ requestId }) => {
  const { user } = useAuth();
  const { requests, updateRequestStatus, sendMessage, getMessagesByRequest } = useRequests();
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  const request = requests.find(r => r.id === requestId);
  const messages = request ? getMessagesByRequest(request.id) : [];

  const serviceIcons = {
    drinks: Coffee,
    snacks: Cookie,
    comfort: Bed,
    medical: Heart,
    security: Shield,
  };

  const handleStatusUpdate = (status: ServiceRequest['status']) => {
    if (!request) return;
    updateRequestStatus(request.id, status, user?.name);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !request || !user) return;

    setSendingMessage(true);
    try {
      sendMessage({
        requestId: request.id,
        senderId: user.id,
        senderName: user.name,
        senderType: user.type,
        content: newMessage.trim(),
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const getRequestIcon = (type: ServiceRequest['type']) => {
    const IconComponent = serviceIcons[type] || Utensils;
    return <IconComponent className="w-6 h-6" />;
  };

  const getStatusColor = (status: ServiceRequest['status']) => {
    switch (status) {
      case 'new': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'acknowledged': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getPriorityColor = (priority: ServiceRequest['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Request Not Found</h2>
          <button
            onClick={() => window.history.back()}
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const medicalChecklist = [
    'Assess passenger condition',
    'Check for medical alert bracelet/card',
    'Ask about medications and allergies',
    'Provide first aid if trained',
    'Contact ground medical support if needed',
    'Document incident details',
    'Monitor passenger until resolution'
  ];

  const securityChecklist = [
    'Assess the security situation',
    'Ensure passenger and crew safety',
    'Document the incident details',
    'Isolate if necessary',
    'Contact flight deck if required',
    'Coordinate with ground security',
    'File incident report'
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center space-x-4 max-w-4xl mx-auto">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              request.priority === 'urgent' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
            }`}>
              {getRequestIcon(request.type)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Request Details
              </h1>
              <p className="text-sm text-gray-500">
                Seat {request.passengerSeat}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Request Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Info Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4 flex-wrap">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2 capitalize">
                    {request.type} Request
                  </h2>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border capitalize ${getPriorityColor(request.priority)}`}>
                      {request.priority} Priority
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border capitalize ${getStatusColor(request.status)}`}>
                      {request.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
                
                <div className="text-right text-sm text-gray-500 mt-2 sm:mt-0">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(request.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Description:</h3>
                <p className="text-gray-900 bg-gray-50 rounded-lg p-3">
                  {request.description}
                </p>
              </div>

              {/* Action Buttons - Only show for crew */}
              {user?.type === 'crew' && (
                <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                  {request.status === 'new' && (
                    <button
                      onClick={() => handleStatusUpdate('acknowledged')}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Acknowledge</span>
                    </button>
                  )}
                  
                  {request.status === 'acknowledged' && (
                    <button
                      onClick={() => handleStatusUpdate('in-progress')}
                      className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      <Clock className="w-4 h-4" />
                      <span>Start Work</span>
                    </button>
                  )}

                  {(request.status === 'acknowledged' || request.status === 'in-progress') && (
                    <button
                      onClick={() => handleStatusUpdate('resolved')}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Mark Resolved</span>
                    </button>
                  )}

                  {request.priority === 'urgent' && (
                    <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                      <Phone className="w-4 h-4" />
                      <span>Call Ground Support</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Communication</h2>
              </div>
              
              <div className="p-4">
                {/* Message History */}
                <div className="space-y-4 mb-4 max-h-96 overflow-y-auto p-2">
                  {messages.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No messages yet</p>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderType === user?.type ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderType === user?.type
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 text-right ${
                            message.senderType === user?.type ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {message.senderName} • {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="flex items-center space-x-3 pt-4 border-t">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Type a message to the ${user?.type === 'crew' ? 'passenger' : 'crew'}...`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={sendingMessage}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sendingMessage}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Passenger Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Seat {request.passengerSeat}</p>
                    <p className="text-sm text-gray-500">Passenger Request</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Standard Operating Procedures - Only show for crew and urgent requests */}
            {user?.type === 'crew' && (request.type === 'medical' || request.type === 'security') && (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {request.type === 'medical' ? 'Medical' : 'Security'} SOP Checklist
                </h3>
                <div className="space-y-2">
                  {(request.type === 'medical' ? medicalChecklist : securityChecklist).map((item, index) => (
                    <label key={index} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Handler Info */}
            {request.assignedCrew && (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Assigned Crew</h3>
                <p className="text-gray-600">{request.assignedCrew}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;