import React from "react";

const SolutionCard = ({ solution }) => {
  return (
    <div className="card mt-4">
      <div className="card-header bg-success text-white">
        <h4>Suggested Solution</h4>
      </div>
      <div className="card-body">
        <p><strong>Solution:</strong> {solution}</p>
      </div>
    </div>
  );
};

export default SolutionCard;
