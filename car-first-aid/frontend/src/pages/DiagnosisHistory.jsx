import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaCarCrash, FaTools, FaCalendar, FaCar } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const DiagnosisHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${API_URL}/diagnoses/history/${user._id}`);
        if (response.data.success) {
          setHistory(response.data.data);
        } else {
          setError("Failed to fetch diagnosis history");
        }
      } catch (err) {
        console.error("History fetch error:", err);
        setError("Error loading diagnosis history");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchHistory();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">
        <span className="text-white">Diagnosis</span>
        <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent"> History</span>
      </h1>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-xl mb-8">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {history.map((diagnosis) => (
          <div
            key={diagnosis._id}
            className="bg-gray-800/90 backdrop-blur-xl p-6 rounded-xl shadow-lg border border-gray-700/50 hover:border-blue-400/30 transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-blue-500/10">
                    <FaCarCrash className="text-2xl text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{diagnosis.symptom}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <FaCalendar />
                        {new Date(diagnosis.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCar />
                        {diagnosis.carDetails.make} {diagnosis.carDetails.model} ({diagnosis.carDetails.year})
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-700/50">
                    <h4 className="text-lg font-semibold text-blue-100 mb-2">Problem Description</h4>
                    <p className="text-gray-300">{diagnosis.details}</p>
                  </div>
                  
                  <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-700/50">
                    <h4 className="text-lg font-semibold text-blue-100 mb-2">Diagnosis</h4>
                    <p className="text-gray-300">{diagnosis.problem}</p>
                    <div className="mt-4">
                      <h5 className="font-medium text-blue-100 mb-2">Solutions:</h5>
                      <ul className="list-none space-y-2">
                        {diagnosis.solutions.map((solution, index) => (
                          <li key={index} className="flex items-start gap-3 text-gray-300">
                            <div className="mt-1 text-blue-400">•</div>
                            {solution}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-row md:flex-col gap-4 md:w-48">
                <button
                  onClick={() => window.location.href = `/diagnose?id=${diagnosis._id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-300"
                >
                  <FaTools />
                  Re-Diagnose
                </button>
              </div>
            </div>
          </div>
        ))}

        {history.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">No diagnosis history found</div>
            <button
              onClick={() => window.location.href = '/diagnose'}
              className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-300"
            >
              Start New Diagnosis
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosisHistory; 