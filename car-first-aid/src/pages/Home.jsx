import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="container text-center mt-5">
            <h1>🚗 Welcome to Car First Aid</h1>
            <p>Find solutions for car issues and locate nearby mechanics easily.</p>
            <Link to="/diagnose" className="btn btn-primary btn-lg mt-3">Start Diagnosis</Link>
        </div>
    );
};

export default Home;
