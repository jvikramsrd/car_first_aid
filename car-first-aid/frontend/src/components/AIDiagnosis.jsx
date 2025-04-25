import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AIDiagnosis = () => {
  const [formData, setFormData] = useState({
    symptom: '',
    details: '',
    carDetails: {
      make: '',
      model: '',
      year: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.carDetails) {
      setFormData(prev => ({
        ...prev,
        carDetails: {
          ...prev.carDetails,
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/ai-diagnose`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setDiagnosis(response.data.data);
        toast.success('AI diagnosis completed successfully!');
      } else {
        toast.error(response.data.message || 'Failed to get AI diagnosis');
      }
    } catch (error) {
      console.error('AI diagnosis error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to get AI diagnosis. Please try again later.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">AI Vehicle Diagnosis</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Car Make</label>
            <input
              type="text"
              name="make"
              value={formData.carDetails.make}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Model</label>
            <input
              type="text"
              name="model"
              value={formData.carDetails.model}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Year</label>
            <input
              type="text"
              name="year"
              value={formData.carDetails.year}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Symptom</label>
          <input
            type="text"
            name="symptom"
            value={formData.symptom}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="e.g., Engine making strange noise"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Details</label>
          <textarea
            name="details"
            value={formData.details}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="4"
            placeholder="Describe the issue in detail..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? 'Analyzing...' : 'Get AI Diagnosis'}
        </button>
      </form>

      {diagnosis && (
        <div className="mt-8 p-6 bg-gray-50 rounded">
          <h3 className="text-xl font-semibold mb-4">AI Diagnosis Results</h3>
          <div className="whitespace-pre-wrap">{diagnosis.aiResponse}</div>
          <p className="mt-4 text-sm text-gray-500">
            Diagnosis generated on: {new Date(diagnosis.timestamp).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default AIDiagnosis; 