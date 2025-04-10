import React, { useState, useEffect } from "react";
import axios from "axios";
import MechanicsMap from "../components/MechanicsMapNew";

const API_URL = "http://localhost:5000/api";

const Mechanics = () => {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [searchRadius, setSearchRadius] = useState(10); // Default 10km
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
    // Get user location
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
      // In a real app, you would use a geocoding service here
      // For demo purposes, we'll just use the coordinates directly
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
          maxDistance: radius * 1000, // Convert to meters
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

  const handleContactMechanic = (mechanic) => {
    // In a real app, this would open a contact form or initiate a call
    alert(`Contacting ${mechanic.name}. In a real app, this would connect you with the mechanic.`);
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">Find Mechanics Near You</h1>
      
      {error && (
        <div className="alert alert-danger mb-3">
          {error}
        </div>
      )}
      
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Search Options</h5>
          <div className="row align-items-center">
            <div className="col-md-4">
              <label htmlFor="radiusRange" className="form-label">Search Radius: {searchRadius} km</label>
              <input 
                type="range" 
                className="form-range" 
                min="1" 
                max="50" 
                step="1" 
                id="radiusRange" 
                value={searchRadius}
                onChange={handleRadiusChange}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="sortSelect" className="form-label">Sort By</label>
              <select 
                id="sortSelect"
                className="form-select"
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value);
                  if (userLocation) fetchMechanics(userLocation, searchRadius);
                }}
              >
                <option value="distance">Distance</option>
                <option value="rating">Rating</option>
                <option value="reviewCount">Most Reviews</option>
              </select>
            </div>
            <div className="col-md-4">
              <label htmlFor="ratingSelect" className="form-label">Minimum Rating</label>
              <select 
                id="ratingSelect"
                className="form-select"
                value={minRating}
                onChange={(e) => {
                  setMinRating(parseInt(e.target.value));
                  if (userLocation) fetchMechanics(userLocation, searchRadius);
                }}
              >
                <option value="0">Any Rating</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>
            <div className="col-md-6">
              {userLocation ? (
                <div className="alert alert-success mb-0">
                  <i className="bi bi-geo-alt-fill me-2"></i>
                  Location access granted. Showing mechanics near you.
                </div>
              ) : showManualInput ? (
                <form onSubmit={handleManualLocationSubmit}>
                  <div className="mb-3">
                    <label htmlFor="address" className="form-label">Address</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="address" 
                      value={manualLocation.address}
                      onChange={(e) => setManualLocation({...manualLocation, address: e.target.value})}
                      placeholder="Enter your address"
                    />
                  </div>
                  <div className="row">
                    <div className="col">
                      <label htmlFor="latitude" className="form-label">Latitude</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        id="latitude" 
                        value={manualLocation.latitude || ''}
                        onChange={(e) => setManualLocation({...manualLocation, latitude: parseFloat(e.target.value)})}
                        placeholder="Latitude"
                        step="any"
                      />
                    </div>
                    <div className="col">
                      <label htmlFor="longitude" className="form-label">Longitude</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        id="longitude" 
                        value={manualLocation.longitude || ''}
                        onChange={(e) => setManualLocation({...manualLocation, longitude: parseFloat(e.target.value)})}
                        placeholder="Longitude"
                        step="any"
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary mt-2">
                    Use This Location
                  </button>
                </form>
              ) : (
                <div className="alert alert-warning mb-0">
                  <i className="bi bi-geo-alt me-2"></i>
                  Waiting for location access...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Finding mechanics near you...</p>
        </div>
      ) : (
        <div className="row">
          <div className="col-12 mb-4">
            <div className="card shadow-sm">
              <div className="card-body p-0">
                <MechanicsMap 
                  mechanics={mechanics}
                  userLocation={userLocation}
                  onSelectMechanic={(mechanic) => {
                    // Scroll to the mechanic card when clicked on map
                    const element = document.getElementById(`mechanic-${mechanic._id}`);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      element.classList.add('highlight');
                      setTimeout(() => element.classList.remove('highlight'), 2000);
                    }
                  }}
                />
              </div>
            </div>
          </div>
          {mechanics.length > 0 ? (
            mechanics.map(mechanic => (
              <div className="col-md-6 col-lg-4 mb-4" key={mechanic._id} id={`mechanic-${mechanic._id}`}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{mechanic.name}</h5>
                    <p className="card-text">
                      <i className="bi bi-geo-alt text-primary me-2"></i>
                      {mechanic.distance ? `${(mechanic.distance / 1000).toFixed(1)} km away` : 'Distance unknown'}
                    </p>
                    <p className="card-text">
                      <i className="bi bi-tools text-primary me-2"></i>
                      {mechanic.specialties.join(', ')}
                    </p>
                    <p className="card-text">
                      <i className="bi bi-star-fill text-warning me-1"></i>
                      <span className="me-2">{mechanic.rating.toFixed(1)}</span>
                      <small className="text-muted">({mechanic.reviewCount} reviews)</small>
                    </p>
                  </div>
                  <div className="card-footer bg-transparent">
                    <button 
                      className="btn btn-primary w-100"
                      onClick={() => handleContactMechanic(mechanic)}
                    >
                      <i className="bi bi-telephone me-2"></i>
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="alert alert-info">
                No mechanics found within {searchRadius} km. Try increasing your search radius.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Mechanics;
