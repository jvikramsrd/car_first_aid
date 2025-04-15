import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Marketplace = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [parts, setParts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [cart, setCart] = useState(() => {
    // Initialize cart from localStorage if available
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const { user } = useAuth();

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const fetchParts = async () => {
      try {
        const response = await axios.get(`${API_URL}/parts`);
        setParts(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch parts');
        setLoading(false);
      }
    };

    fetchParts();
  }, []);

  const addToCart = (part) => {
    if (!user) {
      setError('Please login to add items to cart');
      return;
    }
    
    setCart(prevCart => {
      // Check if item already exists in cart
      const existingItem = prevCart.find(item => item.id === part.id);
      if (existingItem) {
        // Update quantity if exists
        return prevCart.map(item =>
          item.id === part.id 
            ? {...item, quantity: (item.quantity || 1) + 1}
            : item
        );
      }
      // Add new item with quantity 1
      return [...prevCart, {...part, quantity: 1}];
    });
  };

  const removeFromCart = (partId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== partId));
  };

  const updateQuantity = (partId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === partId 
          ? {...item, quantity: newQuantity}
          : item
      )
    );
  };

  const filteredParts = parts.filter(part => {
    const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         part.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || part.category === filter;
    return matchesSearch && matchesFilter;
  });

  const categories = ['all', 'brakes', 'engine', 'ignition', 'electrical', 'suspension'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-xl">
          {error}
          {!user && (
            <Link 
              to="/login" 
              className="ml-2 text-blue-400 hover:text-blue-300"
            >
              Login here
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center text-white">
          Car Parts Marketplace
        </h1>

        {/* Search and Filters */}
        <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-700 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search parts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 p-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-400/30 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all duration-300 text-white placeholder-gray-400"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-400/30 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all duration-300 text-white"
            >
              <option value="">All Categories</option>
              <option value="engine">Engine Parts</option>
              <option value="brakes">Brakes</option>
              <option value="electrical">Electrical</option>
              <option value="body">Body Parts</option>
            </select>
          </div>
        </div>

        {/* Parts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParts.map((part) => (
            <div 
              key={part.id} 
              className="bg-gray-800/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-700 hover:border-blue-400/30 transition-all duration-300"
            >
              <img 
                src={`${API_URL}/uploads/${part.image}`} 
                alt={part.name} 
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2 text-white">{part.name}</h3>
              <p className="text-gray-200 mb-4">{part.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-blue-400 font-bold">${part.price.toFixed(2)}</span>
                <button 
                  onClick={() => addToCart(part)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                >
                  {cart.some(item => item.id === part.id) ? 'Added ✓' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Modal */}
        {cart.length > 0 && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-white">Shopping Cart</h2>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <h3 className="text-white">{item.name}</h3>
                      <p className="text-blue-400">${item.price.toFixed(2)}</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-white font-bold">Total:</span>
                <span className="text-blue-400 font-bold">${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    setCart([]);
                  }}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold py-2 px-4 rounded-lg border border-gray-700 hover:border-blue-400/30 transition-all duration-300"
                >
                  Continue Shopping
                </button>
                <button 
                  onClick={() => {
                    // Implement checkout logic here
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
