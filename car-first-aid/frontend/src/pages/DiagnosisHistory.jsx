import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { FaCarCrash, FaTools, FaTruck, FaCheckCircle, FaExclamationTriangle, FaBolt, FaThermometerHalf, FaCog, FaQuestion } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const DiagnosisHistory = () => {
  const { user, token } = useAuth();
  const { theme } = useTheme();
  const [diagnosisHistory, setDiagnosisHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiagnosisHistory = async () => {
      if (!user) {
        setError("Please login to view diagnosis history");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/diagnose/history`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setDiagnosisHistory(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch diagnosis history");
        }
      } catch (err) {
        console.error("Error fetching diagnosis history:", err);
        setError("Failed to fetch diagnosis history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnosisHistory();
  }, [user, token]);

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
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

  if (!user) {
    return (
      <div className={`container mx-auto px-6 py-12 ${theme === 'dark' ? '' : 'bg-[#f7f7fa]'}`}>
        <div className={`backdrop-blur-xl p-8 rounded-2xl shadow-xl border ${theme === 'dark' ? 'bg-gray-800/90 border-gray-700/50' : 'bg-white border-[#ececec]'}`}>
          <h2 className={`text-3xl font-bold mb-8 text-center ${theme === 'dark' ? 'text-blue-100' : 'text-[#23272f]'}`}>
            Please login to view your diagnosis history
          </h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`container mx-auto px-6 py-12 ${theme === 'dark' ? '' : 'bg-[#f7f7fa]'}`}>
        <div className={`backdrop-blur-xl p-8 rounded-2xl shadow-xl border ${theme === 'dark' ? 'bg-gray-800/90 border-gray-700/50' : 'bg-white border-[#ececec]'}`}>
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`container mx-auto px-6 py-12 ${theme === 'dark' ? '' : 'bg-[#f7f7fa]'}`}>
      <h1 className={`text-5xl font-bold mb-12 text-center ${theme === 'dark' ? 'text-blue-100' : 'text-[#23272f]'}`}> 
        <span className={theme === 'dark' ? 'text-white' : 'text-[#23272f]'}>Diagnosis</span>
        <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent"> History</span>
      </h1>

      {error && (
        <div className="bg-[#ffeaea] border border-[#e57373] text-[#b71c1c] p-4 rounded-xl mb-8 backdrop-blur-md">
          {error}
        </div>
      )}

      {diagnosisHistory.length === 0 ? (
        <div className={`backdrop-blur-xl p-8 rounded-2xl shadow-xl border ${theme === 'dark' ? 'bg-gray-800/90 border-gray-700/50' : 'bg-white border-[#ececec]'}`}>
          <h2 className={`text-3xl font-bold mb-8 text-center ${theme === 'dark' ? 'text-blue-100' : 'text-[#23272f]'}`}>
            No diagnosis history found
          </h2>
        </div>
      ) : (
        <div className="space-y-6">
          {diagnosisHistory.map((diagnosis) => (
            <div key={diagnosis._id} className={`backdrop-blur-xl p-8 rounded-2xl shadow-xl border ${theme === 'dark' ? 'bg-gray-800/90 border-gray-700/50' : 'bg-white border-[#ececec]'}`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-100' : 'text-[#23272f]'}`}>
                  {diagnosis.symptom}
                </h3>
                <div className="flex items-center gap-4">
                  <span className={`text-lg font-semibold ${getSeverityColor(diagnosis.severity)}`}>
                    {diagnosis.severity.toUpperCase()}
                  </span>
                  {diagnosis.carDetails && (
                    <span className={`text-sm ${theme === 'dark' ? 'text-blue-300' : 'text-gray-500'}`}>
                      {diagnosis.carDetails.make} {diagnosis.carDetails.model} ({diagnosis.carDetails.year})
                    </span>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-blue-100' : 'text-[#23272f]'}`}>Problem Description</h4>
                  <p className={`${theme === 'dark' ? 'text-blue-200' : 'text-gray-700'}`}>{diagnosis.details}</p>
                </div>

                <div>
                  <h4 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-blue-100' : 'text-[#23272f]'}`}>Possible Causes</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    {diagnosis.causes.map((cause, idx) => (
                      <li key={idx} className={`${theme === 'dark' ? 'text-blue-200' : 'text-gray-700'}`}>
                        {cause}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-blue-100' : 'text-[#23272f]'}`}>Recommended Solutions</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    {diagnosis.solutions.map((solution, idx) => (
                      <li key={idx} className={`${theme === 'dark' ? 'text-blue-200' : 'text-gray-700'}`}>
                        {solution}
                      </li>
                    ))}
                  </ul>
                </div>

                {diagnosis.estimatedCost && (
                  <div>
                    <h4 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-blue-100' : 'text-[#23272f]'}`}>Estimated Cost</h4>
                    <p className={`${theme === 'dark' ? 'text-blue-200' : 'text-gray-700'}`}>{diagnosis.estimatedCost}</p>
                  </div>
                )}

                {diagnosis.safetyImplications && (
                  <div>
                    <h4 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-blue-100' : 'text-[#23272f]'}`}>Safety Implications</h4>
                    <p className={`${theme === 'dark' ? 'text-blue-200' : 'text-gray-700'}`}>{diagnosis.safetyImplications}</p>
                  </div>
                )}

                <div className="pt-4 flex justify-between items-center">
                  <p className={`text-sm ${theme === 'dark' ? 'text-blue-300' : 'text-gray-500'}`}>
                    Diagnosed on: {new Date(diagnosis.createdAt).toLocaleString()}
                  </p>
                  <button
                    onClick={() => window.location.href = `/diagnose?id=${diagnosis._id}`}
                    className={`px-4 py-2 rounded-xl ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                  >
                    Re-Diagnose
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiagnosisHistory; 