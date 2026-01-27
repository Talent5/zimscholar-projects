import mongoose from 'mongoose';

const projectRequestSchema = new mongoose.Schema({
  // Student Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  university: {
    type: String,
    required: [true, 'University is required'],
    trim: true
  },
  course: {
    type: String,
    required: [true, 'Course is required'],
    trim: true
  },
  
  // Project Selection
  projectCategory: {
    type: String,
    required: [true, 'Project category is required'],
    enum: ['ready-made', 'custom']
  },
  projectType: {
    type: String,
    required: [true, 'Project type is required'],
    enum: [
      'Data Science',
      'Machine Learning',
      'Software Engineering',
      'IoT (Internet of Things)',
      'Mobile App Development',
      'Web Development',
      'Database Systems',
      'Network Security',
      'AI & Neural Networks',
      'Computer Vision',
      'Other'
    ]
  },
  
  // Ready-made project fields
  projectId: {
    type: String,
    trim: true
  },
  
  // Custom project fields
  customRequirements: {
    type: String
  },
  
  deadline: {
    type: Date
  },
  additionalNotes: {
    type: String
  },
  
  // Status and tracking
  status: {
    type: String,
    enum: ['new', 'in-progress', 'delivered', 'completed', 'cancelled'],
    default: 'new'
  },
  assignedTo: {
    type: String
  },
  price: {
    type: Number
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'partial', 'paid'],
    default: 'unpaid'
  },
  deliveryDate: {
    type: Date
  },
  adminNotes: {
    type: String
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for faster queries
projectRequestSchema.index({ email: 1, submittedAt: -1 });
projectRequestSchema.index({ status: 1 });
projectRequestSchema.index({ projectCategory: 1, projectType: 1 });
projectRequestSchema.index({ projectId: 1 });

const ProjectRequest = mongoose.model('ProjectRequest', projectRequestSchema);

export default ProjectRequest;
