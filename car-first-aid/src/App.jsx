import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Diagnose from "./pages/Diagnose";
import Mechanics from "./pages/Mechanics";

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/diagnose" element={<Diagnose />} />
                <Route path="/mechanics" element={<Mechanics />} />
            </Routes>
        </Router>
    );
};

export default App;
