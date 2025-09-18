import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './ProtectedRoute.css';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, loading, user, hasRole } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="App">
        <div className="container" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh' 
        }}>
          <div>
            <div className="loading-spinner" style={{ width: '50px', height: '50px' }}></div>
            <p style={{ textAlign: 'center', marginTop: '1rem', color: '#7f8c8d' }}>
              Loading...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access if requiredRole is specified
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="App">
        <div className="container" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh' 
        }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#e74c3c' }}>Access Denied</h2>
            <p style={{ color: '#7f8c8d' }}>
              You don't have permission to access this page.
            </p>
            <p style={{ color: '#7f8c8d' }}>
              Required role: <strong>{requiredRole}</strong><br />
              Your role: <strong>{user?.role}</strong>
            </p>
            <Navigate to="/dashboard" replace />
          </div>
        </div>
      </div>
    );
  }

  // Render protected component if authenticated and authorized
  return children;
};

export default ProtectedRoute;