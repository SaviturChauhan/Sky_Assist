import React, { useState } from 'react';
import { Plane, User, Lock, MapPin } from 'lucide-react';
import { useAuth, mockPassengers, mockCrew } from '../contexts/AuthContext';

const LoginForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'passenger' | 'crew'>('passenger');
  const [formData, setFormData] = useState({
    seat: '',
    lastName: '',
    code: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handlePassengerLogin = () => {
    const passenger = mockPassengers.find(
      p => p.seat.toLowerCase() === formData.seat.toLowerCase() && 
           p.lastName.toLowerCase() === formData.lastName.toLowerCase()
    );

    if (passenger) {
      login({
        id: passenger.id,
        type: 'passenger',
        name: `${passenger.firstName} ${passenger.lastName}`,
        seat: passenger.seat,
      });
    } else {
      setError('Invalid seat number or last name. Try 1A/Doe or 2A/Johnson');
    }
  };

  const handleCrewLogin = () => {
    const crewMember = mockCrew.find(
      c => c.code === formData.code && c.password === formData.password
    );

    if (crewMember) {
      login({
        id: crewMember.id,
        type: 'crew',
        name: crewMember.name,
        role: crewMember.role,
        code: crewMember.code,
      });
    } else {
      setError('Invalid crew code or password. Try ET001/password or JR002/password');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'passenger') {
      handlePassengerLogin();
    } else {
      handleCrewLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Plane className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SkyAssist</h1>
          <p className="text-gray-600">In-Flight Assistance Platform</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('passenger')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'passenger'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Passenger
            </button>
            <button
              onClick={() => setActiveTab('crew')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'crew'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Lock className="w-4 h-4 inline mr-2" />
              Crew
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'passenger' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Seat Number
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="seat"
                      value={formData.seat}
                      onChange={handleInputChange}
                      placeholder="e.g., 1A"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Last Name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Crew Code
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      placeholder="Crew Code"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Password"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-2">Demo Credentials:</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Passengers:</strong> 1A/Doe, 2A/Johnson</p>
              <p><strong>Crew:</strong> ET001/password, JR002/password</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;