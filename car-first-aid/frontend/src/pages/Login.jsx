import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const { login, error: authError } = useAuth();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        toast.success('Logged in successfully!');
        navigate('/');
      } else {
        setError(authError || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900'
        : 'bg-gradient-to-br from-blue-50 via-gray-50 to-blue-50'
    }`}>
      {/* Racing stripe inspired decorative elements */}
      <div className={`absolute inset-0 ${
        theme === 'dark'
          ? 'opacity-10'
          : 'opacity-5'
      }`}>
        <div className="absolute right-0 top-0 w-96 h-full transform rotate-12 translate-x-32 bg-gradient-to-b from-red-500 to-red-600"></div>
        <div className="absolute right-0 top-0 w-96 h-full transform rotate-12 translate-x-48 bg-gradient-to-b from-blue-500 to-blue-600"></div>
      </div>
      <div className="w-full max-w-md relative">
        <div className={`p-8 rounded-xl shadow-lg border backdrop-blur-xl ${
          theme === 'dark'
            ? 'bg-gray-800/80 border-gray-700'
            : 'bg-white/90 border-gray-200'
        }`}>
          <h1 className={`text-3xl font-bold mb-6 text-center ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          }`}>
            Welcome Back
          </h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 rounded-xl border focus:ring-2 outline-none transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400/30 focus:ring-blue-400/20'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500/30 focus:ring-blue-500/20'
                }`}
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-3 rounded-xl border focus:ring-2 outline-none transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400/30 focus:ring-blue-400/20'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500/30 focus:ring-blue-500/20'
                }`}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className={`h-4 w-4 rounded border focus:ring-2 ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-400/20'
                      : 'bg-white border-gray-300 text-blue-600 focus:ring-blue-500/20'
                  }`}
                />
                <label htmlFor="rememberMe" className={`ml-2 block text-sm ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Remember me
                </label>
              </div>
              <Link 
                to="/forgot-password" 
                className={`text-sm ${
                  theme === 'dark'
                    ? 'text-blue-400 hover:text-blue-300'
                    : 'text-blue-600 hover:text-blue-500'
                }`}
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors duration-300 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
              Don't have an account?{" "}
              <Link 
                to="/register" 
                className={`font-medium ${
                  theme === 'dark'
                    ? 'text-blue-400 hover:text-blue-300'
                    : 'text-blue-600 hover:text-blue-500'
                }`}
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
