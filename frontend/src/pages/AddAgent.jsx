import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import { GlobalErrorMessage } from '../components/ErrorMessage.jsx';
import { agentAPI } from '../utils/api.js';
import './AddAgent.css';

const AddAgent = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

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
    
    // Clear success message when user starts editing
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Mobile validation (with country code)
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\+[1-9]\d{1,14}$/.test(formData.mobile.trim())) {
      newErrors.mobile = 'Please enter a valid mobile number with country code (e.g., +1234567890)';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm the password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      const { confirmPassword, ...agentData } = formData;
      const response = await agentAPI.createAgent(agentData);
      
      if (response.data.success) {
        setSuccessMessage('Agent created successfully!');
        // Reset form
        setFormData({
          name: '',
          email: '',
          mobile: '',
          password: '',
          confirmPassword: '',
        });
        setErrors({});
        
        // Auto-redirect after 2 seconds
        setTimeout(() => {
          navigate('/agents');
        }, 2000);
      }
    } catch (error) {
      console.error('Create agent error:', error);
      
      if (error.response?.data?.message) {
        setErrors({ submit: error.response.data.message });
      } else if (error.response?.data?.errors) {
        setErrors({ submit: error.response.data.errors.join(', ') });
      } else {
        setErrors({ submit: 'An unexpected error occurred. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="App">
      <Header />
      <main style={{ padding: '2rem 0' }}>
        <div className="container">
          <GlobalErrorMessage />
          
          <div className="form-container">
            <h2 className="form-title">Add New Agent</h2>
            
            {successMessage && (
              <div className="alert alert-success">
                {successMessage}
                <br />
                <small>Redirecting to agents list...</small>
              </div>
            )}

            {errors.submit && (
              <div className="alert alert-error">
                {errors.submit}
              </div>
            )}
            
            <form className='form' onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Full Name <span style={{ color: '#e74c3c' }}>*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Enter agent's full name"
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <div className="error-message">{errors.name}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address <span style={{ color: '#e74c3c' }}>*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="Enter agent's email"
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <div className="error-message">{errors.email}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="mobile" className="form-label">
                  Mobile Number <span style={{ color: '#e74c3c' }}>*</span>
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={`form-input ${errors.mobile ? 'error' : ''}`}
                  placeholder="e.g., +1234567890"
                  disabled={isSubmitting}
                />
                {errors.mobile && (
                  <div className="error-message">{errors.mobile}</div>
                )}
                <small style={{ color: '#7f8c8d', fontSize: '0.875rem' }}>
                  Include country code (e.g., +1 for US, +91 for India)
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password <span style={{ color: '#e74c3c' }}>*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Enter password (min 6 characters)"
                  disabled={isSubmitting}
                />
                {errors.password && (
                  <div className="error-message">{errors.password}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password <span style={{ color: '#e74c3c' }}>*</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Confirm the password"
                  disabled={isSubmitting}
                />
                {errors.confirmPassword && (
                  <div className="error-message">{errors.confirmPassword}</div>
                )}
              </div>

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                  style={{ flex: 1 }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="loading-spinner" style={{ width: '20px', height: '20px', display: 'inline-block', marginRight: '8px' }}></div>
                      Creating Agent...
                    </>
                  ) : (
                    'Create Agent'
                  )}
                </button>
                
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate('/agents')}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </form>

            <div className="mt-3 text-center">
              <p style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
                <strong>Note:</strong> Agents will use their email and password to access their tasks.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddAgent;