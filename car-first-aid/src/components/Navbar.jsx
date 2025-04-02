import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-700 text-white p-4 flex justify-between items-center shadow-md">
      {/* Logo */}
      <h1 className="text-2xl font-bold">🚗 Car First Aid</h1>

      {/* Navigation Links */}
      <div className="space-x-6">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/marketplace" className="hover:underline">Marketplace</Link>
        <Link to="/soundrecorder" className="hover:underline">SoundRecorder</Link>
        <button className="bg-white text-blue-700 px-4 py-2 rounded-lg hover:bg-gray-200">
          Login / Register
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
