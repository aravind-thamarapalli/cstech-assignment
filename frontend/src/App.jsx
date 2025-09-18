import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';

// Import components
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AddAgent from './pages/AddAgent.jsx';
import ViewAgents from './pages/ViewAgents.jsx';
import UploadList from './pages/UploadList.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Import styles
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin-only routes */}
            <Route 
              path="/add-agent" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AddAgent />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agents" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <ViewAgents />
                </ProtectedRoute>
              } 
            />
            
            {/* Available to all authenticated users */}
            <Route 
              path="/upload" 
              element={
                <ProtectedRoute>
                  <UploadList />
                </ProtectedRoute>
              } 
            />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 fallback */}
            <Route 
              path="*" 
              element={
                <div className="App">
                  <div className="container" style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    minHeight: '100vh',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '6rem', marginBottom: '1rem', color: '#bdc3c7' }}>
                      404
                    </div>
                    <h1 style={{ color: '#2c3e50', marginBottom: '1rem' }}>
                      Page Not Found
                    </h1>
                    <p style={{ color: '#7f8c8d', marginBottom: '2rem' }}>
                      The page you're looking for doesn't exist.
                    </p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => window.location.href = '/dashboard'}
                    >
                      Go to Dashboard
                    </button>
                  </div>
                </div>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;