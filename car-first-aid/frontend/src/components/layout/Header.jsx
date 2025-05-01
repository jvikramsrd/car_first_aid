import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'Diagnose', path: '/diagnose' },
    { name: 'Mechanics', path: '/mechanics' },
    { name: 'Marketplace', path: '/marketplace' },
  ];

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-primary-600">
              Car First Aid
            </Link>
            <div className="hidden md:flex space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${location.pathname === item.path
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                    }
                  `}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/account"
                  className="text-sm font-medium text-secondary-600 hover:text-primary-600"
                >
                  My Account
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}; 