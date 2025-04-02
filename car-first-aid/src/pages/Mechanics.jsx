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
        } else {
            mapRef.current.invalidateSize();
        }
    }, []);

    return (
        <div className="container mt-4">
            <h2>🛠️ Find Nearby Mechanics</h2>
            <div ref={mapContainer} style={{ height: "400px", width: "100%", borderRadius: "10px" }}></div>
        </div>
    );
};

export default Mechanics;
