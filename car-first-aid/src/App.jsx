import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Diagnose from "./pages/Diagnose";
import Mechanics from "./pages/Mechanics";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/diagnose" element={<Diagnose />} />
            <Route path="/mechanics" element={<Mechanics />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;