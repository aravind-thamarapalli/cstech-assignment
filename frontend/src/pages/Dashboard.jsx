import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiList, FiPlus, FiUpload, FiEye } from 'react-icons/fi';
import Header from '../components/Header.jsx';
import { BsFillBarChartFill } from "react-icons/bs";
import { GlobalErrorMessage } from '../components/ErrorMessage.jsx';
import { agentAPI, uploadAPI } from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAgents: 0,
    totalTasks: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  // Stats cards configuration - showing different stats based on role
  const getStatsCards = () => {
    const baseStats = [
      {
        id: 'tasks',
        icon: <FiList size={24} />,
        title: `${stats.totalTasks} Tasks`,
        description: 'Total tasks in the system'
      }
    ];

    if (isAdmin()) {
      return [
        {
          id: 'agents',
          icon: <FiUsers size={24} />,
          title: `${stats.totalAgents} Agents`,
          description: 'Total number of agents in the system'
        },
        ...baseStats,
        {
          id: 'analytics',
          icon: <BsFillBarChartFill size={24} />,
          title: 'Analytics',
          description: 'View task distribution and performance'
        }
      ];
    }

    return baseStats;
  };

  // Action cards configuration - showing different actions based on role
  const getActionCards = () => {
    const baseActions = [
      {
        id: 'upload',
        icon: <FiUpload size={24} />,
        title: 'Upload List',
        description: 'Upload CSV/XLSX files and distribute tasks among agents',
        path: '/upload'
      }
    ];

    if (isAdmin()) {
      return [
        {
          id: 'add-agent',
          icon: <FiPlus size={24} />,
          title: 'Add Agent',
          description: 'Create a new agent with contact details and credentials',
          path: '/add-agent'
        },
        ...baseActions,
        {
          id: 'view-agents',
          icon: <FiEye size={24} />,
          title: 'View Agents',
          description: 'View all agents and their assigned tasks',
          path: '/agents'
        }
      ];
    }

    return baseActions;
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch tasks data (available to all users)
      const tasksResponse = await uploadAPI.getTasks();
      
      let agentsCount = 0;
      
      // Only fetch agents data if user is admin
      if (isAdmin()) {
        try {
          const agentsResponse = await agentAPI.getAgents();
          if (agentsResponse.data.success) {
            agentsCount = agentsResponse.data.count;
          }
        } catch (error) {
          console.error('Error fetching agents data:', error);
          // Non-admin users will get 403, which is expected
        }
      }

      if (tasksResponse.data.success) {
        setStats({
          totalAgents: agentsCount,
          totalTasks: tasksResponse.data.count,
          recentActivity: tasksResponse.data.tasks.slice(0, 5) // Show last 5 tasks
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
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
              Loading dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      <main className="dashboard">
        <div className="container">
          <GlobalErrorMessage />
          
          <div className="dashboard-header">
            <h1 className="dashboard-title">
              {isAdmin() ? 'Admin Dashboard' : 'User Dashboard'}
            </h1>
            <p className="dashboard-subtitle">
              {isAdmin() 
                ? 'Manage agents and tasks efficiently' 
                : 'Upload files and manage your tasks'
              }
            </p>
          </div>

          {/* Stats Cards */}
          <div className="dashboard-grid">
            {getStatsCards().map((card) => (
              <div key={card.id} className="dashboard-card">
                <div className="dashboard-card-icon">{card.icon}</div>
                <h3 className="dashboard-card-title">{card.title}</h3>
                <p className="dashboard-card-description">{card.description}</p>
              </div>
            ))}
          </div>

          {/* Action Cards */}
          <div className="dashboard-grid">
            {getActionCards().map((card) => (
              <div 
                key={card.id}
                className="dashboard-card" 
                onClick={() => handleNavigation(card.path)}
                style={{ cursor: 'pointer' }}
              >
                <div className="dashboard-card-icon">{card.icon}</div>
                <h3 className="dashboard-card-title">{card.title}</h3>
                <p className="dashboard-card-description">{card.description}</p>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          {stats.recentActivity.length > 0 && (
            <div className="card">
              <div className="card-header">
                Recent Activity
              </div>
              <div className="card-body">
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Task</th>
                        <th>Phone</th>
                        <th>Assigned Agent</th>
                        <th>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentActivity.map((task, index) => (
                        <tr key={task._id || index}>
                          <td>{task.firstName}</td>
                          <td>{task.phone}</td>
                          <td>
                            {task.assignedAgent?.name || 'Unknown Agent'}
                          </td>
                          <td>
                            {new Date(task.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="text-center mt-3">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => handleNavigation('/upload')}
                  >
                    View All Tasks
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Getting Started Guide */}
          {stats.totalAgents === 0 && (
            <div className="card">
              <div className="card-header">
                Getting Started
              </div>
              <div className="card-body">
                <p style={{ marginBottom: '1rem', color: '#7f8c8d' }}>
                  Welcome to the Task Management System! Here's how to get started:
                </p>
                
                <ol style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                  <li>
                    <strong>Create Agents:</strong> Start by adding at least 5 agents who will handle the tasks.
                    <br />
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleNavigation('/add-agent')}
                      style={{ marginTop: '0.5rem' }}
                    >
                      Add Your First Agent
                    </button>
                  </li>
                  <li style={{ marginTop: '1rem' }}>
                    <strong>Upload Tasks:</strong> Once you have agents, upload a CSV or XLSX file with tasks.
                  </li>
                  <li style={{ marginTop: '1rem' }}>
                    <strong>Task Distribution:</strong> Tasks will be automatically distributed among your agents.
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;