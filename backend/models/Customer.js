import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  status: {
    type: String,
    enum: ['inquiry', 'quotation-sent', 'accepted', 'in-progress', 'review', 'completed', 'delivered', 'cancelled'],
    default: 'inquiry'
  },
  stage: {
    type: String,
    enum: ['requirements', 'design', 'development', 'testing', 'deployment', 'maintenance'],
    default: 'requirements'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  budget: {
    type: Number,
    default: 0
  },
  actualCost: {
    type: Number,
    default: 0
  },
  startDate: Date,
  endDate: Date,
  milestones: [{
    title: String,
    description: String,
    dueDate: Date,
    completed: {
      type: Boolean,
      default: false
    },
    completedDate: Date
  }]
}, { timestamps: true });

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  university: String,
  course: String,
  
  // Customer status
  status: {
    type: String,
    enum: ['lead', 'active', 'inactive', 'vip'],
    default: 'lead'
  },
  
  // Projects
  projects: [projectSchema],
  
  // Financial tracking
  totalRevenue: {
    type: Number,
    default: 0
  },
  outstandingBalance: {
    type: Number,
    default: 0
  },
  
  // Communication
  notes: String,
  tags: [String],
  
  // Metadata
  source: {
    type: String,
    enum: ['website', 'phone', 'email', 'whatsapp', 'referral', 'social_media', 'walk_in', 'other'],
    default: 'website'
  },
  lastContactDate: Date
}, { 
  timestamps: true 
});

// Virtual for total projects
customerSchema.virtual('projectCount').get(function() {
  return this.projects ? this.projects.length : 0;
});

// Virtual for active projects
customerSchema.virtual('activeProjects').get(function() {
  return this.projects ? this.projects.filter(p => 
    ['accepted', 'in-progress', 'review'].includes(p.status)
  ).length : 0;
});

// Method to update total revenue from completed payments in the database
customerSchema.methods.calculateRevenue = async function() {
  const Payment = mongoose.model('Payment');
  
  // Get all completed payments for this customer from database
  const completedPayments = await Payment.find({ 
    customer: this._id, 
    status: 'completed' 
  });
  
  // Calculate total revenue from completed payments
  this.totalRevenue = completedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  
  // Get all pending/overdue payments from database
  const pendingPayments = await Payment.find({ 
    customer: this._id, 
    status: { $in: ['pending', 'overdue'] }
  });
  
  // Calculate outstanding balance from pending payments
  this.outstandingBalance = pendingPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  
  // Calculate total charged from all projects
  const totalCharged = this.projects.reduce((sum, p) => sum + (p.budget || 0), 0);
  
  // Update outstanding balance based on what hasn't been paid yet
  const actualOutstanding = totalCharged - this.totalRevenue;
  this.outstandingBalance = Math.max(0, actualOutstanding);
  
  await this.save();
};

// Ensure virtuals are included in JSON
customerSchema.set('toJSON', { virtuals: true });
customerSchema.set('toObject', { virtuals: true });

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;
