import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { FaCarCrash, FaTools, FaTruck, FaCheckCircle, FaExclamationTriangle, FaBolt, FaThermometerHalf, FaCog, FaQuestion } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const commonIssues = [
  { id: 1, name: "ENGINE WON'T START", icon: <FaCarCrash className="text-3xl text-blue-400 group-hover:text-blue-300 transition-colors duration-300" /> },
  { id: 2, name: "STRANGE NOISES", icon: <FaCog className="text-3xl text-blue-400 group-hover:text-blue-300 transition-colors duration-300" /> },
  { id: 3, name: "WARNING LIGHTS", icon: <FaExclamationTriangle className="text-3xl text-blue-400 group-hover:text-blue-300 transition-colors duration-300" /> },
  { id: 4, name: "BRAKE PROBLEMS", icon: <FaTools className="text-3xl text-blue-400 group-hover:text-blue-300 transition-colors duration-300" /> },
  { id: 5, name: "BATTERY ISSUES", icon: <FaBolt className="text-3xl text-blue-400 group-hover:text-blue-300 transition-colors duration-300" /> },
  { id: 6, name: "OVERHEATING", icon: <FaThermometerHalf className="text-3xl text-blue-400 group-hover:text-blue-300 transition-colors duration-300" /> },
  { id: 7, name: "TRANSMISSION ISSUES", icon: <FaCog className="text-3xl text-blue-400 group-hover:text-blue-300 transition-colors duration-300" /> },
  { id: 8, name: "OTHER ISSUE", icon: <FaQuestion className="text-3xl text-blue-400 group-hover:text-blue-300 transition-colors duration-300" /> }
];

