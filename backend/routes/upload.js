const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const Agent = require('../models/Agent');
const Task = require('../models/Task');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to accept only CSV and Excel files
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/csv'
  ];
  
  const allowedExtensions = ['.csv', '.xlsx', '.xls'];
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Only CSV, XLS, and XLSX files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Helper function to parse CSV file
const parseCSVFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

// Helper function to parse Excel file
const parseExcelFile = (filePath) => {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Get first sheet
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    return jsonData;
  } catch (error) {
    throw new Error('Error parsing Excel file: ' + error.message);
  }
};

// Helper function to validate data format
const validateTaskData = (data) => {
  const errors = [];
  const validTasks = [];

  data.forEach((row, index) => {
    const rowNumber = index + 1;
    
    // Check for required fields (case-insensitive)
    const firstName = row.FirstName || row.firstname || row['First Name'] || row.Name || row.name;
    const phone = row.Phone || row.phone || row.Mobile || row.mobile || row['Phone Number'];
    const notes = row.Notes || row.notes || row.Note || row.note || '';

    if (!firstName || firstName.toString().trim() === '') {
      errors.push(`Row ${rowNumber}: First Name is required`);
    }

    if (!phone || phone.toString().trim() === '') {
      errors.push(`Row ${rowNumber}: Phone number is required`);
    }

    // If both required fields are present, add to valid tasks
    if (firstName && phone) {
      validTasks.push({
        firstName: firstName.toString().trim(),
        phone: phone.toString().trim(),
        notes: notes ? notes.toString().trim() : ''
      });
    }
  });

  return { validTasks, errors };
};

// Helper function to distribute tasks among agents
const distributeTasks = async (tasks) => {
  // Get all agents
  const agents = await Agent.find({}).sort({ createdAt: 1 }); // Sort by creation date for consistent distribution
  
  if (agents.length === 0) {
    throw new Error('No agents found. Please create agents before uploading tasks.');
  }

  // Use only first 5 agents or all agents if less than 5
  const availableAgents = agents.slice(0, 5);
  const distributedTasks = [];
  
  tasks.forEach((task, index) => {
    // Round-robin distribution among available agents
    const agentIndex = index % availableAgents.length;
    const assignedAgent = availableAgents[agentIndex];
    
    distributedTasks.push({
      ...task,
      assignedAgent: assignedAgent._id
    });
  });

  return distributedTasks;
};

// @route   POST /api/upload
// @desc    Upload CSV/XLSX file and distribute tasks
// @access  Protected (Admin only)
router.post('/', authenticate, upload.single('file'), async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select a file to upload'
      });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    
    let parsedData;

    try {
      // Parse file based on extension
      if (fileExtension === '.csv') {
        parsedData = await parseCSVFile(filePath);
      } else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
        parsedData = parseExcelFile(filePath);
      } else {
        throw new Error('Unsupported file format');
      }

      // Validate parsed data
      if (!parsedData || parsedData.length === 0) {
        throw new Error('File is empty or contains no valid data');
      }

      // Validate task data format
      const { validTasks, errors } = validateTaskData(parsedData);

      if (validTasks.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No valid tasks found in the file',
          errors
        });
      }

      // Distribute tasks among agents
      const distributedTasks = await distributeTasks(validTasks);

      // Save tasks to database
      const savedTasks = await Task.insertMany(distributedTasks);

      // Get task distribution summary
      const tasksByAgent = await Task.aggregate([
        {
          $match: {
            _id: { $in: savedTasks.map(task => task._id) }
          }
        },
        {
          $lookup: {
            from: 'agents',
            localField: 'assignedAgent',
            foreignField: '_id',
            as: 'agent'
          }
        },
        {
          $unwind: '$agent'
        },
        {
          $group: {
            _id: '$assignedAgent',
            agentName: { $first: '$agent.name' },
            agentEmail: { $first: '$agent.email' },
            taskCount: { $sum: 1 },
            tasks: {
              $push: {
                id: '$_id',
                firstName: '$firstName',
                phone: '$phone',
                notes: '$notes'
              }
            }
          }
        },
        {
          $sort: { agentName: 1 }
        }
      ]);

      // Clean up uploaded file
      fs.unlinkSync(filePath);

      res.json({
        success: true,
        message: `Successfully uploaded and distributed ${savedTasks.length} tasks`,
        summary: {
          totalTasks: savedTasks.length,
          validationErrors: errors,
          distribution: tasksByAgent
        }
      });

    } catch (parseError) {
      // Clean up uploaded file in case of error
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      throw parseError;
    }

  } catch (error) {
    console.error('Upload error:', error);

    // Clean up uploaded file in case of error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    // Handle specific errors
    if (error.message.includes('No agents found')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    if (error.message.includes('Only CSV, XLS, and XLSX files are allowed')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Please upload CSV, XLS, or XLSX files only.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error processing file upload',
      error: error.message
    });
  }
});

// @route   GET /api/upload/tasks
// @desc    Get all tasks with agent information
// @access  Protected (Admin only)
router.get('/tasks', authenticate, async (req, res) => {
  try {
    const tasks = await Task.find({})
      .populate('assignedAgent', 'name email mobile')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tasks.length,
      tasks
    });

  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks'
    });
  }
});

// @route   GET /api/upload/tasks/by-agent
// @desc    Get tasks grouped by agent
// @access  Protected (Admin only)
router.get('/tasks/by-agent', authenticate, async (req, res) => {
  try {
    const tasksByAgent = await Task.aggregate([
      {
        $lookup: {
          from: 'agents',
          localField: 'assignedAgent',
          foreignField: '_id',
          as: 'agent'
        }
      },
      {
        $unwind: '$agent'
      },
      {
        $group: {
          _id: '$assignedAgent',
          agentName: { $first: '$agent.name' },
          agentEmail: { $first: '$agent.email' },
          agentMobile: { $first: '$agent.mobile' },
          taskCount: { $sum: 1 },
          tasks: {
            $push: {
              id: '$_id',
              firstName: '$firstName',
              phone: '$phone',
              notes: '$notes',
              createdAt: '$createdAt'
            }
          }
        }
      },
      {
        $sort: { agentName: 1 }
      }
    ]);

    res.json({
      success: true,
      distribution: tasksByAgent
    });

  } catch (error) {
    console.error('Get tasks by agent error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching task distribution'
    });
  }
});

module.exports = router;