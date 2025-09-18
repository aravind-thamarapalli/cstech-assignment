const express = require('express');
const Agent = require('../models/Agent');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/agents
// @desc    Create a new agent
// @access  Protected (Admin only)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Basic validation
    if (!name || !email || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, mobile, password'
      });
    }

    // Check if agent already exists with this email
    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      return res.status(400).json({
        success: false,
        message: 'Agent with this email already exists'
      });
    }

    // Create new agent
    const agent = new Agent({
      name,
      email,
      mobile,
      password
    });

    await agent.save();

    // Return agent without password
    const agentResponse = {
      id: agent._id,
      name: agent.name,
      email: agent.email,
      mobile: agent.mobile,
      createdAt: agent.createdAt
    };

    res.status(201).json({
      success: true,
      message: 'Agent created successfully',
      agent: agentResponse
    });

  } catch (error) {
    console.error('Create agent error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    // Handle duplicate key error (email)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Agent with this email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating agent'
    });
  }
});

// @route   GET /api/agents
// @desc    Get all agents
// @access  Protected (Admin only)
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    // Get all agents excluding password field
    const agents = await Agent.find({}).select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: agents.length,
      agents
    });

  } catch (error) {
    console.error('Get agents error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching agents'
    });
  }
});

// @route   GET /api/agents/:id
// @desc    Get single agent by ID
// @access  Protected (Admin only)
router.get('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id).select('-password');

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    res.json({
      success: true,
      agent
    });

  } catch (error) {
    console.error('Get agent error:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid agent ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching agent'
    });
  }
});

// @route   PUT /api/agents/:id
// @desc    Update agent
// @access  Protected (Admin only)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, email, mobile } = req.body;

    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    // Update fields if provided
    if (name) agent.name = name;
    if (email) agent.email = email;
    if (mobile) agent.mobile = mobile;

    await agent.save();

    // Return updated agent without password
    const agentResponse = {
      id: agent._id,
      name: agent.name,
      email: agent.email,
      mobile: agent.mobile,
      createdAt: agent.createdAt,
      updatedAt: agent.updatedAt
    };

    res.json({
      success: true,
      message: 'Agent updated successfully',
      agent: agentResponse
    });

  } catch (error) {
    console.error('Update agent error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Agent with this email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating agent'
    });
  }
});

// @route   DELETE /api/agents/:id
// @desc    Delete agent
// @access  Protected (Admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    await Agent.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Agent deleted successfully'
    });

  } catch (error) {
    console.error('Delete agent error:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid agent ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while deleting agent'
    });
  }
});

module.exports = router;