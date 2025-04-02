import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Mechanics = () => {
    const mapRef = useRef(null);
    const mapContainer = useRef(null);

    useEffect(() => {
        if (!mapRef.current && mapContainer.current) {
            mapRef.current = L.map(mapContainer.current).setView([51.505, -0.09], 13);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(mapRef.current);
        } else if (mapRef.current) {
            mapRef.current.invalidateSize(); // Ensure correct rendering
        }
    }, []);

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
};

export default Mechanics;
