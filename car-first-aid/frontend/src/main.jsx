import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./App.css"; // Import global styles
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import "./index.css"; // Import additional styles 
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
        <App />
        </BrowserRouter>
    </React.StrictMode>
);
