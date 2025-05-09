import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaFilter, FaShoppingCart, FaStar, FaTools, FaSprayCan, FaCog } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTheme } from "../context/ThemeContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const categories = [
  { id: 'cleaning', name: 'Cleaning Supplies', icon: <FaSprayCan /> },
  { id: 'parts', name: 'Car Parts', icon: <FaCog /> },
  { id: 'tools', name: 'Essential Tools', icon: <FaTools /> }
];

const sampleProducts = [
  { id: 1, name: "Car Battery", price: 120, description: "High-performance car battery for reliable starting power." },
  { id: 2, name: "Oil Filter", price: 15, description: "Premium oil filter for optimal engine protection." },
  { id: 3, name: "Brake Pads", price: 45, description: "Durable brake pads for safe and efficient braking." },
  { id: 4, name: "Air Filter", price: 20, description: "Clean air filter for improved engine performance." },
  { id: 5, name: "Spark Plugs", price: 30, description: "High-quality spark plugs for better fuel efficiency." }
];

const Marketplace = () => {
  const { theme } = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/products`, {
        params: {
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          search: searchQuery || undefined,
          minPrice: priceRange.min,
          maxPrice: priceRange.max
        }
      });
      
      if (response.data.success) {
        setProducts(response.data.data);
      } else {
        setError("Failed to fetch products");
      }
    } catch (err) {
      console.error("Products fetch error:", err);
      setError("Error loading products");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-center md:text-left mb-4 md:mb-0">
          <span className="text-white">Car</span>
          <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent"> Marketplace</span>
        </h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 p-3 rounded-xl bg-gray-800/90 border border-gray-700/50 focus:border-blue-400/30 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all duration-300 text-white placeholder-gray-400"
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-3 rounded-xl bg-gray-800/90 border border-gray-700/50 hover:border-blue-400/30 transition-all duration-300"
          >
            <FaFilter className="text-blue-400" />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-xl mb-8">
          {error}
        </div>
      )}

      {/* Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center justify-center gap-3 p-4 rounded-xl border transition-all duration-300 ${
              selectedCategory === category.id
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-gray-800/90 border-gray-700/50 hover:border-blue-400/30 text-gray-200'
            }`}
          >
            {category.icon}
            {category.name}
          </button>
        ))}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-800/90 backdrop-blur-xl p-6 rounded-xl border border-gray-700/50 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Price Range: ${priceRange.min} - ${priceRange.max}
              </label>
              <div className="flex gap-4">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleProducts.map(product => (
          <motion.div
            key={product.id}
            className={`p-6 rounded-xl border ${theme === 'dark' ? 'bg-gray-800/90 border-gray-700/50' : 'bg-white border-[#ececec]'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-blue-600 font-bold">${product.price}</p>
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No products found</div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
