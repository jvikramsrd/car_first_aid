import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";
import { FaCar, FaTools, FaExclamationTriangle, FaCheckCircle, FaSpinner, FaBolt, FaThermometerHalf, FaCog, FaQuestion, FaTruck } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const commonIssues = [
  { id: 1, name: "ENGINE WON'T START", icon: <FaCar className="text-3xl text-blue-400 group-hover:text-blue-300 transition-colors duration-300" /> },
  { id: 2, name: "STRANGE NOISES", icon: <FaCog className="text-3xl text-blue-400 group-hover:text-blue-300 transition-colors duration-300" /> },
  { id: 3, name: "WARNING LIGHTS", icon: <FaExclamationTriangle className="text-3xl text-blue-400 group-hover:text-blue-300 transition-colors duration-300" /> },
  { id: 4, name: "BRAKE PROBLEMS", icon: <FaTools className="text-3xl text-blue-400 group-hover:text-blue-300 transition-colors duration-300" /> },
  { id: 5, name: "BATTERY ISSUES", icon: <FaBolt className="text-3xl text-blue-400 group-hover:text-blue-300 transition-colors duration-300" /> },
  { id: 6, name: "OVERHEATING", icon: <FaThermometerHalf className="text-3xl text-blue-400 group-hover:text-blue-300 transition-colors duration-300" /> },
  { id: 7, name: "TRANSMISSION ISSUES", icon: <FaCog className="text-3xl text-blue-400 group-hover:text-blue-300 transition-colors duration-300" /> },
  { id: 8, name: "OTHER ISSUE", icon: <FaQuestion className="text-3xl text-blue-400 group-hover:text-blue-300 transition-colors duration-300" /> }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2
    }
  }
};

