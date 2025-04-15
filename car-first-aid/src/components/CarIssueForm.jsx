import React, { useState } from "react";
import { FaWrench, FaTruck, FaCheckCircle, FaCarCrash } from "react-icons/fa";

const Diagnose = () => {
  const [problem, setProblem] = useState("");
  const [diagnosisSubmitted, setDiagnosisSubmitted] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send the problem to an API and get a diagnosis
    // This is a simplified example
    setDiagnosis(`Your issue "${problem}" might be related to ${getRandomDiagnosis()}`);
    setDiagnosisSubmitted(true);
  };
  
  const getRandomDiagnosis = () => {
    const possibleIssues = [
      "a faulty spark plug that needs replacement",
      "low oil pressure which requires immediate attention",
      "worn brake pads that should be replaced soon",
      "a loose belt that's causing unusual noise",
      "a clogged air filter affecting engine performance"
    ];
    return possibleIssues[Math.floor(Math.random() * possibleIssues.length)];
  };
  
  const handleCallMechanic = () => {
    // In a real app, this would connect to a service to find mechanics
    alert("Connecting you with nearby mechanics...");
  };
  
  const handleCallTowing = () => {
    // In a real app, this would connect to a towing service
    alert("Calling towing service to your location...");
  };
  
  const handleIssueFixed = () => {
    // Reset the form
    setProblem("");
    setDiagnosisSubmitted(false);
    setDiagnosis("");
    alert("Great! We're glad your issue is resolved.");
  };
  
  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-surface/80 backdrop-blur-md rounded-xl shadow-lg border border-primary/20 p-6">
        <div className="flex items-center mb-6">
          <FaCarCrash className="text-primary text-2xl mr-3" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Diagnose Your Car Issue
          </h2>
        </div>
        
        {!diagnosisSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="problemInput" className="block text-sm font-medium text-text-secondary mb-2">
                What seems to be the problem?
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg bg-surface border border-primary/20 text-text focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                id="problemInput"
                placeholder="E.g., Engine noise, strange sound, warning light..."
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full px-4 py-2 rounded-lg bg-success text-white font-medium hover:bg-success/80 transition-colors duration-300"
            >
              Submit
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-lg">
              <h5 className="text-primary font-medium mb-2">Diagnosis:</h5>
              <p className="text-text">{diagnosis}</p>
            </div>
            
            <h5 className="text-text font-medium">What would you like to do next?</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={handleCallMechanic} 
                className="flex items-center justify-center px-4 py-3 rounded-lg bg-primary text-white hover:bg-primary/80 transition-colors duration-300"
              >
                <FaWrench className="mr-2" />
                Call a Mechanic
              </button>
              <button 
                onClick={handleCallTowing} 
                className="flex items-center justify-center px-4 py-3 rounded-lg bg-warning text-white hover:bg-warning/80 transition-colors duration-300"
              >
                <FaTruck className="mr-2" />
                Call Towing
              </button>
              <button 
                onClick={handleIssueFixed} 
                className="flex items-center justify-center px-4 py-3 rounded-lg bg-success text-white hover:bg-success/80 transition-colors duration-300"
              >
                <FaCheckCircle className="mr-2" />
                Issue Fixed
              </button>
            </div>
            
            <div className="text-center">
              <button 
                onClick={() => setDiagnosisSubmitted(false)} 
                className="px-4 py-2 rounded-lg border border-primary/20 text-text-secondary hover:text-primary hover:border-primary transition-colors duration-300"
              >
                Diagnose a different issue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Diagnose; 