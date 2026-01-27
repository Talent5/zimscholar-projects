import mongoose from 'mongoose';

const pricingPackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  features: [{
    type: String,
    required: true
  }],
  recommended: {
    type: Boolean,
    default: false
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

// Ensure only one package can be recommended at a time
pricingPackageSchema.pre('save', async function(next) {
  if (this.recommended && this.isModified('recommended')) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id }, recommended: true },
      { $set: { recommended: false } }
    );
  }
  next();
});

const PricingPackage = mongoose.model('PricingPackage', pricingPackageSchema);

export default PricingPackage;
