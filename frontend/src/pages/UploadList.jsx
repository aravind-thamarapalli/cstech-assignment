import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import { GlobalErrorMessage } from '../components/ErrorMessage.jsx';
import { uploadAPI, agentAPI } from '../utils/api.js';
import './UploadList.css';

const UploadList = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState('');
  const [agentCount, setAgentCount] = useState(0);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Check agent count on component mount
  React.useEffect(() => {
    checkAgentCount();
  }, []);

  const checkAgentCount = async () => {
    try {
      const response = await agentAPI.getAgents();
      if (response.data.success) {
        setAgentCount(response.data.count);
      }
    } catch (error) {
      console.error('Error checking agent count:', error);
    }
  };

  // Handle file selection
  const handleFileSelect = (selectedFile) => {
    setError('');
    setUploadResult(null);

    // Validate file type
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    const allowedExtensions = ['.csv', '.xlsx', '.xls'];
    const fileExtension = selectedFile.name.toLowerCase().substr(selectedFile.name.lastIndexOf('.'));

    if (!allowedTypes.includes(selectedFile.type) && !allowedExtensions.includes(fileExtension)) {
      setError('Please select a valid CSV, XLS, or XLSX file.');
      return;
    }

    // Validate file size (5MB limit)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      return;
    }

    setFile(selectedFile);
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // Handle form submission
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    if (agentCount === 0) {
      setError('No agents found. Please create at least one agent before uploading tasks.');
      return;
    }

    setUploading(true);
    setError('');
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await uploadAPI.uploadFile(formData);

      if (response.data.success) {
        setUploadResult(response.data);
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.errors) {
        setError(error.response.data.errors.join(', '));
      } else {
        setError('An unexpected error occurred during upload. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  // Reset upload
  const handleReset = () => {
    setFile(null);
    setUploadResult(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="App">
      <Header />
      <main style={{ padding: '2rem 0' }}>
        <div className="container">
          <GlobalErrorMessage />

          <div className="d-flex justify-between align-center mb-4">
            <h1 style={{ color: '#2c3e50', margin: 0 }}>Upload Task List</h1>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/agents')}
            >
              View Agents ({agentCount})
            </button>
          </div>

          {/* Agent Check Warning */}
          {agentCount === 0 && (
            <div className="alert alert-warning">
              <strong>Warning:</strong> You need to create at least one agent before uploading tasks.
              <br />
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/add-agent')}
                style={{ marginTop: '0.5rem' }}
              >
                Add Agent First
              </button>
            </div>
          )}

          {/* File Upload Form */}
          <div className="card">
            <div className="card-header">
              Upload CSV/XLSX File
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-error mb-3">
                  {error}
                </div>
              )}

              <form onSubmit={handleUpload}>
                {/* File Upload Area */}
                <div 
                  className={`file-upload ${dragActive ? 'dragging' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="file-upload-input"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileInputChange}
                    disabled={uploading}
                  />
                  
                  <div className="file-upload-label">
                    📁 Click to select file or drag and drop
                  </div>
                  <div className="file-upload-text">
                    Supported formats: CSV, XLS, XLSX (Max 5MB)
                  </div>
                </div>

                {/* Selected File Info */}
                {file && (
                  <div style={{ 
                    marginTop: '1rem', 
                    padding: '1rem', 
                    backgroundColor: '#f8f9fa', 
                    borderRadius: '4px',
                    border: '1px solid #dee2e6'
                  }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>
                      Selected File:
                    </h4>
                    <p style={{ margin: '0', color: '#495057' }}>
                      <strong>Name:</strong> {file.name}
                      <br />
                      <strong>Size:</strong> {formatFileSize(file.size)}
                      <br />
                      <strong>Type:</strong> {file.type || 'Unknown'}
                    </p>
                  </div>
                )}

                {/* File Format Instructions */}
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '1rem', 
                  backgroundColor: '#e8f4f8', 
                  borderRadius: '4px',
                  borderLeft: '4px solid #3498db'
                }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>
                    Required File Format:
                  </h4>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#495057' }}>
                    Your CSV/XLSX file should have the following columns:
                  </p>
                  <ul style={{ margin: '0', paddingLeft: '1.5rem', color: '#495057' }}>
                    <li><strong>FirstName</strong> or <strong>Name</strong> - Required</li>
                    <li><strong>Phone</strong> or <strong>Mobile</strong> - Required</li>
                    <li><strong>Notes</strong> - Optional</li>
                  </ul>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#7f8c8d' }}>
                    Column names are case-insensitive. Tasks will be distributed equally among your {agentCount} agent(s).
                  </p>
                </div>

                {/* Upload Button */}
                <div className="d-flex gap-2 mt-3">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!file || uploading || agentCount === 0}
                    style={{ flex: 1 }}
                  >
                    {uploading ? (
                      <>
                        <div className="loading-spinner" style={{ width: '20px', height: '20px', display: 'inline-block', marginRight: '8px' }}></div>
                        Processing File...
                      </>
                    ) : (
                      'Upload and Distribute Tasks'
                    )}
                  </button>
                  
                  {(file || uploadResult) && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleReset}
                      disabled={uploading}
                    >
                      Reset
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Upload Results */}
          {uploadResult && (
            <div className="card">
              <div className="card-header">
                Upload Results
              </div>
              <div className="card-body">
                <div className="alert alert-success mb-3">
                  <strong>Success!</strong> {uploadResult.message}
                </div>

                {/* Summary */}
                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Summary:</h4>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ 
                      padding: '1rem', 
                      backgroundColor: '#27ae60', 
                      width: '150px',
                      color: 'white', 
                      borderRadius: '4px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                        {uploadResult.summary.totalTasks}
                      </div>
                      <div>Total Tasks</div>
                    </div>
                    <div style={{ 
                      padding: '1rem', 
                      backgroundColor: '#3498db', 
                      width: '150px',
                      color: 'white', 
                      borderRadius: '4px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                        {uploadResult.summary.distribution.length}
                      </div>
                      <div>Agents Assigned</div>
                    </div>
                  </div>
                </div>

                {/* Validation Errors */}
                {uploadResult.summary.validationErrors && uploadResult.summary.validationErrors.length > 0 && (
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#e74c3c', marginBottom: '1rem' }}>Validation Warnings:</h4>
                    <div className="alert alert-warning">
                      <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                        {uploadResult.summary.validationErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Task Distribution */}
                <div>
                  <h4 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Task Distribution:</h4>
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Agent</th>
                          <th>Email</th>
                          <th>Tasks Assigned</th>
                          <th>Sample Tasks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {uploadResult.summary.distribution.map((item, index) => (
                          <tr key={index}>
                            <td style={{ fontWeight: '500' }}>{item.agentName}</td>
                            <td>{item.agentEmail}</td>
                            <td>
                              <span style={{ 
                                backgroundColor: '#3498db',
                                color: 'white',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '12px',
                                fontSize: '0.875rem'
                              }}>
                                {item.taskCount}
                              </span>
                            </td>
                            <td>
                              {item.tasks.slice(0, 2).map((task, taskIndex) => (
                                <div key={taskIndex} style={{ fontSize: '0.875rem', color: '#7f8c8d' }}>
                                  {task.firstName} - {task.phone}
                                </div>
                              ))}
                              {item.tasks.length > 2 && (
                                <div style={{ fontSize: '0.875rem', color: '#95a5a6' }}>
                                  +{item.tasks.length - 2} more...
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="d-flex gap-2 mt-3">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => navigate('/agents')}
                  >
                    View All Agents
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={handleReset}
                  >
                    Upload Another File
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UploadList;