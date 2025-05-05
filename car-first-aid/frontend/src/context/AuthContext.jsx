import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const AuthContext = createContext(null);

// Custom hook for using auth context
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Auth Provider Component
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(() => {
    // Initialize token from localStorage
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      // Set the authorization header immediately if token exists
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    return storedToken;
  });

  useEffect(() => {
  const checkAuth = async () => {
    try {
      if (!token) {
        setLoading(false);
        return;
      }

        const response = await axios.get(`${API_URL}/auth/profile`);
        if (response.data.success) {
          setUser(response.data.data);
        } else {
          throw new Error(response.data.message || 'Authentication failed');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        // Only clear token if it's an authentication error
        if (err.response?.status === 401) {
        localStorage.removeItem('token');
        setToken(null);
        delete axios.defaults.headers.common['Authorization'];
      }
    } finally {
      setLoading(false);
    }
  };

    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      
      if (response.data.success) {
        const { data } = response.data;
        const newToken = response.data.token || response.headers['x-auth-token'];
        
        if (!newToken) {
          throw new Error('No token received');
        }

        localStorage.setItem('token', newToken);
        setToken(newToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        setUser(data);
        return true;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred during login';
      setError(errorMessage);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      
      if (response.data.success) {
        const { data } = response.data;
        const newToken = response.data.token || response.headers['x-auth-token'];
        
        if (!newToken) {
          throw new Error('No token received');
        }

        localStorage.setItem('token', newToken);
        setToken(newToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        setUser(data);
        return true;
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred during registration';
      setError(errorMessage);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    token,
    login,
    logout,
    register,
    checkAuth: () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken && !token) {
        setToken(storedToken);
      }
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, useAuth };
