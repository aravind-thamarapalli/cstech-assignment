import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import './ErrorMessage.css';

const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="alert alert-error">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{message}</span>
        {onClose && (
          <button 
            onClick={onClose}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'inherit', 
              cursor: 'pointer',
              fontSize: '1.2rem',
              padding: '0 0.5rem'
            }}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

const GlobalErrorMessage = () => {
  const { error, clearError } = useAuth();

  return <ErrorMessage message={error} onClose={clearError} />;
};

export { ErrorMessage, GlobalErrorMessage };
export default ErrorMessage;