import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MechanicsMap = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    const initializeMap = () => {
      try {
        // Initialize the map
        mapInstanceRef.current = L.map(mapRef.current, {
          center: [0, 0],
          zoom: 2,
          zoomControl: true
        });

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(mapInstanceRef.current);

        setIsMapInitialized(true);
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    // Initialize map with a small delay
    const timer = setTimeout(initializeMap, 100);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle geolocation after map is initialized
  useEffect(() => {
    if (!isMapInitialized || !mapInstanceRef.current) return;

    const handleGeolocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const userLocation = [latitude, longitude];
            
            // Set view to user location
            mapInstanceRef.current.setView(userLocation, 13);
            
            // Add marker for user location
            L.marker(userLocation)
              .addTo(mapInstanceRef.current)
              .bindPopup("You are here!")
              .openPopup();
            
            console.log("User location:", userLocation);
          },
          (error) => {
            console.error("Location access denied or unavailable:", error.message);
            // Set a default view if location access is denied
            mapInstanceRef.current.setView([0, 0], 2);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      }
    };

    // Add manual pin-drop option
    const handleMapClick = (e) => {
      if (!mapInstanceRef.current) return;

      // Remove existing marker if any
      if (mapInstanceRef.current.manualMarker) {
        mapInstanceRef.current.removeLayer(mapInstanceRef.current.manualMarker);
      }
      
      // Add new marker
      mapInstanceRef.current.manualMarker = L.marker(e.latlng, { draggable: true })
        .addTo(mapInstanceRef.current)
        .bindPopup("Pinned Location")
        .openPopup();
      
      console.log("Manual pin location:", e.latlng);
    };

    // Add click handler
    mapInstanceRef.current.on('click', handleMapClick);

    // Request location
    handleGeolocation();

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off('click', handleMapClick);
      }
    };
  }, [isMapInitialized]);

  return (
    <div 
      className="container d-flex flex-column align-items-center justify-content-center mt-4"
      style={{
        background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)",
        padding: "2rem",
        borderRadius: "15px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
      }}
    >
      <h2 className="text-center mb-4" style={{ color: "#343a40" }}>🛠️ Find Nearby Mechanics</h2>
      <div 
        ref={mapRef}
        style={{
          width: "90%",
          maxWidth: "800px",
          height: "500px",
          borderRadius: "10px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
          position: "relative",
          border: "2px solid #dee2e6",
          overflow: "hidden"
        }}
      />
    </div>
  );
};

export default MechanicsMap;
