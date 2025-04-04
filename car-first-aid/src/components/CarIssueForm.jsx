import React, { useState } from "react";

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
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title mb-4">🔍 Diagnose Your Car Issue</h2>
              
              {!diagnosisSubmitted ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="problemInput" className="form-label">
                      What seems to be the problem?
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="problemInput"
                      placeholder="E.g., Engine noise"
                      value={problem}
                      onChange={(e) => setProblem(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-success">
                    Submit
                  </button>
                </form>
              ) : (
                <div>
                  <div className="alert alert-info mb-4">
                    <h5>Diagnosis:</h5>
                    <p>{diagnosis}</p>
                  </div>
                  
                  <h5>What would you like to do next?</h5>
                  <div className="d-grid gap-3 mt-4">
                    <div className="row">
                      <div className="col-md-4 mb-2">
                        <button 
                          onClick={handleCallMechanic} 
                          className="btn btn-primary w-100"
                        >
                          <i className="bi bi-wrench me-2"></i>
                          Call a Mechanic
                        </button>
                      </div>
                      <div className="col-md-4 mb-2">
                        <button 
                          onClick={handleCallTowing} 
                          className="btn btn-warning w-100"
                        >
                          <i className="bi bi-truck me-2"></i>
                          Call Towing
                        </button>
                      </div>
                      <div className="col-md-4 mb-2">
                        <button 
                          onClick={handleIssueFixed} 
                          className="btn btn-success w-100"
                        >
                          <i className="bi bi-check-circle me-2"></i>
                          Issue Fixed
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center mt-4">
                    <button 
                      onClick={() => setDiagnosisSubmitted(false)} 
                      className="btn btn-outline-secondary"
                    >
                      Diagnose a different issue
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diagnose;