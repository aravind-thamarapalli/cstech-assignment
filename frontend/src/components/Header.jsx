import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './Header.css';

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>
              Task Management System
            </Link>
          </div>
          
          <nav className="nav-links">
            <Link 
              to="/dashboard" 
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            >
              Dashboard
            </Link>
            
            {/* Admin-only navigation items */}
            {isAdmin() && (
              <>
                <Link 
                  to="/agents" 
                  className={`nav-link ${isActive('/agents') ? 'active' : ''}`}
                >
                  View Agents
                </Link>
                <Link 
                  to="/add-agent" 
                  className={`nav-link ${isActive('/add-agent') ? 'active' : ''}`}
                >
                  Add Agent
                </Link>
              </>
            )}
            
            {/* Available to all authenticated users */}
            <Link 
              to="/upload" 
              className={`nav-link ${isActive('/upload') ? 'active' : ''}`}
            >
              Upload List
            </Link>
            
            <div style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.9rem' }}>
                Welcome, {user?.name} ({user?.role})
              </span>
              <button 
                onClick={handleLogout}
                className="logout-btn"
              >
                Logout
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;