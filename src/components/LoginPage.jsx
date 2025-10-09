import React, { useState } from "react";
import PropTypes from "prop-types";
import { GiAirplane } from "react-icons/gi";
import { User, Shield, ChevronLeft } from "./icons.jsx";

// Demo users data
const demoUsers = {
  passengers: [
    {
      name: "Amelia Harper",
      seat: "23A",
      credentials: { seat: "23A", lastName: "Harper" },
    },
    {
      name: "John Smith",
      seat: "15B",
      credentials: { seat: "15B", lastName: "Smith" },
    },
    {
      name: "Sarah Johnson",
      seat: "8C",
      credentials: { seat: "8C", lastName: "Johnson" },
    },
    {
      name: "Michael Brown",
      seat: "12F",
      credentials: { seat: "12F", lastName: "Brown" },
    },
  ],
  crew: [
    {
      name: "Emily Turner",
      role: "Lead Flight Attendant",
      credentials: { crewId: "FA001", password: "crew123" },
    },
    {
      name: "David Martinez",
      role: "Flight Attendant",
      credentials: { crewId: "FA002", password: "crew123" },
    },
    {
      name: "Lisa Chen",
      role: "Senior Flight Attendant",
      credentials: { crewId: "FA003", password: "crew123" },
    },
    {
      name: "James Wilson",
      role: "Flight Supervisor",
      credentials: { crewId: "FA004", password: "crew123" },
    },
  ],
};

