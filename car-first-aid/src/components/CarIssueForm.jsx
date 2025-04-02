import React, { useState } from "react";
import axios from "axios";

const CarIssueForm = ({ setSolution }) => {
  const [carIssue, setCarIssue] = useState("");
  const [carSound, setCarSound] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("issue", carIssue);
    if (carSound) formData.append("soundFile", carSound);

    try {
      const response = await axios.post("/api/diagnose", formData);
      setSolution(response.data.solution);
    } catch (error) {
      console.error("Error diagnosing the issue:", error);
    }
  };

  return (
    <div className="card">
      <div className="card-header bg-primary text-white">
        <h4>Describe Your Car Issue</h4>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="carIssue">What seems to be the problem?</label>
            <input
              type="text"
              className="form-control"
              id="carIssue"
              value={carIssue}
              onChange={(e) => setCarIssue(e.target.value)}
              placeholder="Enter issue (e.g., Engine noise)"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="carSound">Upload a Sound (optional)</label>
            <input
              type="file"
              className="form-control"
              id="carSound"
              accept=".mp3, .wav"
              onChange={(e) => setCarSound(e.target.files[0])}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CarIssueForm;
