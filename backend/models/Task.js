const mongoose = require('mongoose');

// Task Schema
const taskSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    validate: {
      validator: function(v) {
        // Basic phone number validation - can be customized based on requirements
        return /^[\+]?[0-9\s\-\(\)]{7,15}$/.test(v);
      },
      message: 'Please enter a valid phone number'
    }
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters'],
    default: ''
  },
  assignedAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent',
    required: [true, 'Assigned agent is required']
  }
}, {
  timestamps: true
});

// Index for efficient querying by agent
taskSchema.index({ assignedAgent: 1 });

module.exports = mongoose.model('Task', taskSchema);