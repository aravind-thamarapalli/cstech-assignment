import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { authAPI } from '../utils/api.js';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, error, setError, clearError } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Debug: Log error changes
  useEffect(() => {
    console.log('Auth error changed:', error);
  }, [error]);

  // Test backend connectivity on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/health');
        const data = await response.json();
        console.log('Backend connection test:', data);
      } catch (error) {
        console.error('Backend connection failed:', error);
        setError('Cannot connect to server. Please ensure the backend is running on http://localhost:5000');
      }
    };
    testConnection();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    clearError();
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    console.log('Form submitted'); // Debug log
    
    // Prevent multiple submissions
    if (isSubmitting) {
      return;
    }
    
    if (!validateForm()) {
      console.log('Validation failed'); // Debug log
      return;
    }

    setIsSubmitting(true);
    clearError();

    try {
      console.log('Attempting login with:', { email: formData.email }); // Debug log
      const response = await authAPI.login(formData);
      console.log('Login response:', response); // Debug log
      
      if (response.data && response.data.success) {
        login(response.data.token, response.data.user);
        navigate('/dashboard');
      } else {
        const errorMsg = response.data?.message || 'Login failed. Please try again.';
        console.log('Login failed:', errorMsg); // Debug log
        setError(errorMsg);
      }
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error' || !error.response) {
        errorMessage = 'Unable to connect to server. Please check your connection and ensure the server is running.';
      }
      
      console.log('Setting error message:', errorMessage); // Debug log
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="form-container">
          <h2 className="form-title">Login</h2>
          
          {error && (
            <div className="auth-error-message" style={{ marginBottom: 'var(--spacing-lg)' }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="auth-form-group">
              <label htmlFor="email" className="auth-form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`auth-form-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter your email"
                disabled={isSubmitting}
              />
              {errors.email && (
                <div className="auth-error-message">{errors.email}</div>
              )}
            </div>

            <div className="auth-form-group">
              <label htmlFor="password" className="auth-form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`auth-form-input ${errors.password ? 'error' : ''}`}
                placeholder="Enter your password"
                disabled={isSubmitting}
              />
              {errors.password && (
                <div className="auth-error-message">{errors.password}</div>
              )}
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isSubmitting}
              onClick={(e) => {
                console.log('Button clicked'); // Debug log
                // Form submission will be handled by onSubmit
              }}
            >
              {isSubmitting ? (
                <>
                  <div className="loading-spinner" style={{ width: '20px', height: '20px', display: 'inline-block', marginRight: '8px' }}></div>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="text-center mt-3">
            <p>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#3498db', textDecoration: 'none' }}>
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;