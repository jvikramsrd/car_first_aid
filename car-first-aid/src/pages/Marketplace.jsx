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
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p className="text-gray-600">Loading parts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
          {!user && (
            <Link 
              to="/login" 
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              Login here
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Car Parts Marketplace</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search parts..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredParts.map(part => (
          <div key={part.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
              {part.image ? (
                <img 
                  src={`${API_URL}/uploads/${part.image}`} 
                  alt={part.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500">No Image</span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{part.name}</h3>
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(part.rating) ? 'fill-current' : 'fill-none stroke-current'}`}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-600 text-sm ml-1">({part.rating})</span>
              </div>
              <p className="text-gray-600 text-sm mb-3">{part.description}</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">${part.price.toFixed(2)}</span>
                <button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  onClick={() => addToCart(part)}
                >
                  {cart.some(item => item.id === part.id) ? 'Added ✓' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredParts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No parts found matching your criteria</p>
          <button 
            className="mt-4 text-blue-600 hover:text-blue-800"
            onClick={() => {
              setSearchTerm('');
              setFilter('all');
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
