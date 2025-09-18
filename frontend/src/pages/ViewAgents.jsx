import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import { GlobalErrorMessage } from '../components/ErrorMessage.jsx';
import { agentAPI, uploadAPI } from '../utils/api.js';
import './ViewAgents.css';

const ViewAgents = () => {
  const [agents, setAgents] = useState([]);
  const [taskDistribution, setTaskDistribution] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [expandedAgent, setExpandedAgent] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch agents and task distribution
      const [agentsResponse, tasksResponse] = await Promise.all([
        agentAPI.getAgents(),
        uploadAPI.getTasksByAgent()
      ]);

      if (agentsResponse.data.success) {
        setAgents(agentsResponse.data.agents);
      }

      if (tasksResponse.data.success) {
        setTaskDistribution(tasksResponse.data.distribution);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load agents data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAgent = async (agentId) => {
    try {
      const response = await agentAPI.deleteAgent(agentId);
      
      if (response.data.success) {
        setAgents(prev => prev.filter(agent => agent._id !== agentId));
        setTaskDistribution(prev => prev.filter(item => item._id !== agentId));
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error('Error deleting agent:', error);
      setError('Failed to delete agent. Please try again.');
    }
  };

  const getTaskCountForAgent = (agentId) => {
    const agentTasks = taskDistribution.find(item => item._id === agentId);
    return agentTasks ? agentTasks.taskCount : 0;
  };

  const toggleAgentTasks = (agentId) => {
    setExpandedAgent(expandedAgent === agentId ? null : agentId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="App">
        <Header />
        <div className="container" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh' 
        }}>
          <div>
            <div className="loading-spinner" style={{ width: '50px', height: '50px' }}></div>
            <p style={{ textAlign: 'center', marginTop: '1rem', color: '#7f8c8d' }}>
              Loading agents...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      <main style={{ padding: '2rem 0' }}>
        <div className="container">
          <GlobalErrorMessage />
          
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <div className="d-flex justify-between align-center mb-4">
            <h1 style={{ color: '#2c3e50', margin: 0 }}>Agents Management</h1>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/add-agent')}
              >
                Add New Agent
              </button>
              <button 
                className="btn btn-secondary"
                onClick={fetchData}
              >
                Refresh
              </button>
            </div>
          </div>

          {agents.length === 0 ? (
            <div className="card">
              <div className="card-body text-center">
                <div style={{ fontSize: '4rem', marginBottom: '1rem', color: '#bdc3c7' }}>
                  👥
                </div>
                <h3 style={{ color: '#7f8c8d', marginBottom: '1rem' }}>
                  No Agents Found
                </h3>
                <p style={{ color: '#95a5a6', marginBottom: '2rem' }}>
                  You haven't created any agents yet. Start by adding your first agent.
                </p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/add-agent')}
                >
                  Add Your First Agent
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Agents Table */}
              <div className="card">
                <div className="card-header">
                  All Agents ({agents.length})
                </div>
                <div className="card-body">
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Mobile</th>
                          <th>Tasks Assigned</th>
                          <th>Created</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {agents.map((agent) => (
                          <tr key={agent._id}>
                            <td style={{ fontWeight: '500' }}>{agent.name}</td>
                            <td>{agent.email}</td>
                            <td>{agent.mobile}</td>
                            <td>
                              <span style={{ 
                                backgroundColor: '#3498db',
                                color: 'white',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '12px',
                                fontSize: '0.875rem'
                              }}>
                                {getTaskCountForAgent(agent._id)} tasks
                              </span>
                            </td>
                            <td>{formatDate(agent.createdAt)}</td>
                            <td>
                              <button
                                className="btn btn-danger"
                                onClick={() => setDeleteConfirm(agent._id)}
                                style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem' }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Task Distribution */}
              {taskDistribution.length > 0 && (
                <div className="card">
                  <div className="card-header">
                    Task Distribution
                  </div>
                  <div className="card-body">
                    <div className="table-container">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Agent</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>Tasks Count</th>
                            <th>Recent Tasks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {taskDistribution.map((item) => (
                            <tr key={item._id}>
                              <td style={{ fontWeight: '500' }}>{item.agentName}</td>
                              <td>{item.agentEmail}</td>
                              <td>{item.agentMobile}</td>
                              <td>
                                <span style={{ 
                                  backgroundColor: '#27ae60',
                                  color: 'white',
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '12px',
                                  fontSize: '0.875rem'
                                }}>
                                  {item.taskCount}
                                </span>
                              </td>
                              <td>
                                {/* Show first 3 tasks */}
                                {(expandedAgent === item._id ? item.tasks : item.tasks.slice(0, 3)).map((task, index) => (
                                  <div key={task.id} style={{ 
                                    fontSize: '0.875rem', 
                                    color: '#7f8c8d',
                                    marginBottom: '0.25rem',
                                    padding: '0.25rem',
                                    backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'transparent',
                                    borderRadius: '0.25rem'
                                  }}>
                                    <strong>{task.firstName}</strong> - {task.phone}
                                    {task.notes && (
                                      <div style={{ 
                                        fontSize: '0.75rem', 
                                        color: '#95a5a6',
                                        fontStyle: 'italic',
                                        marginTop: '0.125rem'
                                      }}>
                                        {task.notes}
                                      </div>
                                    )}
                                  </div>
                                ))}
                                
                                {/* Show expandable "+X more" or "Show less" */}
                                {item.tasks.length > 3 && (
                                  <div 
                                    onClick={() => toggleAgentTasks(item._id)}
                                    style={{ 
                                      fontSize: '0.875rem', 
                                      color: '#3498db',
                                      cursor: 'pointer',
                                      textDecoration: 'underline',
                                      fontWeight: '500',
                                      marginTop: '0.25rem'
                                    }}
                                  >
                                    {expandedAgent === item._id 
                                      ? 'Show less' 
                                      : `+${item.tasks.length - 3} more`
                                    }
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Delete Confirmation Modal */}
          {deleteConfirm && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}>
              <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '8px',
                maxWidth: '400px',
                width: '90%'
              }}>
                <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>
                  Confirm Delete
                </h3>
                <p style={{ marginBottom: '2rem', color: '#7f8c8d' }}>
                  Are you sure you want to delete this agent? This action cannot be undone.
                  All tasks assigned to this agent will remain but won't be accessible.
                </p>
                <div className="d-flex gap-2 justify-center">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteAgent(deleteConfirm)}
                  >
                    Yes, Delete
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setDeleteConfirm(null)}
                  >
                    Cancel
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

export default ViewAgents;