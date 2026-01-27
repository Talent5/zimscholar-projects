import mongoose from 'mongoose';

const quoteRequestSchema = new mongoose.Schema({
  // Personal Information
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
  
  // Project Details
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
      'Other'
    ]
  },
  packageTier: {
    type: String,
    enum: [
      'Basic - Simple project with minimal support',
      'Standard - Mid-range project with consultation',
      'Premium - Complex project with full support',
      ''
    ]
  },
  deadline: {
    type: Date
  },
  budget: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Project description is required']
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'quoted', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  },
  quotedPrice: {
    type: Number
  },
  notes: {
    type: String
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  
  // Quotation Details
  quotation: {
    quotationNumber: String,
    dateIssued: Date,
    validUntil: Date,
    lineItems: [{
      description: String,
      quantity: Number,
      unitPrice: Number
    }],
    discount: Number,
    discountType: {
      type: String,
      enum: ['percentage', 'fixed']
    },
    taxRate: Number,
    paymentTerms: String,
    quotationNotes: String,
    pdfPath: String,
    sentAt: Date
  }
}, {
  timestamps: true
});

// Indexes for faster queries
quoteRequestSchema.index({ email: 1, submittedAt: -1 });
quoteRequestSchema.index({ status: 1 });
quoteRequestSchema.index({ projectType: 1 });

const QuoteRequest = mongoose.model('QuoteRequest', quoteRequestSchema);

export default QuoteRequest;
