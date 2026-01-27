import mongoose from 'mongoose';

const portfolioProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  category: {
    type: String,
    enum: [
      'Data Science',
      'Machine Learning',
      'Software Engineering',
      'IoT',
      'Web Development',
      'Mobile App',
      'Database',
      'AI',
      'Other'
    ],
    required: true
  },
  projectType: {
    type: String,
    enum: ['ready-made', 'custom-showcase'],
    default: 'ready-made'
  },
  projectId: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  thumbnail: {
    type: String,
    default: ''
  },
  videoUrl: {
    type: String,
    default: ''
  },
  images: [{
    type: String
  }],
  technologies: [{
    type: String
  }],
  features: [{
    type: String
  }],
  // For ready-made projects
  price: {
    type: Number
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  downloadUrl: {
    type: String
  },
  demoUrl: {
    type: String
  },
  // GitHub repository
  githubRepo: {
    type: String,
    trim: true
  },
  // Project files (legacy - kept for backward compatibility)
  files: [{
    name: String,
    path: String,
    size: Number,
    type: String
  }],
  // Metadata
  university: {
    type: String
  },
  yearCompleted: {
    type: Number
  },
  grade: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  viewCount: {
    type: Number,
    default: 0
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

portfolioProjectSchema.index({ category: 1, isActive: 1 });
portfolioProjectSchema.index({ isFeatured: 1, order: 1 });

const PortfolioProject = mongoose.model('PortfolioProject', portfolioProjectSchema);

export default PortfolioProject;
