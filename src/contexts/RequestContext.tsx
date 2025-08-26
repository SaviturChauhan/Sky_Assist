import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ServiceRequest {
  id: string;
  type: 'drinks' | 'snacks' | 'comfort' | 'medical' | 'security';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'new' | 'acknowledged' | 'in-progress' | 'resolved';
  passengerId: string;
  passengerSeat: string;
  description: string;
  timestamp: Date;
  estimatedTime?: number;
  assignedCrew?: string;
}

export interface Message {
  id: string;
  requestId: string;
  senderId: string;
  senderName: string;
  senderType: 'passenger' | 'crew';
  content: string;
  timestamp: Date;
}

interface RequestContextType {
  requests: ServiceRequest[];
  messages: Message[];
  createRequest: (request: Omit<ServiceRequest, 'id' | 'timestamp' | 'status'>) => void;
  updateRequestStatus: (requestId: string, status: ServiceRequest['status'], assignedCrew?: string) => void;
  sendMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  getRequestsByPassenger: (passengerId: string) => ServiceRequest[];
  getMessagesByRequest: (requestId: string) => Message[];
}

const RequestContext = createContext<RequestContextType | undefined>(undefined);

export const useRequests = () => {
  const context = useContext(RequestContext);
  if (context === undefined) {
    throw new Error('useRequests must be used within a RequestProvider');
  }
  return context;
};

export const RequestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const createRequest = (requestData: Omit<ServiceRequest, 'id' | 'timestamp' | 'status'>) => {
    const newRequest: ServiceRequest = {
      ...requestData,
      id: `req_${Date.now()}`,
      status: 'new',
      timestamp: new Date(),
    };
    setRequests(prev => [newRequest, ...prev]);
  };

  const updateRequestStatus = (requestId: string, status: ServiceRequest['status'], assignedCrew?: string) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === requestId
          ? { ...req, status, assignedCrew: assignedCrew || req.assignedCrew }
          : req
      )
    );
  };

  const sendMessage = (messageData: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...messageData,
      id: `msg_${Date.now()}`,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const getRequestsByPassenger = (passengerId: string) => {
    return requests.filter(req => req.passengerId === passengerId);
  };

  const getMessagesByRequest = (requestId: string) => {
    return messages.filter(msg => msg.requestId === requestId);
  };

  const value = {
    requests,
    messages,
    createRequest,
    updateRequestStatus,
    sendMessage,
    getRequestsByPassenger,
    getMessagesByRequest,
  };

  return <RequestContext.Provider value={value}>{children}</RequestContext.Provider>;
};