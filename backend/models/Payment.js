import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },
  projectName: String,
  
  amount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    min: 0
  },
  
  currency: {
    type: String,
    default: 'USD'
  },
  
  paymentType: {
    type: String,
    enum: ['deposit', 'milestone', 'final', 'full', 'other'],
    default: 'full'
  },
  
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'credit_card', 'debit_card', 'mobile_money', 'cash', 'paypal', 'crypto', 'check', 'other'],
    required: true
  },
  
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded', 'overdue'],
    default: 'pending'
  },
  
  dueDate: Date,
  paidDate: Date,
  
  transactionId: String,
  reference: String,
  
  notes: String,
  
  // Invoice details
  invoiceNumber: String,
  invoiceDate: Date
}, { 
  timestamps: true 
});

// Index for faster queries
paymentSchema.index({ customer: 1, status: 1 });
paymentSchema.index({ paidDate: 1 });
paymentSchema.index({ createdAt: -1 });

// Auto-generate invoice number
paymentSchema.pre('save', async function(next) {
  if (this.isNew && !this.invoiceNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Payment').countDocuments();
    this.invoiceNumber = `INV${year}${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Update customer revenue when payment is saved or updated
paymentSchema.post('save', async function(doc) {
  const Customer = mongoose.model('Customer');
  const customer = await Customer.findById(doc.customer);
  if (customer) {
    await customer.calculateRevenue();
  }
});

// Update customer revenue when payment is updated
paymentSchema.post('findOneAndUpdate', async function(doc) {
  if (doc) {
    const Customer = mongoose.model('Customer');
    const customer = await Customer.findById(doc.customer);
    if (customer) {
      await customer.calculateRevenue();
    }
  }
});

// Update customer revenue when payment is deleted
paymentSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    const Customer = mongoose.model('Customer');
    const customer = await Customer.findById(doc.customer);
    if (customer) {
      await customer.calculateRevenue();
    }
  }
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