const Diagnose = () => {
  const location = useLocation();
  const navigate = useNavigate();
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

  const handleDiagnose = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${API_URL}/diagnose`,
        {
          symptom: selectedIssue.name,
          details: problemDetails,
          carDetails
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setDiagnosis(response.data.data);
        
        // Save the diagnosis to history
        try {
          await axios.post(
            `${API_URL}/diagnosis`,
            {
              symptom: selectedIssue.name,
              details: problemDetails,
              severity: response.data.data.severity,
              causes: response.data.data.causes,
              solutions: response.data.data.solutions,
              carDetails,
              aiResponse: response.data.data.aiResponse,
              isAiGenerated: true,
              estimatedCost: response.data.data.estimatedCost,
              safetyImplications: response.data.data.safetyImplications
            },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
        } catch (saveError) {
          console.error('Error saving diagnosis:', saveError);
          // Don't show error to user as this is a background operation
        }
        
        setStep(3);
      } else {
        setError(response.data.message || "Failed to diagnose issue");
      }
    } catch (err) {
      console.error("Error diagnosing issue:", err);
      setError("Failed to diagnose issue. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleServiceRequest = async (serviceType) => {
    if (serviceType === 'mechanic') {
      navigate('/mechanics');
      return;
    }

    if (!user) {
      setError("Please login to request towing services");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/towing/request`, {
        userId: user._id,
        diagnosisId: diagnosis._id,
        location: userLocation,
        carDetails
      });

      if (response.data.success) {
        alert(`Towing service requested! ${response.data.message}`);
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
        return 'text-[#e57373]';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-text';
    }
  };

  return (
    <motion.div 
      className={`container mx-auto px-6 py-12 ${theme === 'dark' ? '' : 'bg-[#f7f7fa]'}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1 
        className={`text-5xl font-bold mb-12 text-center ${theme === 'dark' ? 'text-blue-100' : 'text-[#23272f]'}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className={theme === 'dark' ? 'text-white' : 'text-[#23272f]'}>Car</span>
        <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent"> Diagnosis</span>
      </motion.h1>

      {error && (
        <motion.div 
          className="bg-[#ffeaea] border border-[#e57373] text-[#b71c1c] p-4 rounded-xl mb-8 backdrop-blur-md"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {error}
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            className={`backdrop-blur-xl p-8 rounded-2xl shadow-xl border ${theme === 'dark' ? 'bg-gray-800/90 border-gray-700/50' : 'bg-white border-[#ececec]'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <motion.h2 
              className={`text-3xl font-bold mb-8 text-center ${theme === 'dark' ? 'text-blue-100' : 'text-[#23272f]'}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Select Your Issue
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {commonIssues.map(issue => (
                <motion.button
                  key={issue.id}
                  onClick={() => {
                    setSelectedIssue(issue);
                    setStep(2);
                  }}
                  className={`group flex flex-col items-center gap-4 p-6 rounded-xl border transition-all duration-300 ${theme === 'dark' ? 'bg-gray-900/90 hover:bg-gray-800 border-gray-700/50 hover:border-blue-400/30 text-blue-100 group-hover:text-blue-300' : 'bg-white hover:bg-gray-50 border-[#ececec] text-[#23272f] group-hover:text-blue-600'}`}
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`p-4 rounded-full transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800/90 group-hover:bg-gray-900' : 'bg-[#fafbfc] group-hover:bg-white'}`}>
                    {issue.icon}
                  </div>
                  <span className={`text-lg font-semibold text-center transition-colors duration-300 ${theme === 'dark' ? 'text-blue-100 group-hover:text-blue-300' : 'text-[#23272f] group-hover:text-blue-600'}`}>
                    {issue.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            className={`backdrop-blur-xl p-8 rounded-2xl shadow-xl border ${theme === 'dark' ? 'bg-gray-800/90 border-gray-700/50' : 'bg-white border-[#ececec]'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <motion.h2 
              className={`text-3xl font-bold mb-8 text-center ${theme === 'dark' ? 'text-blue-100' : 'text-[#23272f]'}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Describe Your Problem
            </motion.h2>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.input
                  type="text"
                  placeholder="Car Make"
                  value={carDetails.make}
                  onChange={(e) => setCarDetails({ ...carDetails, make: e.target.value })}
                  className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-900/90 border-gray-700/50 focus:border-blue-400/30 focus:ring-2 focus:ring-blue-400/20 outline-none text-blue-100 placeholder-gray-400' : 'bg-[#fafbfc] border-[#e0e0e0] text-[#23272f] placeholder-[#6b7280]'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                />
                <motion.input
                  type="text"
                  placeholder="Car Model"
                  value={carDetails.model}
                  onChange={(e) => setCarDetails({ ...carDetails, model: e.target.value })}
                  className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-900/90 border-gray-700/50 focus:border-blue-400/30 focus:ring-2 focus:ring-blue-400/20 outline-none text-blue-100 placeholder-gray-400' : 'bg-[#fafbfc] border-[#e0e0e0] text-[#23272f] placeholder-[#6b7280]'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                />
                <motion.input
                  type="text"
                  placeholder="Year"
                  value={carDetails.year}
                  onChange={(e) => setCarDetails({ ...carDetails, year: e.target.value })}
                  className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-900/90 border-gray-700/50 focus:border-blue-400/30 focus:ring-2 focus:ring-blue-400/20 outline-none text-blue-100 placeholder-gray-400' : 'bg-[#fafbfc] border-[#e0e0e0] text-[#23272f] placeholder-[#6b7280]'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                />
              </div>
              <motion.textarea
                placeholder="Describe your car problem in detail..."
                value={problemDetails}
                onChange={(e) => setProblemDetails(e.target.value)}
                className={`w-full p-4 rounded-xl min-h-[200px] ${theme === 'dark' ? 'bg-gray-900/90 border-gray-700/50 text-blue-100 placeholder-gray-400' : 'bg-[#fafbfc] border-[#e0e0e0] text-[#23272f] placeholder-[#6b7280]'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              />
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <motion.button
                  onClick={handleDiagnose}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <motion.div 
                        className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span>Diagnosing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <FaCheckCircle className="text-xl" />
                      <span>Start Diagnosis</span>
                    </div>
                  )}
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {step === 3 && diagnosis && (
          <motion.div
            key="step3"
            className={`backdrop-blur-xl p-8 rounded-2xl shadow-xl border ${theme === 'dark' ? 'bg-gray-800/90 border-gray-700/50' : 'bg-white border-[#ececec]'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <motion.h2 
              className={`text-3xl font-bold mb-8 text-center ${theme === 'dark' ? 'text-blue-100' : 'text-[#23272f]'}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Diagnosis Results
            </motion.h2>
            <div className="space-y-6">
              <motion.div 
                className="bg-gray-900/90 p-6 rounded-xl border border-gray-700/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-blue-100">Issue</h3>
                    <p className="text-blue-200">{selectedIssue.name}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(diagnosis.severity)}`}>
                    {diagnosis.severity?.toUpperCase() || 'UNKNOWN'} Severity
                  </span>
                </div>
              </motion.div>

              <motion.div 
                className="bg-gray-900/90 p-6 rounded-xl border border-gray-700/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-xl font-semibold mb-4 text-blue-100">Problem Description</h3>
                <p className="text-blue-200">{problemDetails}</p>
              </motion.div>

              {diagnosis.causes && diagnosis.causes.length > 0 && (
                <motion.div 
                  className="bg-gray-900/90 p-6 rounded-xl border border-gray-700/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-xl font-semibold mb-4 text-blue-100">Possible Causes</h3>
                  <ul className="list-none space-y-3">
                    {diagnosis.causes.map((cause, index) => (
                      <motion.li 
                        key={index} 
                        className="flex items-start gap-3 text-blue-200"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <div className="mt-1 text-blue-400">•</div>
                        {cause}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {diagnosis.solutions && diagnosis.solutions.length > 0 && (
                <motion.div 
                  className="bg-gray-900/90 p-6 rounded-xl border border-gray-700/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <h3 className="text-xl font-semibold mb-4 text-blue-100">Recommended Solutions</h3>
                  <ul className="list-none space-y-3">
                    {diagnosis.solutions.map((solution, index) => (
                      <motion.li 
                        key={index} 
                        className="flex items-start gap-3 text-blue-200"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                      >
                        <div className="mt-1 text-blue-400">•</div>
                        {solution}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {diagnosis.estimatedCost && (
                <motion.div 
                  className="bg-gray-900/90 p-6 rounded-xl border border-gray-700/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <h3 className="text-xl font-semibold mb-4 text-blue-100">Estimated Cost</h3>
                  <p className="text-blue-200">{diagnosis.estimatedCost}</p>
                </motion.div>
              )}

              {diagnosis.safetyImplications && (
                <motion.div 
                  className="bg-gray-900/90 p-6 rounded-xl border border-gray-700/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <h3 className="text-xl font-semibold mb-4 text-blue-100">Safety Implications</h3>
                  <p className="text-blue-200">{diagnosis.safetyImplications}</p>
                </motion.div>
              )}

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
              >
                <motion.button
                  onClick={() => handleServiceRequest('mechanic')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <FaTools className="text-xl" />
                    <span>Call Mechanic</span>
                  </div>
                </motion.button>
                <motion.button
                  onClick={() => handleServiceRequest('towing')}
                  className="flex-1 bg-[#1a2332] hover:bg-[#1e293b] text-blue-100 font-bold py-4 px-8 rounded-xl border border-gray-700/50 hover:border-blue-400/30 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <FaTruck className="text-xl" />
                    <span>Request Tow</span>
                  </div>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Diagnose;
