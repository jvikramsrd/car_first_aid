import React, { useState, useEffect } from "react";
import axios from "axios";
import MechanicsMap from "../components/MechanicsMapNew";

const API_URL = "http://localhost:5000/api";

const Mechanics = () => {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [searchRadius, setSearchRadius] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [manualLocation, setManualLocation] = useState({
    address: '',
    latitude: null,
    longitude: null
  });
  const [showManualInput, setShowManualInput] = useState(false);
  const [sortOption, setSortOption] = useState('distance');
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const userLoc = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setUserLocation(userLoc);
          fetchMechanics(userLoc, searchRadius);
        },
        error => {
          console.error("Error getting location:", error);
          setError("Unable to get your location. Please enter your location manually.");
          setShowManualInput(true);
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser. Please enter your location manually.");
      setShowManualInput(true);
      setLoading(false);
    }
  }, []);

  const handleManualLocationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (manualLocation.latitude && manualLocation.longitude) {
        const userLoc = {
          latitude: manualLocation.latitude,
          longitude: manualLocation.longitude
        };
        setUserLocation(userLoc);
        await fetchMechanics(userLoc, searchRadius);
      } else {
        setError("Please enter valid coordinates");
      }
    } catch (err) {
      setError("Error processing location. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMechanics = async (location, radius) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/mechanics/nearby`, {
        params: {
          longitude: location.longitude,
          latitude: location.latitude,
          maxDistance: radius * 1000,
          sortBy: sortOption,
          specialty: filterSpecialty !== 'all' ? filterSpecialty : undefined,
          minRating: minRating > 0 ? minRating : undefined
        }
      });
      
      if (response.data.success) {
        setMechanics(response.data.data);
      } else {
        setError("Unable to find mechanics. Please try again.");
      }
    } catch (err) {
      console.error("Fetch mechanics error:", err);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleRadiusChange = (e) => {
    const newRadius = parseInt(e.target.value);
    setSearchRadius(newRadius);
    if (userLocation) {
      fetchMechanics(userLocation, newRadius);
    }
  };

  const handleRequestService = (mechanicId) => {
    // Implement service request logic
    alert("Service request functionality will be implemented soon");
  };

  const handleViewProfile = (mechanicId) => {
    const mechanic = mechanics.find(m => m.id === mechanicId);
    if (mechanic) {
      setSelectedMechanic(mechanic);
    }
  };

  const filteredMechanics = mechanics.filter(mechanic => {
    const matchesSearch = mechanic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mechanic.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = !specialty || mechanic.specialty === specialty;
    return matchesSearch && matchesSpecialty;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center text-white">
        Find a Mechanic
      </h1>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      {/* Location Input */}
      {showManualInput && (
        <div className="bg-gray-800/90 backdrop-blur-xl p-6 rounded-xl shadow-lg border border-gray-700 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white">Enter Your Location</h2>
          <form onSubmit={handleManualLocationSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Latitude"
                step="any"
                value={manualLocation.latitude || ''}
                onChange={(e) => setManualLocation(prev => ({
                  ...prev,
                  latitude: parseFloat(e.target.value)
                }))}
                className="p-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-400/30 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all duration-300 text-white placeholder-gray-400"
              />
              <input
                type="number"
                placeholder="Longitude"
                step="any"
                value={manualLocation.longitude || ''}
                onChange={(e) => setManualLocation(prev => ({
                  ...prev,
                  longitude: parseFloat(e.target.value)
                }))}
                className="p-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-400/30 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all duration-300 text-white placeholder-gray-400"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Find Mechanics
            </button>
          </form>
        </div>
      )}

      {/* Map View */}
      {userLocation && (
        <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-700 mb-8">
          <div className="h-[400px] rounded-lg overflow-hidden">
            <MechanicsMap
              userLocation={userLocation}
              mechanics={mechanics}
              onMechanicSelect={handleViewProfile}
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-white mb-2">
              Search Radius: {searchRadius} km
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={searchRadius}
              onChange={handleRadiusChange}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-700 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search mechanics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 p-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-400/30 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all duration-300 text-white placeholder-gray-400"
          />
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="p-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-400/30 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all duration-300 text-white"
          >
            <option value="">All Specialties</option>
            <option value="general">General Maintenance</option>
            <option value="engine">Engine Repair</option>
            <option value="electrical">Electrical Systems</option>
            <option value="brakes">Brakes & Suspension</option>
          </select>
        </div>
      </div>

      {/* Mechanics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMechanics.map((mechanic) => (
          <div 
            key={mechanic.id} 
            className="bg-gray-800/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-700 hover:border-blue-400/30 transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <img 
                src={mechanic.avatar} 
                alt={mechanic.name} 
                className="w-16 h-16 rounded-full border-2 border-gray-700"
              />
              <div>
                <h3 className="text-xl font-semibold text-white">{mechanic.name}</h3>
                <p className="text-blue-400">{mechanic.specialty}</p>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-200">Rating:</span>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(mechanic.rating) ? 'fill-current' : 'fill-none stroke-current'}`}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <span className="text-blue-400">({mechanic.rating})</span>
              </div>
              <p className="text-gray-200">{mechanic.experience} years of experience</p>
              <p className="text-gray-200">{mechanic.location}</p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => handleRequestService(mechanic.id)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
              >
                Request Service
              </button>
              <button 
                onClick={() => handleViewProfile(mechanic.id)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold py-2 px-4 rounded-lg border border-gray-700 hover:border-blue-400/30 transition-all duration-300"
              >
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mechanic Profile Modal */}
      {selectedMechanic && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 w-full max-w-2xl">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <img 
                  src={selectedMechanic.avatar} 
                  alt={selectedMechanic.name} 
                  className="w-20 h-20 rounded-full border-2 border-gray-700"
                />
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedMechanic.name}</h2>
                  <p className="text-blue-400">{selectedMechanic.specialty}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedMechanic(null)}
                className="text-gray-200 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-white">About</h3>
                  <p className="text-gray-200">{selectedMechanic.bio}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Services</h3>
                  <ul className="space-y-2 text-gray-200">
                    {selectedMechanic.services?.map((service, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-white">Reviews</h3>
                <div className="space-y-4">
                  {selectedMechanic.reviews?.map((review, index) => (
                    <div key={index} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-white font-semibold">{review.author}</span>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'fill-none stroke-current'}`}
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-200">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <button 
                  onClick={() => handleRequestService(selectedMechanic.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
                >
                  Request Service
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mechanics;
