import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { FaCarCrash, FaTools, FaHistory, FaUser, FaCar, FaCalendarAlt, FaExclamationTriangle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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

const Account = () => {
  const { user, token } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [pastDiagnoses, setPastDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchPastDiagnoses = async () => {
      try {
        const response = await axios.get(`${API_URL}/diagnose/history`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setPastDiagnoses(response.data.data);
        } else {
          setError(response.data.message || 'Failed to load diagnosis history');
        }
      } catch (err) {
        console.error('Error fetching diagnoses:', err);
        setError('Failed to load diagnosis history');
      } finally {
        setLoading(false);
      }
    };

    fetchPastDiagnoses();
  }, [user, token, navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return 'text-[#e57373]';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-blue-500';
    }
  };

  if (!user) {
    return null;
  }

  return (
    <motion.div 
      className={`container mx-auto px-6 py-12 ${theme === 'dark' ? '' : 'bg-[#f7f7fa]'}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* User Profile Section */}
      <motion.div 
        variants={itemVariants}
        className={`backdrop-blur-xl p-8 rounded-2xl shadow-xl border mb-8 ${theme === 'dark' ? 'bg-gray-800/90 border-gray-700/50' : 'bg-white border-[#ececec]'}`}
      >
        <div className="flex items-center gap-6">
          <motion.div 
            className="p-4 rounded-full bg-blue-500/10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaUser className="text-4xl text-blue-400" />
          </motion.div>
          <div>
            <motion.h1 
              className={`text-3xl font-bold ${theme === 'dark' ? 'text-blue-100' : 'text-[#23272f]'}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {user.name}
            </motion.h1>
            <motion.p 
              className={theme === 'dark' ? 'text-blue-300' : 'text-[#6b7280]'}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {user.email}
            </motion.p>
            <motion.p 
              className={`text-sm mt-2 ${theme === 'dark' ? 'text-blue-300' : 'text-[#6b7280]'}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        variants={itemVariants}
        className={`backdrop-blur-xl p-8 rounded-2xl shadow-xl border mb-8 ${theme === 'dark' ? 'bg-gray-800/90 border-gray-700/50' : 'bg-white border-[#ececec]'}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            className="flex items-center gap-4 p-4 rounded-xl bg-blue-500/10"
            variants={cardVariants}
            whileHover="hover"
          >
            <FaCar className="text-2xl text-blue-400" />
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-blue-300' : 'text-[#6b7280]'}`}>Total Diagnoses</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-100' : 'text-[#23272f]'}`}>{pastDiagnoses.length}</p>
            </div>
          </motion.div>
          <motion.div 
            className="flex items-center gap-4 p-4 rounded-xl bg-yellow-500/10"
            variants={cardVariants}
            whileHover="hover"
          >
            <FaExclamationTriangle className="text-2xl text-yellow-400" />
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-yellow-300' : 'text-[#6b7280]'}`}>High Severity Issues</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-yellow-100' : 'text-[#23272f]'}`}>
                {pastDiagnoses.filter(d => d.severity?.toLowerCase() === 'high').length}
              </p>
            </div>
          </motion.div>
          <motion.div 
            className="flex items-center gap-4 p-4 rounded-xl bg-green-500/10"
            variants={cardVariants}
            whileHover="hover"
          >
            <FaCalendarAlt className="text-2xl text-green-400" />
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-green-300' : 'text-[#6b7280]'}`}>Last Diagnosis</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-green-100' : 'text-[#23272f]'}`}>
                {pastDiagnoses.length > 0 ? formatDate(pastDiagnoses[0].createdAt) : 'Never'}
              </p>
            </div>
          </motion.div>
      </div>
      </motion.div>

      {/* Past Diagnoses Section */}
      <motion.div 
        variants={itemVariants}
        className={`backdrop-blur-xl p-8 rounded-2xl shadow-xl border ${theme === 'dark' ? 'bg-gray-800/90 border-gray-700/50' : 'bg-white border-[#ececec]'}`}
      >
        <div className="flex items-center gap-4 mb-8">
          <FaHistory className="text-2xl text-blue-400" />
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-100' : 'text-[#23272f]'}`}>Diagnosis History</h2>
        </div>

        {loading ? (
          <motion.div 
            className="flex justify-center items-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div 
              className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        ) : error ? (
          <motion.div 
            className="text-[#b71c1c] text-center py-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        ) : pastDiagnoses.length === 0 ? (
          <motion.div 
            className="text-gray-400 text-center py-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            No diagnosis history found. Try diagnosing a car issue!
          </motion.div>
        ) : (
          <AnimatePresence>
          <div className="space-y-6">
              {pastDiagnoses.map((diagnosis, index) => (
                <motion.div
                key={diagnosis._id}
                  className={`p-6 rounded-xl border transition-all duration-300 ${
                    theme === 'dark' 
                      ? 'bg-gray-800/90 border-gray-700/50 hover:border-blue-400/30' 
                      : 'bg-white border-[#ececec] hover:border-blue-500/30'
                  }`}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  transition={{ delay: index * 0.1 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                      <motion.h3 
                        className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-blue-100' : 'text-[#23272f]'}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                      {diagnosis.symptom}
                      </motion.h3>
                      <motion.p 
                        className={`text-sm ${theme === 'dark' ? 'text-blue-300' : 'text-gray-500'}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        {formatDate(diagnosis.createdAt)}
                      </motion.p>
                      {diagnosis.carDetails && (
                        <motion.p 
                          className={`text-sm mt-1 ${theme === 'dark' ? 'text-blue-300' : 'text-gray-500'}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          {diagnosis.carDetails.make} {diagnosis.carDetails.model} ({diagnosis.carDetails.year})
                        </motion.p>
                      )}
                  </div>
                    <motion.span 
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(diagnosis.severity)}`}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                    {diagnosis.severity?.toUpperCase() || 'UNKNOWN'} Severity
                    </motion.span>
                  </div>

                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                  <div>
                      <h4 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-blue-100' : 'text-[#23272f]'}`}>Problem Description</h4>
                      <p className={`${theme === 'dark' ? 'text-blue-200' : 'text-gray-700'}`}>{diagnosis.details}</p>
                </div>

                    {diagnosis.causes && diagnosis.causes.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <h4 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-blue-100' : 'text-[#23272f]'}`}>Possible Causes</h4>
                        <ul className="list-disc pl-6 space-y-2">
                          {diagnosis.causes.map((cause, idx) => (
                            <motion.li 
                              key={idx} 
                              className={`${theme === 'dark' ? 'text-blue-200' : 'text-gray-700'}`}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.8 + idx * 0.1 }}
                            >
                              {cause}
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )}

                    {diagnosis.solutions && diagnosis.solutions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                      >
                        <h4 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-blue-100' : 'text-[#23272f]'}`}>Recommended Solutions</h4>
                        <ul className="list-disc pl-6 space-y-2">
                          {diagnosis.solutions.map((solution, idx) => (
                            <motion.li 
                              key={idx} 
                              className={`${theme === 'dark' ? 'text-blue-200' : 'text-gray-700'}`}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 1.0 + idx * 0.1 }}
                            >
                              {solution}
                            </motion.li>
                      ))}
                    </ul>
                      </motion.div>
                )}

                    {diagnosis.estimatedCost && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1 }}
                      >
                        <h4 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-blue-100' : 'text-[#23272f]'}`}>Estimated Cost</h4>
                        <p className={`${theme === 'dark' ? 'text-blue-200' : 'text-gray-700'}`}>{diagnosis.estimatedCost}</p>
                      </motion.div>
                    )}

                    {diagnosis.safetyImplications && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                      >
                        <h4 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-blue-100' : 'text-[#23272f]'}`}>Safety Implications</h4>
                        <p className={`${theme === 'dark' ? 'text-blue-200' : 'text-gray-700'}`}>{diagnosis.safetyImplications}</p>
                      </motion.div>
                    )}

                    <motion.div 
                      className="pt-4 flex justify-between items-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.3 }}
                    >
                      <motion.button
                        onClick={() => window.location.href = `/diagnose?id=${diagnosis._id}`}
                        className={`px-4 py-2 rounded-xl ${
                          theme === 'dark' 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Re-Diagnose
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </motion.div>
            ))}
          </div>
          </AnimatePresence>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Account; 