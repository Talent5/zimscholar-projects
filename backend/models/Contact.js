import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
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
  message: {
    type: String,
    required: [true, 'Message is required']
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'closed'],
    default: 'new'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
contactSchema.index({ email: 1, submittedAt: -1 });
contactSchema.index({ status: 1 });

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
