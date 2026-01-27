import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Service title is required'],
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
  icon: {
    type: String,
    default: ''
  },
  features: [{
    type: String
  }],
  category: {
    type: String,
    enum: ['Data Science', 'Machine Learning', 'Software Engineering', 'IoT', 'Other'],
    required: true
  },
  pricing: {
    basic: { type: Number },
    standard: { type: Number },
    premium: { type: Number }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

serviceSchema.index({ isActive: 1, order: 1 });

const Service = mongoose.model('Service', serviceSchema);

export default Service;
