import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css"; // Import global styles
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import "./index.css"; // Import additional styles 

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
