# MERN Stack Task Management Application

A comprehensive task management system built with MongoDB, Express.js, React, and Node.js. This application allows admin users to manage agents and distribute tasks efficiently through file uploads.

## 🚀 Features

### Backend (Node.js + Express + MongoDB)
- **JWT Authentication**: Secure admin login system with token-based authentication
- **Agent Management**: CRUD operations for managing agents with encrypted passwords
- **File Upload**: Support for CSV/XLSX file uploads with automatic task distribution
- **Task Distribution**: Intelligent distribution of tasks among agents using round-robin algorithm
- **Data Validation**: Comprehensive server-side validation for all inputs
- **Error Handling**: Robust error handling with detailed error messages
- **Security**: CORS protection, input sanitization, and secure password hashing

### Frontend (React)
- **Responsive UI**: Clean, modern interface that works on all devices
- **Protected Routes**: Route protection with automatic redirection
- **Real-time Updates**: Dynamic dashboard with live statistics
- **File Upload Interface**: Drag-and-drop file upload with progress indicators
- **Form Validation**: Client-side validation with real-time feedback
- **Error Management**: Graceful error handling with user-friendly messages

## 📋 Requirements Met

✅ **Admin User Login** with JWT authentication  
✅ **Agent Creation & Management** with full CRUD operations  
✅ **CSV/XLSX File Upload** with format validation  
✅ **Task Distribution** among 5 agents equally  
✅ **Clean Code Structure** with comments and documentation  
✅ **Error Handling** throughout the application  
✅ **Responsive Design** for all screen sizes  

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **XLSX** - Excel file processing
- **CSV-Parser** - CSV file processing

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management

## 📁 Project Structure

```
cstech-assignment/
├── backend/
│   ├── models/
│   │   ├── User.js          # Admin user model
│   │   ├── Agent.js         # Agent model
│   │   └── Task.js          # Task model
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── agents.js        # Agent management routes
│   │   └── upload.js        # File upload routes
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── uploads/             # File upload directory
│   ├── server.js            # Main server file
│   ├── package.json         # Backend dependencies
│   └── .env.example         # Environment variables template
├── frontend/
│   ├── public/
│   │   └── index.html       # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js        # Navigation header
│   │   │   ├── ProtectedRoute.js # Route protection
│   │   │   └── ErrorMessage.js   # Error display component
│   │   ├── pages/
│   │   │   ├── Login.js         # Admin login page
│   │   │   ├── Register.js      # Admin registration
│   │   │   ├── Dashboard.js     # Main dashboard
│   │   │   ├── AddAgent.js      # Agent creation form
│   │   │   ├── ViewAgents.js    # Agent list and management
│   │   │   └── UploadList.js    # File upload interface
│   │   ├── context/
│   │   │   └── AuthContext.js   # Authentication state management
│   │   ├── utils/
│   │   │   └── api.js           # API configuration and calls
│   │   ├── App.js               # Main application component
│   │   ├── index.js             # React entry point
│   │   └── index.css            # Global styles
│   ├── package.json         # Frontend dependencies
│   └── .env.example         # Frontend environment variables
└── README.md                # This file
```

## 🚦 Getting Started

### Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - Choose one option:
  - Local installation: [Download MongoDB Community](https://www.mongodb.com/try/download/community)
  - Cloud instance: [MongoDB Atlas](https://cloud.mongodb.com/) (Free tier available)
- **npm** (comes with Node.js) or **yarn** package manager
- **Git** for cloning the repository

### Quick Setup & Installation

Follow these step-by-step instructions to get the application running:

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd cstech-assignment
```

#### 2. Backend Setup (Terminal 1)
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit the .env file with your configuration
# Use notepad, VS Code, or any text editor
notepad .env
```

**Configure your `.env` file:**
```env
# Server Configuration
PORT=5000

# Database Configuration
MONGO_URI=mongodb://localhost:27017/cstech-assignment
# For MongoDB Atlas, use: mongodb+srv://username:password@cluster.mongodb.net/cstech-assignment

# Security
JWT_SECRET=your_super_secret_jwt_key_here

```

#### 3. Frontend Setup (Terminal 2)
```bash
# Navigate to frontend directory (open new terminal)
cd client

# Install dependencies
npm install
```

#### 4. Database Setup

**Option A: Local MongoDB**
```bash
# Start MongoDB service
# Windows (if installed as service):
net start MongoDB

# macOS (with Homebrew):
brew services start mongodb-community

# Linux (systemd):
sudo systemctl start mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster (free tier available)
3. Get connection string and update `MONGO_URI` in backend `.env`
4. Whitelist your IP address in Atlas dashboard

### 🏃‍♂️ Running the Application

#### Development Mode (Recommended for testing)

**Terminal 1 - Backend Server:**
```bash
cd backend
npm run dev
# Backend will run on http://localhost:5000
# You should see: "Server running on port 5000" and "Database connected"
```

**Terminal 2 - Frontend Development Server:**
```bash
cd client
npm run dev
# Frontend will run on http://localhost:5173
# Browser should automatically open the application
```

#### Production Mode

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd client
npm run build    # Build production files
npm run preview  # Preview production build
```

### 🔧 Environment Setup Verification

#### Check if everything is working:

1. **Backend Health Check:**
   - Open: http://localhost:5000/api/health
   - Should return: `{"status": "OK", "message": "Server is running"}`

2. **Database Connection:**
   - Check terminal for: "Database connected successfully"
   - No connection errors should appear

3. **Frontend Application:**
   - Open: http://localhost:5173
   - Should show the login page
   - No console errors in browser developer tools

### 🎯 First-Time Application Setup

#### Create Your First Admin User:

1. **Go to Registration Page:**
   - Click "Don't have an account? Register here" on login page
   - Or navigate to: http://localhost:5173/register

2. **Register Admin Account:**
   ```
   Name: Your Name
   Email: admin@example.com
   Password: admin123456 (minimum 6 characters)
   ```

3. **Login:**
   - Use the credentials you just created
   - You'll be redirected to the dashboard

#### Add Your First Agent:

1. **Navigate to "Add Agent"** from dashboard or header
2. **Fill Agent Details:**
   ```
   Name: Agent 1
   Email: agent1@example.com
   Mobile: +1234567890 (include country code)
   Password: agent123456
   ```
3. **Click "Create Agent"**

#### Upload Your First File:

1. **Navigate to "Upload Files"**
2. **Prepare a CSV file** with this format:
   ```csv
   FirstName,Phone,Notes
   Alice Johnson,+1234567890,Follow up needed
   Bob Smith,+9876543210,Interested in demo
   Carol Davis,+1122334455,Previous customer
   ```
3. **Drag and drop** the file or click to upload
4. **Verify task distribution** in the results

## 📖 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new admin user
```json
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "password123"
}
```

#### POST /api/auth/login
Login admin user
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Agent Management Endpoints

#### GET /api/agents
Get all agents (Protected)

#### POST /api/agents
Create new agent (Protected)
```json
{
  "name": "Agent Name",
  "email": "agent@example.com",
  "mobile": "+1234567890",
  "password": "agentpass123"
}
```

#### GET /api/agents/:id
Get single agent (Protected)

#### PUT /api/agents/:id
Update agent (Protected)

#### DELETE /api/agents/:id
Delete agent (Protected)

### File Upload Endpoints

#### POST /api/upload
Upload CSV/XLSX file and distribute tasks (Protected)
- Accepts: multipart/form-data
- Field name: 'file'
- Supported formats: .csv, .xlsx, .xls
- Max file size: 5MB

#### GET /api/upload/tasks
Get all tasks with agent information (Protected)

#### GET /api/upload/tasks/by-agent
Get tasks grouped by agent (Protected)

## 📊 File Format Requirements

The uploaded CSV/XLSX file should contain the following columns:

| Column | Required | Description |
|--------|----------|-------------|
| FirstName (or Name) | Yes | Contact's first name |
| Phone (or Mobile) | Yes | Phone number |
| Notes | No | Additional notes |

**Example CSV:**
```csv
FirstName,Phone,Notes
John Doe,+1234567890,Follow up call needed
Jane Smith,+9876543210,Interested in product demo
Bob Johnson,+1122334455,Previous customer
```

## 🔧 Task Distribution Logic

- Tasks are distributed equally among available agents
- Maximum of 5 agents are used for distribution
- Round-robin algorithm ensures fair distribution
- If tasks don't divide evenly, some agents get one extra task

## 🎨 UI Features

### Dashboard
- Statistics overview (agents count, tasks count)
- Quick action cards for main functions
- Recent activity display
- Getting started guide for new users

### Agent Management
- Add new agents with validation
- View all agents in a table format
- See task distribution per agent
- Delete agents with confirmation

### File Upload
- Drag and drop interface
- File format validation
- Upload progress indication
- Detailed results with task distribution
- Sample file download

## 🔒 Security Features

- Password hashing with bcrypt (cost factor 12)
- JWT tokens with 24-hour expiration
- Protected routes with authentication middleware
- CORS configuration
- Input validation and sanitization
- File type and size validation

## 🐛 Error Handling

- Global error handling middleware
- Client-side error boundaries
- User-friendly error messages
- Network error detection
- Validation error display

## 📱 Responsive Design

- Mobile-first approach
- Responsive grid layouts
- Touch-friendly interfaces
- Optimized for all screen sizes

## 🧪 Testing the Application

### Complete Testing Workflow:

1. **Register/Login as Admin:**
   - Register a new admin account or use existing credentials
   - Verify successful login and redirect to dashboard

2. **Create Agents:**
   - Add at least 2-3 agents for proper testing
   - Verify agents appear in the "View Agents" section
   - Test agent creation with various data

3. **Upload Sample Files:**
   - Create a CSV file with 10-15 contacts
   - Upload and verify task distribution
   - Check that tasks are assigned to agents equally

4. **Verify Task Distribution:**
   - Navigate to "View Agents"
   - Check "Task Distribution" section
   - Click "+X more" to expand task details

## 🚨 Troubleshooting

### Common Issues and Solutions:

#### Backend Issues:

**1. "Database connection failed"**
```bash
# Check if MongoDB is running
# Windows:
net start MongoDB

# Check connection string in .env file
# Verify MONGO_URI format
```

**2. "Port 5000 already in use"**
```bash
# Change port in backend/.env
PORT=5001

# Or kill process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <process_id> /F

# macOS/Linux:
lsof -ti:5000 | xargs kill -9
```

**3. "JWT_SECRET missing"**
```bash
# Ensure JWT_SECRET is set in backend/.env
JWT_SECRET=your_minimum_32_character_secret_key_here
```

#### Frontend Issues:

**1. "API connection failed"**
- Verify backend is running on http://localhost:5000
- Check network tab in browser developer tools
- Ensure CORS is properly configured

**2. "Build fails"**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**3. "Port 5173 already in use"**
```bash
# Kill process or use different port
npm run dev -- --port 3001
```

#### File Upload Issues:

**1. "File format not supported"**
- Ensure file has .csv, .xlsx, or .xls extension
- Check file size (max 5MB)
- Verify file contains required columns (FirstName, Phone)

**2. "No agents available"**
- Create at least one agent before uploading files
- Verify agents exist in database

### Log Files and Debugging:

**Backend Logs:**
```bash
# Check server console for detailed error messages
cd backend
npm run dev
# Look for MongoDB connection, authentication, and API errors
```

**Frontend Debugging:**
```bash
# Open browser developer tools (F12)
# Check Console tab for JavaScript errors
# Check Network tab for API request failures
```

### System Requirements Check:

```bash
# Verify Node.js version
node --version
# Should be v14.0.0 or higher

# Verify npm version
npm --version

# Check MongoDB status
# Windows:
sc query MongoDB

# macOS:
brew services list | grep mongodb

# Linux:
systemctl status mongod
```

## 🚀 Production Deployment Guide

### Backend Deployment Steps:

1. **Environment Configuration:**
```bash
# Set production environment variables
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/production-db
JWT_SECRET=production_secret_minimum_32_characters
PORT=5000
```

2. **Security Checklist:**
- [ ] Change default JWT secret
- [ ] Use HTTPS in production
- [ ] Configure proper CORS origins
- [ ] Set up rate limiting
- [ ] Enable request logging

3. **Platform-Specific Deployment:**

**Heroku:**
```bash
# Install Heroku CLI
npm install -g heroku
heroku create your-app-name
heroku config:set MONGO_URI=your_production_mongodb_uri
heroku config:set JWT_SECRET=your_production_jwt_secret
git push heroku main
```

**AWS/DigitalOcean:**
```bash
# Use PM2 for process management
npm install -g pm2
pm2 start server.js --name "cstech-backend"
pm2 startup
pm2 save
```

### Frontend Deployment Steps:

1. **Build Production Files:**
```bash
cd client
npm run build
# Creates optimized production build in dist/ folder
```

2. **Deploy to Static Hosting:**

**Netlify:**
```bash
# Install Netlify CLI
npm install -g netlify-cli
cd client
npm run build
netlify deploy --prod --dir=dist
```

**Vercel:**
```bash
# Install Vercel CLI
npm install -g vercel
cd client
vercel --prod
```

## 📋 Deployment Checklist

### Pre-Deployment:
- [ ] All environment variables configured
- [ ] Database properly set up
- [ ] SSL certificate configured (production)
- [ ] CORS origins updated for production domain
- [ ] Error logging configured
- [ ] Backup strategy in place

### Post-Deployment:
- [ ] Application accessible via production URL
- [ ] Admin registration/login working
- [ ] Agent creation functioning
- [ ] File upload and task distribution working
- [ ] Database connections stable
- [ ] Error monitoring active

## 📞 Demo Access & Testing Credentials

### For Quick Testing:

**Admin Credentials (if seeded):**
```
Email: admin@example.com
Password: admin123456
```

**Test CSV File Content:**
```csv
FirstName,Phone,Notes
John Smith,+1234567890,Initial contact
Jane Doe,+9876543210,Follow up needed
Bob Johnson,+1122334455,Demo scheduled
Alice Brown,+5556667777,Interested in product
Charlie Wilson,+9998887776,Previous customer
Sarah Davis,+1112223333,Requires callback
Mike Jones,+4445556666,Hot lead
Lisa Garcia,+7778889999,Technical questions
Tom Miller,+2223334444,Budget approved
Emma Wilson,+6667778888,Decision maker
```

### Testing Scenarios:

1. **Basic Flow Test:**
   - Register → Login → Add Agent → Upload File → View Distribution

2. **Edge Cases:**
   - Upload empty file
   - Upload file with missing columns
   - Upload large file (>5MB)
   - Create agent with duplicate email

3. **UI Responsiveness:**
   - Test on mobile devices
   - Test different screen sizes
   - Verify all buttons and forms work

## 🚀 Production Deployment

### Backend Deployment
1. Set production environment variables
2. Use a production MongoDB instance
3. Enable HTTPS
4. Configure proper CORS origins

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to static hosting (Netlify, Vercel, etc.)
3. Update API URL in environment variables

## 📞 Demo Credentials

For testing purposes, you can use these credentials or register new ones:

**Admin Login:**
- Email: admin@example.com
- Password: admin123

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 💡 Additional Notes

- The application uses localStorage for token storage
- File uploads are temporarily stored on the server
- All passwords are encrypted before storage
- The system supports international phone numbers with country codes
- Task distribution happens automatically upon file upload

## 🔮 Future Enhancements

- Agent login portal
- Real-time notifications
- Advanced analytics and reporting
- Bulk agent import
- Task status tracking
- Email notifications

---

**Built with ❤️ for the Machine Test Assignment**


