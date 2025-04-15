import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FaCarCrash, FaTools, FaTruck, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const commonIssues = [
  { id: 1, name: "Engine won't start", icon: <FaCarCrash className="text-xl text-blue-400" /> },
  { id: 2, name: "Strange noises", icon: <FaCarCrash className="text-xl text-blue-400" /> },
  { id: 3, name: "Warning lights", icon: <FaExclamationTriangle className="text-xl text-blue-400" /> },
  { id: 4, name: "Brake problems", icon: <FaCarCrash className="text-xl text-blue-400" /> },
  { id: 5, name: "Battery issues", icon: <FaCarCrash className="text-xl text-blue-400" /> },
  { id: 6, name: "Overheating", icon: <FaCarCrash className="text-xl text-blue-400" /> },
  { id: 7, name: "Transmission issues", icon: <FaCarCrash className="text-xl text-blue-400" /> },
  { id: 8, name: "Other issue", icon: <FaCarCrash className="text-xl text-blue-400" /> }
];

const Diagnose = () => {
  const { user } = useAuth();
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
      });
      
      if (response.data.success) {
        setDiagnosis(response.data.data);
        setStep(3);
      } else {
        setError(response.data.message || "Diagnosis failed. Please try again.");
      }
    } catch (err) {
      console.error("Diagnosis error:", err);
      setError("Server error. Please try again later.");
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
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center text-white">
          Car Diagnosis
        </h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="bg-gray-800/80 backdrop-blur-md p-8 rounded-xl shadow-lg border border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 text-white">Select Your Issue</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {commonIssues.map(issue => (
                <button
                  key={issue.id}
                  onClick={() => {
                    setSelectedIssue(issue);
                    setStep(2);
                  }}
                  className="flex items-center justify-center gap-3 p-4 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-blue-400/30 transition-all duration-300"
                >
                  {issue.icon}
                  <span className="text-gray-200">{issue.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-gray-800/80 backdrop-blur-md p-8 rounded-xl shadow-lg border border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 text-white">Describe Your Problem</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Car Make"
                  value={carDetails.make}
                  onChange={(e) => setCarDetails({ ...carDetails, make: e.target.value })}
                  className="p-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-400/30 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all duration-300 text-white placeholder-gray-400"
                />
                <input
                  type="text"
                  placeholder="Car Model"
                  value={carDetails.model}
                  onChange={(e) => setCarDetails({ ...carDetails, model: e.target.value })}
                  className="p-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-400/30 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all duration-300 text-white placeholder-gray-400"
                />
                <input
                  type="text"
                  placeholder="Year"
                  value={carDetails.year}
                  onChange={(e) => setCarDetails({ ...carDetails, year: e.target.value })}
                  className="p-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-400/30 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all duration-300 text-white placeholder-gray-400"
                />
              </div>
              <textarea
                placeholder="Describe your car problem in detail..."
                value={problemDetails}
                onChange={(e) => setProblemDetails(e.target.value)}
                className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-400/30 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all duration-300 min-h-[150px] text-white placeholder-gray-400"
              />
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleDiagnose(false)}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors duration-300 disabled:opacity-50"
                >
                  {loading ? "Diagnosing..." : "Diagnose"}
                </button>
                <button
                  onClick={() => handleDiagnose(true)}
                  disabled={loading}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold py-3 px-6 rounded-xl border border-gray-700 hover:border-blue-400/30 transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? "Analyzing..." : "AI Diagnosis"}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && diagnosis && (
          <div className="bg-gray-800/80 backdrop-blur-md p-8 rounded-xl shadow-lg border border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 text-white">Diagnosis Results</h2>
            <div className="space-y-6">
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-white">Problem</h3>
                <p className="text-gray-200">{diagnosis.problem}</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-white">Possible Causes</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-200">
                  {diagnosis.causes.map((cause, index) => (
                    <li key={index}>{cause}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-white">Recommended Solutions</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-200">
                  {diagnosis.solutions.map((solution, index) => (
                    <li key={index}>{solution}</li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleServiceRequest('mechanic')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors duration-300"
                >
                  <FaTools className="inline-block mr-2" />
                  Call Mechanic
                </button>
                <button
                  onClick={() => handleServiceRequest('towing')}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold py-3 px-6 rounded-xl border border-gray-700 hover:border-blue-400/30 transition-all duration-300"
                >
                  <FaTruck className="inline-block mr-2" />
                  Request Tow
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Diagnose;
