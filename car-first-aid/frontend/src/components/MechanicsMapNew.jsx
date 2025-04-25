import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MechanicsMap = ({ mechanics = [], onSelectMechanic }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  // Initialize map
  useEffect(() => {
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([0, 0], 2);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance.current);

      // Try to locate user
      mapInstance.current.locate({ 
        setView: true, 
        maxZoom: 13,
        enableHighAccuracy: true
      });
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Add/update mechanic markers
  useEffect(() => {
    if (!mapInstance.current || !mechanics.length) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstance.current.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers
    mechanics.forEach(mechanic => {
      if (mechanic.location?.coordinates) {
        const marker = L.marker([
          mechanic.location.coordinates[1],
          mechanic.location.coordinates[0]
        ]).addTo(mapInstance.current);
        
        marker.bindPopup(`
          <b>${mechanic.name}</b><br>
          ${mechanic.specialties.join(', ')}<br>
          Rating: ${mechanic.rating}/5
        `);
        
        marker.on('click', () => {
          onSelectMechanic && onSelectMechanic(mechanic);
        });

        markersRef.current.push(marker);
      }
    });

    // Auto-fit map to markers if we have them
    if (markersRef.current.length > 0) {
      const group = new L.featureGroup(markersRef.current);
      mapInstance.current.fitBounds(group.getBounds().pad(0.2));
    }
  }, [mechanics, onSelectMechanic]);

  // Handle location events
  useEffect(() => {
    if (!mapInstance.current) return;

    const map = mapInstance.current;

    const onLocationFound = (e) => {
      L.marker(e.latlng)
        .addTo(map)
        .bindPopup("Your location")
        .openPopup();
    };

    const onLocationError = (e) => {
      console.log("Location error:", e.message);
    };

    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);

    return () => {
      map.off('locationfound', onLocationFound);
      map.off('locationerror', onLocationError);
    };
  }, []);

  return (
    <div 
      ref={mapRef}
      className="w-full h-96 rounded-lg shadow-md border border-gray-200"
    />
  );
};

export default MechanicsMap;
