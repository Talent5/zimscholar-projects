import mongoose from 'mongoose';
import dotenv from 'dotenv';
import PricingPackage from './models/PricingPackage.js';

dotenv.config();

const PRICING_DATA = [
  {
    name: "Basic",
    price: "$50 - $100",
    description: "Perfect for simple prototypes or partial assistance.",
    features: [
      "Core Source Code",
      "Basic Documentation",
      "1 Revision Round",
      "3 Days Support",
      "No Setup Assistance"
    ],
    recommended: false,
    isActive: true,
    order: 1
  },
  {
    name: "Standard",
    price: "$120 - $200",
    description: "Most popular for final year diploma projects.",
    features: [
      "Complete Source Code",
      "Full Project Report (50+ pages)",
      "System Diagrams (UML)",
      "3 Revision Rounds",
      "Installation Guide",
      "Video Walkthrough"
    ],
    recommended: true,
    isActive: true,
    order: 2
  },
  {
    name: "Premium",
    price: "$250+",
    description: "For complex degree/honors projects requiring deep research.",
    features: [
      "Advanced Source Code",
      "Research-Grade Report",
      "Presentation Slides",
      "Unlimited Revisions",
      "Live Zoom Defense Prep",
      "Priority 24/7 Support"
    ],
    recommended: false,
    isActive: true,
    order: 3
  }
];

async function seedPricing() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Check if pricing already exists
    const existingCount = await PricingPackage.countDocuments();
    
    if (existingCount > 0) {
      console.log(`⚠ Found ${existingCount} existing pricing packages.`);
      console.log('Do you want to delete them and reseed? (This will remove all custom pricing)');
      console.log('Skipping seed. To force reseed, delete pricing packages manually from admin dashboard.');
      process.exit(0);
    }

    // Insert pricing packages
    console.log('📦 Inserting pricing packages...');
    const inserted = await PricingPackage.insertMany(PRICING_DATA);
    
    console.log(`✓ Successfully inserted ${inserted.length} pricing packages:`);
    inserted.forEach(pkg => {
      console.log(`  - ${pkg.name} (${pkg.price})`);
    });

    console.log('\n✅ Pricing data seeded successfully!');
    console.log('\nNext steps:');
    console.log('1. Start backend: cd backend && npm run dev');
    console.log('2. Start admin: cd admin && npm run dev');
    console.log('3. Go to http://localhost:5174 and login');
    console.log('4. Navigate to "Pricing" in the sidebar');
    console.log('5. Test the pricing management features');

  } catch (error) {
    console.error('❌ Error seeding pricing:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✓ Disconnected from MongoDB');
  }
}

seedPricing();
