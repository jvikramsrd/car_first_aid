import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaCarCrash, FaTools, FaHistory, FaUser } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Account = () => {
  const { user, token } = useAuth();
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
        setPastDiagnoses(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching diagnoses:', err);
        setError('Failed to load diagnosis history');
        setLoading(false);
      }
    };

    fetchPastDiagnoses();
  }, [user, token]);

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
        return 'text-red-500';
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
    <div className="container mx-auto px-6 py-12">
      {/* User Profile Section */}
      <div className="bg-gray-800/90 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-gray-700/50 mb-8">
        <div className="flex items-center gap-6">
          <div className="p-4 rounded-full bg-blue-500/10">
            <FaUser className="text-4xl text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-blue-100">{user.name}</h1>
            <p className="text-blue-300">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Past Diagnoses Section */}
      <div className="bg-gray-800/90 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-gray-700/50">
        <div className="flex items-center gap-4 mb-8">
          <FaHistory className="text-2xl text-blue-400" />
          <h2 className="text-2xl font-bold text-blue-100">Diagnosis History</h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
          </div>
        ) : error ? (
          <div className="text-red-400 text-center py-8">{error}</div>
        ) : pastDiagnoses.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            No diagnosis history found. Try diagnosing a car issue!
          </div>
        ) : (
          <div className="space-y-6">
            {pastDiagnoses.map((diagnosis) => (
              <div
                key={diagnosis._id}
                className="bg-gray-900/90 p-6 rounded-xl border border-gray-700/50 hover:border-blue-400/30 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-blue-100 mb-2">
                      {diagnosis.symptom}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {formatDate(diagnosis.timestamp)}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(diagnosis.severity)}`}>
                    {diagnosis.severity?.toUpperCase() || 'UNKNOWN'} Severity
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-blue-300 font-medium mb-2">Car Details</h4>
                    <p className="text-gray-300">
                      {diagnosis.carDetails?.year} {diagnosis.carDetails?.make} {diagnosis.carDetails?.model}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-blue-300 font-medium mb-2">Details</h4>
                    <p className="text-gray-300">{diagnosis.details}</p>
                  </div>
                </div>

                {diagnosis.possibleCauses && diagnosis.possibleCauses.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-blue-300 font-medium mb-2">Possible Causes</h4>
                    <ul className="list-disc list-inside text-gray-300">
                      {diagnosis.possibleCauses.map((cause, index) => (
                        <li key={index}>{cause}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {diagnosis.recommendedAction && (
                  <div className="mt-4">
                    <h4 className="text-blue-300 font-medium mb-2">Recommended Actions</h4>
                    <p className="text-gray-300">{diagnosis.recommendedAction}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Account; 