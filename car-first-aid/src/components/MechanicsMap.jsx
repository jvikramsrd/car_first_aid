import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Initialize the map
const map = L.map('map').setView([0, 0], 13); // Default center

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Ask user for location access
if (confirm("Do you want to share your location?")) {
    map.locate({ setView: true, maxZoom: 16 });
}

// Event listener for successful location detection
map.on('locationfound', function(e) {
    const userLocation = e.latlng;
    L.marker(userLocation).addTo(map)
      .bindPopup("You are here!").openPopup();
    
    console.log("User location:", userLocation);
});

// Event listener for location errors
map.on('locationerror', function(e) {
    alert("Location access denied or unavailable.");
    console.error(e.message);
});

// Manual pin-drop option
let manualMarker;
map.on('click', function(e) {
    if (manualMarker) {
        map.removeLayer(manualMarker); // Remove previous pin if any
    }
    
    manualMarker = L.marker(e.latlng, { draggable: true }).addTo(map)
        .bindPopup("Pinned Location")
        .openPopup();
    
    console.log("Manual pin location:", e.latlng);
});


    return (
        <div className="container d-flex flex-column align-items-center justify-content-center mt-4">
            <h2 className="text-center">🛠️ Find Nearby Mechanics</h2>
            <div 
                ref={mapContainer} 
                style={{
                    width: "90%",
                    maxWidth: "800px",
                    height: "500px",
                    borderRadius: "10px",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)"
                }}>
            </div>
        </div>
    );

export default Mechanics;
