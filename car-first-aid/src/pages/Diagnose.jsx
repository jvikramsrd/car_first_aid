
import React, { useState } from "react";

const Diagnose = () => {
    const [solution, setSolution] = useState(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        const issue = event.target.elements.carIssue.value;
        setSolution(`Possible solution for: ${issue}`); // Simulated response
    };

    return (
        <div className="container mt-4">
            <h2>🔍 Diagnose Your Car Issue</h2>
            <div className="card p-4 mt-3">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>What seems to be the problem?</label>
                        <input type="text" className="form-control" name="carIssue" placeholder="E.g., Engine noise" required />
                    </div>
                    <button type="submit" className="btn btn-success mt-2">Submit</button>
                </form>
                {solution && <div className="alert alert-info mt-3">{solution}</div>}
            </div>
        </div>
    );
};

export default Diagnose;