// --- UI Components ---
const StyledCard = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-xl ${className}`}>
    {children}
  </div>
);

const PrimaryButton = ({ children, className = "", ...props }) => (
  <button
    className={`flex items-center justify-center w-full px-4 py-3 font-semibold text-white rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-indigo-600 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const AccentButton = ({ children, className = "", ...props }) => (
  <button
    className={`flex items-center justify-center w-full px-4 py-3 font-semibold text-white bg-gray-800 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const UserIcon = ({ className = "" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

const UserTieIcon = ({ className = "" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12,3A4,4 0 0,0 8,7A4,4 0 0,0 12,11A4,4 0 0,0 16,7A4,4 0 0,0 12,3M12,13C14.67,13 20,14.33 20,17V20H4V17C4,14.33 9.33,13 12,13M12.16,14.56C11,14.3 9.62,14 8,14C5.61,14 2,15.17 2,17V18H10.1L12.16,14.56M15.5,14.25L14,12L12.5,14.25L14,16.5L15.5,14.25Z" />
  </svg>
);

// Login Form Component
const LoginForm = ({ userType, onLogin, onBack }) => {
  const [formData, setFormData] = useState({
    seat: "",
    lastName: "",
    crewId: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setLoginError("");
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (userType === "passenger") {
      const passenger = demoUsers.passengers.find(
        (p) =>
          p.credentials.seat.toLowerCase() === formData.seat.toLowerCase() &&
          p.credentials.lastName.toLowerCase() ===
            formData.lastName.toLowerCase()
      );

      if (passenger) {
        onLogin("passenger", { ...passenger, role: "passenger" });
      } else {
        setLoginError("Invalid seat number or last name");
      }
    } else {
      const crew = demoUsers.crew.find(
        (c) =>
          c.credentials.crewId === formData.crewId &&
          c.credentials.password === formData.password
      );

      if (crew) {
        onLogin("crew", { ...crew, role: "crew" });
      } else {
        setLoginError("Invalid crew ID or password");
      }
    }
  };

  const fillDemoCredentials = (user) => {
    if (userType === "passenger") {
      setFormData({
        seat: user.credentials.seat,
        lastName: user.credentials.lastName,
        crewId: "",
        password: "",
      });
    } else {
      setFormData({
        seat: "",
        lastName: "",
        crewId: user.credentials.crewId,
        password: user.credentials.password,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md animate-fadeIn">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-6"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Back to Role Selection
        </button>

        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-display font-bold text-gray-900 hover-lift">
            <span className="text-indigo-600">Sky</span>
            <span className="text-purple-600 letter-float">Assist</span>
          </h1>
          <p className="text-gray-600 mt-2">
            {userType === "passenger" ? "Passenger Login" : "Crew Login"}
          </p>
        </div>

        {/* Demo Users */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-3">Demo Users:</p>
          <div className="grid grid-cols-2 gap-2">
            {demoUsers[userType === "passenger" ? "passengers" : "crew"].map(
              (user, index) => (
                <button
                  key={index}
                  onClick={() => fillDemoCredentials(user)}
                  className="p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded border text-left transition-colors"
                >
                  <div className="font-medium text-gray-900">
                    {userType === "passenger"
                      ? user.seat
                      : user.credentials.crewId}
                  </div>
                  <div className="text-gray-600">{user.name}</div>
                </button>
              )
            )}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {userType === "passenger" ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seat Number (e.g., 23A)
                </label>
                <input
                  type="text"
                  name="seat"
                  value={formData.seat}
                  onChange={handleInputChange}
                  placeholder="23A"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Harper"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember Me
                </label>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Crew ID
                </label>
                <input
                  type="text"
                  name="crewId"
                  value={formData.crewId}
                  onChange={handleInputChange}
                  placeholder="FA001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
            </>
          )}

          {loginError && (
            <div className="text-red-600 text-sm text-center">{loginError}</div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Log In as {userType === "passenger" ? "Passenger" : "Crew"}
          </button>
        </form>
      </div>
    </div>
  );
};

const LoginPage = ({ onLogin }) => {
  const [currentStep, setCurrentStep] = useState("role-selection"); // 'role-selection', 'passenger-login', 'crew-login'

  const handleFormSubmit = (event) => {
    event.preventDefault();
  };

  const handleRoleSelect = (userType) => {
    setCurrentStep(userType === "passenger" ? "passenger-login" : "crew-login");
  };

  const handleBackToRoleSelection = () => {
    setCurrentStep("role-selection");
  };

  // Show login forms based on current step
  if (currentStep === "passenger-login") {
    return (
      <LoginForm
        userType="passenger"
        onLogin={onLogin}
        onBack={handleBackToRoleSelection}
      />
    );
  }

  if (currentStep === "crew-login") {
    return (
      <LoginForm
        userType="crew"
        onLogin={onLogin}
        onBack={handleBackToRoleSelection}
      />
    );
  }

  // Original role selection page
  return (
    <>
      <style>{`
        @keyframes zoom-in-out {
          0% {
            transform: scale(1.05);
          }
          50% {
            transform: scale(1.15);
          }
          100% {
            transform: scale(1.05);
          }
        }
        .animate-zoom {
          animation: zoom-in-out 30s ease-in-out infinite;
        }
      `}</style>
      <main className="flex flex-col md:flex-row min-h-screen w-full font-sans">
        {/* --- Left Side: Animated Image and Branding (60% width on desktop) --- */}
        <div className="relative hidden md:flex md:w-3/5 items-center justify-center overflow-hidden bg-indigo-600">
          <div className="relative z-20 text-white text-center animate-fadeIn">
            <div className="relative mb-8 group">
              <GiAirplane className="w-28 h-28 mx-auto text-white pulse-scale transform -rotate-45 hover:rotate-0 transition-transform duration-500" />
              <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-2xl"></div>
            </div>

            <div className="relative mb-6">
              <h2 className="text-6xl font-display font-bold mb-4 tracking-tight hover-lift">
                <span className="text-glow relative inline-block">
                  Welcome
                  <span className="absolute -top-1 -right-1 text-2xl animate-pulse">
                    ✈️
                  </span>
                </span>
                <br />
                <span className="text-shimmer text-4xl">Aboard</span>
              </h2>
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-white to-transparent rounded-full opacity-60"></div>
            </div>

            <p className="text-xl text-blue-100 font-body font-medium leading-relaxed max-w-md mx-auto">
              Your seamless in-flight experience starts here.
            </p>
          </div>
        </div>

        {/* --- Right Side: Login Form (40% width on desktop) --- */}
        <div className="w-full md:w-2/5 flex flex-col justify-center items-center bg-gray-50 p-4 sm:p-6 md:p-8">
          <StyledCard className="w-full max-w-sm p-8 text-center animate-fadeInUp">
            <div className="flex justify-center items-center mb-8">
              <div className="relative group">
                <GiAirplane className="w-14 h-14 text-indigo-600 pulse-scale transform -rotate-45 hover:rotate-0 transition-transform duration-300" />
                <div className="absolute inset-0 bg-indigo-200 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
              </div>
              <div className="ml-4 relative">
                <h1 className="text-5xl font-display font-bold tracking-tight hover-lift">
                  <span className="text-indigo-600">Sky</span>
                  <span className="text-purple-600 ml-1 letter-float">
                    Assist
                  </span>
                </h1>
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-70"></div>
              </div>
            </div>
            <p className="text-gray-600 mb-8 font-body font-medium">
              Your In-Flight Companion
            </p>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <PrimaryButton
                onClick={() => handleRoleSelect("passenger")}
                type="button"
              >
                <UserIcon className="w-5 h-5 mr-3" />
                <span>Continue as Passenger</span>
              </PrimaryButton>
              <AccentButton
                onClick={() => handleRoleSelect("crew")}
                type="button"
              >
                <UserTieIcon className="w-5 h-5 mr-3" />
                <span>Crew Member Login</span>
              </AccentButton>
            </form>
          </StyledCard>
          <footer className="text-center mt-8">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()}{" "}
              <span className="text-shimmer">SkyAssist</span>. All Rights
              Reserved.
            </p>
          </footer>
        </div>
      </main>
    </>
  );
};

LoginPage.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default LoginPage;
