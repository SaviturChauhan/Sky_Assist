import React, { useState } from 'react';
import { 
  Clock,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  User,
  Filter,
  Send,
  LogOut,
  Coffee,
  Cookie,
  Bed,
  Heart,
  Shield
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useRequests, ServiceRequest } from '../contexts/RequestContext';

const CrewDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { requests, updateRequestStatus, sendMessage, getMessagesByRequest } = useRequests();
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | ServiceRequest['status']>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | ServiceRequest['priority']>('all');
  const [messageText, setMessageText] = useState('');

  const serviceIcons = {
    drinks: Coffee,
    snacks: Cookie,
    comfort: Bed,
    medical: Heart,
    security: Shield,
  };

  const filteredRequests = requests.filter(request => {
    const statusMatch = filterStatus === 'all' || request.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || request.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    // Sort by priority first
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    // Then by timestamp (newest first)
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const handleStatusUpdate = (requestId: string, status: ServiceRequest['status']) => {
    updateRequestStatus(requestId, status, user?.name);
  };

  const handleSendMessage = (requestId: string) => {
    if (!messageText.trim() || !user) return;

    sendMessage({
      requestId,
      senderId: user.id,
      senderName: user.name,
      senderType: 'crew',
      content: messageText,
    });

    setMessageText('');
  };

  const getPriorityColor = (priority: ServiceRequest['priority']) => {
    switch (priority) {
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'urgent': return 'text-red-600 bg-red-100 border-red-200';
    }
  };

  const getStatusColor = (status: ServiceRequest['status']) => {
    switch (status) {
      case 'new': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'acknowledged': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const requestCounts = {
    total: requests.length,
    new: requests.filter(r => r.status === 'new').length,
    inProgress: requests.filter(r => r.status === 'in-progress' || r.status === 'acknowledged').length,
    resolved: requests.filter(r => r.status === 'resolved').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Crew Dashboard</h1>
              <p className="text-sm text-gray-600">{user?.role} • {user?.name}</p>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-2xl font-semibold text-gray-900">{requestCounts.total}</p>
                <p className="text-sm text-gray-600">Total Requests</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-2xl font-semibold text-gray-900">{requestCounts.new}</p>
                <p className="text-sm text-gray-600">New Requests</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-2xl font-semibold text-gray-900">{requestCounts.inProgress}</p>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-2xl font-semibold text-gray-900">{requestCounts.resolved}</p>
                <p className="text-sm text-gray-600">Resolved</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <div className="flex space-x-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="acknowledged">Acknowledged</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium text-gray-900">Service Requests ({sortedRequests.length})</h2>
          </div>
          
          {sortedRequests.length === 0 ? (
            <div className="p-8 text-center">
              <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No requests match your filters</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {sortedRequests.map((request) => {
                const ServiceIcon = serviceIcons[request.type];
                const messages = getMessagesByRequest(request.id);
                
                return (
                  <div key={request.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3">
                        <div className="bg-gray-100 p-2 rounded-lg">
                          <ServiceIcon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="font-medium text-gray-900">
                              {request.type.charAt(0).toUpperCase() + request.type.slice(1)} Request
                            </h3>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(request.priority)}`}>
                              {request.priority.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Seat {request.passengerSeat} • {new Date(request.timestamp).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-700 mt-1">{request.description}</p>
                          {request.assignedCrew && (
                            <p className="text-xs text-gray-500 mt-1">Assigned to: {request.assignedCrew}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                          {request.status.replace('-', ' ').toUpperCase()}
                        </span>
                        <button
                          onClick={() => setSelectedRequest(selectedRequest === request.id ? null : request.id)}
                          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <MessageSquare className="w-4 h-4 mr-1" />
                          ({messages.length})
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 mb-3">
                      {request.status === 'new' && (
                        <button
                          onClick={() => handleStatusUpdate(request.id, 'acknowledged')}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Acknowledge
                        </button>
                      )}
                      {(request.status === 'acknowledged' || request.status === 'new') && (
                        <button
                          onClick={() => handleStatusUpdate(request.id, 'in-progress')}
                          className="px-3 py-1 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors"
                        >
                          Start Work
                        </button>
                      )}
                      {request.status !== 'resolved' && (
                        <button
                          onClick={() => handleStatusUpdate(request.id, 'resolved')}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>

                    {selectedRequest === request.id && (
                      <div className="border-t pt-4 mt-4">
                        <div className="max-h-48 overflow-y-auto mb-4 space-y-2">
                          {messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.senderType === 'crew' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                                  message.senderType === 'crew'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-900'
                                }`}
                              >
                                <p>{message.content}</p>
                                <p className={`text-xs mt-1 ${message.senderType === 'crew' ? 'text-blue-100' : 'text-gray-500'}`}>
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

export default CrewDashboard;