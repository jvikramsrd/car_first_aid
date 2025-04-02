import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import SoundRecorder from "./pages/SoundRecorder";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
