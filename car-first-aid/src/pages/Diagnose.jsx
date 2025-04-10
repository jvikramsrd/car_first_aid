import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FaCarCrash, FaTools, FaTruck, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const commonIssues = [
  { id: 1, name: "Engine won't start", icon: <FaCarCrash className="text-xl" /> },
  { id: 2, name: "Strange noises", icon: <FaCarCrash className="text-xl" /> },
  { id: 3, name: "Warning lights", icon: <FaExclamationTriangle className="text-xl" /> },
  { id: 4, name: "Brake problems", icon: <FaCarCrash className="text-xl" /> },
  { id: 5, name: "Battery issues", icon: <FaCarCrash className="text-xl" /> },
  { id: 6, name: "Overheating", icon: <FaCarCrash className="text-xl" /> },
  { id: 7, name: "Transmission issues", icon: <FaCarCrash className="text-xl" /> },
  { id: 8, name: "Other issue", icon: <FaCarCrash className="text-xl" /> }
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
      setError("Error requesting service. Please try again.");
    }
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            {step === 1 ? "Select Your Car Issue" : 
             step === 2 ? "Provide More Details" : 
             "Diagnosis Results"}
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {commonIssues.map(issue => (
                <button
                  key={issue.id}
                  onClick={() => {
                    setSelectedIssue(issue);
                    setStep(2);
                  }}
                  className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  <span className="mb-2 text-blue-600">{issue.icon}</span>
                  <span className="text-sm font-medium text-center">{issue.name}</span>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <FaCarCrash className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Selected Issue: {selectedIssue.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">Please provide more details to help with diagnosis</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Describe the problem in detail
                  </label>
                  <textarea
                    value={problemDetails}
                    onChange={(e) => setProblemDetails(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows="4"
                    placeholder="When did it start? Any unusual sounds or smells? etc."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Car Make
                    </label>
                    <input
                      type="text"
                      value={carDetails.make}
                      onChange={(e) => setCarDetails({...carDetails, make: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Toyota, Ford, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Model
                    </label>
                    <input
                      type="text"
                      value={carDetails.model}
                      onChange={(e) => setCarDetails({...carDetails, model: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Camry, F-150, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year
                    </label>
                    <input
                      type="text"
                      value={carDetails.year}
                      onChange={(e) => setCarDetails({...carDetails, year: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="2020"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
                <div className="flex items-center gap-4">
                  <label className="inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={useAI}
                      onChange={() => setUseAI(!useAI)}
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ml-2 text-sm font-medium text-gray-700">AI Diagnosis</span>
                  </label>
                  <button
                    onClick={() => handleDiagnose(useAI)}
                    disabled={loading || !problemDetails}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? (useAI ? 'AI Analyzing...' : 'Analyzing...') : 'Diagnose Issue'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && diagnosis && (
            <div className="space-y-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h2 className="text-xl font-bold text-gray-800 mb-3">Diagnosis Complete</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Issue Identified</h3>
                    <p className="text-lg font-medium">{diagnosis.symptom}</p>
                  </div>

                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(diagnosis.severity)}`}>
                    Severity: {diagnosis.severity}
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Possible Causes</h3>
                    <ul className="list-disc pl-5 space-y-1 mt-1">
                      {diagnosis.possibleCauses.map((cause, i) => (
                        <li key={i}>{cause}</li>
                      ))}
                    </ul>
                  </div>

                  {diagnosis.isAiGenerated && (
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <h3 className="text-sm font-medium text-blue-700 mb-2">AI Analysis</h3>
                      <div className="space-y-2 text-sm">
                        {diagnosis.aiResponse.split('\n').filter(line => line.trim()).map((line, i) => (
                          <p key={i} className="text-gray-700">{line}</p>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Recommended Action</h3>
                    <p>{diagnosis.recommendedAction}</p>
                  </div>

                  {diagnosis.estimatedCost && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Estimated Repair Cost</h3>
                      <p>${diagnosis.estimatedCost.min} - ${diagnosis.estimatedCost.max}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">Next Steps</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => handleServiceRequest('mechanic')}
                    className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    <div className="bg-blue-100 p-3 rounded-full mb-2">
                      <FaTools className="text-blue-600 text-xl" />
                    </div>
                    <span className="font-medium">Request Mechanic</span>
                    <span className="text-sm text-gray-500 mt-1">Available now</span>
                  </button>

                  <button
                    onClick={() => handleServiceRequest('towing')}
                    className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    <div className="bg-blue-100 p-3 rounded-full mb-2">
                      <FaTruck className="text-blue-600 text-xl" />
                    </div>
                    <span className="font-medium">Request Towing</span>
                    <span className="text-sm text-gray-500 mt-1">24/7 service</span>
                  </button>

                  <button
                    onClick={() => {
                      setStep(1);
                      setSelectedIssue(null);
                      setProblemDetails("");
                      setDiagnosis(null);
                    }}
                    className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    <div className="bg-blue-100 p-3 rounded-full mb-2">
                      <FaCheckCircle className="text-blue-600 text-xl" />
                    </div>
                    <span className="font-medium">Issue Resolved</span>
                    <span className="text-sm text-gray-500 mt-1">Start over</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Diagnose;