const Diagnose = () => {
  const { user, token } = useAuth();
  const { theme } = useTheme();
  const [step, setStep] = useState(1);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [problemDetails, setProblemDetails] = useState("");
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [carDetails, setCarDetails] = useState({
    make: "",
    model: "",
    year: ""
  });
  const [useAI, setUseAI] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        error => {
          console.error("Error getting location:", error);
          setError("Location access needed for accurate diagnosis and service recommendations.");
        }
      );
    }
  }, []);

  const handleDiagnose = async (useAI = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const endpoint = useAI ? 'ai-diagnose' : 'diagnose';
      const response = await axios.post(`${API_URL}/${endpoint}`, {
        symptom: selectedIssue.name,
        details: problemDetails,
        carDetails,
        location: userLocation
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        setDiagnosis(response.data.data);
        setStep(3);
      } else {
        setError(response.data.message || "Diagnosis failed. Please try again.");
      }
    } catch (err) {
      console.error("Diagnosis error:", err);
      if (err.response?.status === 404) {
        setError("Service temporarily unavailable. Please try again later.");
      } else {
        setError(err.response?.data?.message || "Server error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleServiceRequest = async (serviceType) => {
    if (!user) {
      setError("Please login to request services");
      return;
    }

    try {
      const endpoint = serviceType === 'mechanic' ? 'mechanics/request' : 'towing/request';
      const response = await axios.post(`${API_URL}/${endpoint}`, {
        userId: user._id,
        diagnosisId: diagnosis._id,
        location: userLocation,
        carDetails
      });

      if (response.data.success) {
        alert(`Service requested! ${response.data.message}`);
      } else {
        setError(response.data.message || "Service request failed");
      }
    } catch (err) {
      console.error("Service request error:", err);
      setError("Failed to request service. Please try again.");
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-text';
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-5xl font-bold mb-12 text-center">
        <span className="text-white">Car</span>
        <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent"> Diagnosis</span>
      </h1>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-xl mb-8 backdrop-blur-md">
          {error}
        </div>
      )}

      {step === 1 && (
        <div className="bg-gray-800/90 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-gray-700/50">
          <h2 className="text-3xl font-bold mb-8 text-blue-100 text-center">
            Select Your Issue
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {commonIssues.map(issue => (
              <button
                key={issue.id}
                onClick={() => {
                  setSelectedIssue(issue);
                  setStep(2);
                }}
                className="group flex flex-col items-center gap-4 p-6 rounded-xl bg-gray-900/90 hover:bg-gray-800 border border-gray-700/50 hover:border-blue-400/30 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="p-4 rounded-full bg-gray-800/90 group-hover:bg-gray-900 transition-colors duration-300">
                  {issue.icon}
                </div>
                <span className="text-lg font-semibold text-blue-100 group-hover:text-blue-300 text-center transition-colors duration-300">
                  {issue.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-gray-800/90 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-gray-700/50">
          <h2 className="text-3xl font-bold mb-8 text-blue-100 text-center">
            Describe Your Problem
          </h2>
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <input
                type="text"
                placeholder="Car Make"
                value={carDetails.make}
                onChange={(e) => setCarDetails({ ...carDetails, make: e.target.value })}
                className="p-4 rounded-xl bg-gray-900/90 border border-gray-700/50 focus:border-blue-400/30 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all duration-300 text-blue-100 placeholder-gray-400"
              />
              <input
                type="text"
                placeholder="Car Model"
                value={carDetails.model}
                onChange={(e) => setCarDetails({ ...carDetails, model: e.target.value })}
                className="p-4 rounded-xl bg-gray-900/90 border border-gray-700/50 focus:border-blue-400/30 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all duration-300 text-blue-100 placeholder-gray-400"
              />
              <input
                type="text"
                placeholder="Year"
                value={carDetails.year}
                onChange={(e) => setCarDetails({ ...carDetails, year: e.target.value })}
                className="p-4 rounded-xl bg-gray-900/90 border border-gray-700/50 focus:border-blue-400/30 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all duration-300 text-blue-100 placeholder-gray-400"
              />
            </div>
            <textarea
              placeholder="Describe your car problem in detail..."
              value={problemDetails}
              onChange={(e) => setProblemDetails(e.target.value)}
              className="w-full p-4 rounded-xl bg-gray-900/90 border border-gray-700/50 focus:border-blue-400/30 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all duration-300 min-h-[200px] text-blue-100 placeholder-gray-400"
            />
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleDiagnose(false)}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 disabled:opacity-50 transform hover:-translate-y-1"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    <span>Diagnosing...</span>
                  </div>
                ) : (
                  "Standard Diagnosis"
                )}
              </button>
              <button
                onClick={() => handleDiagnose(true)}
                disabled={loading}
                className="flex-1 bg-gray-900/90 hover:bg-gray-800 text-blue-100 font-bold py-4 px-8 rounded-xl border border-gray-700/50 hover:border-blue-400/30 transition-all duration-300 disabled:opacity-50 transform hover:-translate-y-1"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-400"></div>
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  "AI-Powered Diagnosis"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && diagnosis && (
        <div className="bg-gray-800/90 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-gray-700/50">
          <h2 className="text-3xl font-bold mb-8 text-blue-100 text-center">
            Diagnosis Results
          </h2>
          <div className="space-y-6">
            <div className="bg-gray-900/90 p-6 rounded-xl border border-gray-700/50">
              <h3 className="text-xl font-semibold mb-4 text-blue-100">Problem</h3>
              <p className="text-blue-200">{diagnosis.problem}</p>
            </div>
            <div className="bg-gray-900/90 p-6 rounded-xl border border-gray-700/50">
              <h3 className="text-xl font-semibold mb-4 text-blue-100">Possible Causes</h3>
              <ul className="list-none space-y-3">
                {diagnosis.causes.map((cause, index) => (
                  <li key={index} className="flex items-start gap-3 text-blue-200">
                    <div className="mt-1 text-blue-400">•</div>
                    {cause}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-900/90 p-6 rounded-xl border border-gray-700/50">
              <h3 className="text-xl font-semibold mb-4 text-blue-100">Recommended Solutions</h3>
              <ul className="list-none space-y-3">
                {diagnosis.recommendedActions?.map((action, index) => (
                  <li key={index} className="flex items-start gap-3 text-blue-200">
                    <div className="mt-1 text-blue-400">•</div>
                    {action}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => handleServiceRequest('mechanic')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-center gap-2">
                  <FaTools className="text-xl" />
                  <span>Call Mechanic</span>
                </div>
              </button>
              <button
                onClick={() => handleServiceRequest('towing')}
                className="flex-1 bg-[#1a2332] hover:bg-[#1e293b] text-blue-100 font-bold py-4 px-8 rounded-xl border border-gray-700/50 hover:border-blue-400/30 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-center gap-2">
                  <FaTruck className="text-xl" />
                  <span>Request Tow</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Diagnose;
