import React, { useState, useEffect } from 'react';
import { Plane, MapPin, Bell, User, LogOut, Utensils, Shield, Heart, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useRequests } from '../contexts/RequestContext';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { getRequestsByPassenger } = useRequests();
  const [showServiceRequest, setShowServiceRequest] = useState(false);
  const [showAssistance, setShowAssistance] = useState(false);

  const myRequests = user ? getRequestsByPassenger(user.id) : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-yellow-100 text-yellow-800';
      case 'acknowledged': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRequestIcon = (type: string) => {
    switch (type) {
      case 'drinks':
      case 'snacks': return <Utensils className="w-5 h-5" />;
      case 'medical': return <Heart className="w-5 h-5" />;
      case 'security': return <Shield className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  if (!user || user.type !== 'passenger') return null;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SkyAssist</h1>
                <p className="text-sm text-gray-500">Seat {user.seat}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Connected</span>
              </div>
              
              <button
                onClick={logout}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Flight Info */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Flight SA234</h2>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">JFK → LAX</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span className="text-sm">{user.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How can we assist you?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => setShowServiceRequest(true)}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all text-left group transform hover:scale-105"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Utensils className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Service Request</h4>
                  <p className="text-sm text-gray-600">Order drinks, snacks, or comfort items</p>
                </div>
              </div>
            </button>
            
            <button
              onClick={() => setShowAssistance(true)}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-red-300 transition-all text-left group transform hover:scale-105"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Need Assistance</h4>
                  <p className="text-sm text-gray-600">Medical help or report issues</p>
                </div>
              </div>
            </button>
          </div>

          {/* Recent Requests */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Recent Requests</h3>
            
            {myRequests.length === 0 ? (
              <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No requests yet</p>
                <p className="text-sm text-gray-400 mt-1">Your service requests will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myRequests.map((request) => (
                  <div key={request.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="mt-1 flex-shrink-0">{getRequestIcon(request.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1 flex-wrap">
                            <h4 className="font-medium text-gray-900 capitalize">{request.type}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(request.status)}`}>
                              {request.status.replace('-', ' ')}
                            </span>
                            {request.priority !== 'low' && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getPriorityColor(request.priority)}`}>
                                {request.priority}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{request.description}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(request.timestamp).toLocaleTimeString()} 
                            {request.assignedCrew && ` • Handled by ${request.assignedCrew}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Service Request Modal */}
      {showServiceRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Service Request</h2>
                <button
                  onClick={() => setShowServiceRequest(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Plus className="w-6 h-6 transform rotate-45" />
                </button>
              </div>
              <div className="h-96">
                <iframe
                  src="/service-request"
                  className="w-full h-full border-0 rounded-lg"
                  title="Service Request"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assistance Modal */}
      {showAssistance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Need Assistance</h2>
                <button
                  onClick={() => setShowAssistance(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Plus className="w-6 h-6 transform rotate-45" />
                </button>
              </div>
              <div className="h-96">
                <iframe
                  src="/assistance"
                  className="w-full h-full border-0 rounded-lg"
                  title="Assistance Request"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;