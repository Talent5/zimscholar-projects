// Seed script for Customer and Payment data
// Run with: node backend/seedCustomers.js

const mongoose = require('mongoose');
require('dotenv').config();

const Customer = require('./models/Customer');
const Payment = require('./models/Payment');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/scholarxafrica';

const sampleCustomers = [
  {
    name: 'John Doe',
    email: 'john.doe@university.edu',
    phone: '+263771234567',
    university: 'University of Zimbabwe',
    status: 'active',
    outstandingBalance: 500,
    projects: [
      {
        title: 'Student Portal System',
        description: 'Complete web-based student management portal with authentication, course registration, and grade tracking',
        status: 'in-progress',
        stage: 'development',
        progress: 65,
        budget: 3500,
        actualCost: 2100,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-03-31'),
        milestones: [
          {
            title: 'Requirements & Design',
            description: 'Complete requirements gathering and UI/UX design',
            dueDate: new Date('2025-01-15'),
            completed: true,
            completedDate: new Date('2025-01-14')
          },
          {
            title: 'Backend API Development',
            description: 'Build REST APIs and database schema',
            dueDate: new Date('2025-02-15'),
            completed: true,
            completedDate: new Date('2025-02-10')
          },
          {
            title: 'Frontend Development',
            description: 'Build React frontend with all features',
            dueDate: new Date('2025-03-15'),
            completed: false
          }
        ]
      }
    ]
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah.j@college.ac.zw',
    phone: '+263782345678',
    university: 'Midlands State University',
    status: 'vip',
    outstandingBalance: 0,
    projects: [
      {
        title: 'E-Commerce Platform',
        description: 'Full-featured online store with payment integration',
        status: 'completed',
        stage: 'maintenance',
        progress: 100,
        budget: 5000,
        actualCost: 4800,
        startDate: new Date('2024-10-01'),
        endDate: new Date('2024-12-31'),
        milestones: [
          {
            title: 'Project Completion',
            description: 'All features implemented and tested',
            dueDate: new Date('2024-12-31'),
            completed: true,
            completedDate: new Date('2024-12-28')
          }
        ]
      },
      {
        title: 'Mobile App Development',
        description: 'React Native mobile app for the e-commerce platform',
        status: 'accepted',
        stage: 'requirements',
        progress: 10,
        budget: 4000,
        actualCost: 0,
        startDate: new Date('2025-02-01'),
        endDate: new Date('2025-05-31')
      }
    ]
  },
  {
    name: 'Michael Brown',
    email: 'mbrown@tech.co.zw',
    phone: '+263773456789',
    university: 'Harare Institute of Technology',
    status: 'active',
    outstandingBalance: 1200,
    projects: [
      {
        title: 'Inventory Management System',
        description: 'Track inventory, sales, and generate reports',
        status: 'review',
        stage: 'testing',
        progress: 85,
        budget: 2800,
        actualCost: 2400,
        startDate: new Date('2024-12-01'),
        endDate: new Date('2025-02-28'),
        milestones: [
          {
            title: 'Beta Testing',
            description: 'User acceptance testing in progress',
            dueDate: new Date('2025-02-15'),
            completed: false
          }
        ]
      }
    ]
  },
  {
    name: 'Emily Davis',
    email: 'emily.davis@startup.com',
    phone: '+263784567890',
    status: 'lead',
    outstandingBalance: 0,
    projects: [
      {
        title: 'Company Website',
        description: 'Modern responsive website with CMS',
        status: 'quotation-sent',
        stage: 'requirements',
        progress: 0,
        budget: 1500,
        actualCost: 0,
        startDate: new Date('2025-02-15'),
        endDate: new Date('2025-03-15')
      }
    ]
  },
  {
    name: 'David Wilson',
    email: 'dwilson@enterprise.co.zw',
    phone: '+263775678901',
    university: 'National University of Science and Technology',
    status: 'vip',
    outstandingBalance: 0,
    projects: [
      {
        title: 'ERP System - Phase 1',
        description: 'HR and Payroll modules',
        status: 'delivered',
        stage: 'deployment',
        progress: 100,
        budget: 8000,
        actualCost: 7800,
        startDate: new Date('2024-08-01'),
        endDate: new Date('2024-11-30'),
        milestones: [
          {
            title: 'Deployment Complete',
            description: 'System live in production',
            dueDate: new Date('2024-11-30'),
            completed: true,
            completedDate: new Date('2024-11-28')
          }
        ]
      },
      {
        title: 'ERP System - Phase 2',
        description: 'Finance and Accounting modules',
        status: 'in-progress',
        stage: 'design',
        progress: 30,
        budget: 9000,
        actualCost: 2000,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-06-30')
      }
    ]
  }
];

const samplePayments = [
  // John Doe payments
  {
    customerEmail: 'john.doe@university.edu',
    amount: 1500,
    currency: 'USD',
    paymentType: 'deposit',
    paymentMethod: 'bank_transfer',
    status: 'completed',
    paidDate: new Date('2025-01-05'),
    notes: 'Initial deposit for Student Portal project'
  },
  {
    customerEmail: 'john.doe@university.edu',
    amount: 1000,
    currency: 'USD',
    paymentType: 'milestone',
    paymentMethod: 'bank_transfer',
    status: 'completed',
    paidDate: new Date('2025-02-12'),
    notes: 'Payment for backend completion milestone'
  },
  {
    customerEmail: 'john.doe@university.edu',
    amount: 1000,
    currency: 'USD',
    paymentType: 'final',
    paymentMethod: 'bank_transfer',
    status: 'pending',
    dueDate: new Date('2025-04-05'),
    notes: 'Final payment upon project delivery'
  },
  
  // Sarah Johnson payments
  {
    customerEmail: 'sarah.j@college.ac.zw',
    amount: 2500,
    currency: 'USD',
    paymentType: 'deposit',
    paymentMethod: 'credit_card',
    status: 'completed',
    paidDate: new Date('2024-10-05'),
    notes: 'E-Commerce project deposit'
  },
  {
    customerEmail: 'sarah.j@college.ac.zw',
    amount: 2500,
    currency: 'USD',
    paymentType: 'final',
    paymentMethod: 'credit_card',
    status: 'completed',
    paidDate: new Date('2024-12-30'),
    notes: 'E-Commerce final payment'
  },
  {
    customerEmail: 'sarah.j@college.ac.zw',
    amount: 1000,
    currency: 'USD',
    paymentType: 'deposit',
    paymentMethod: 'mobile_money',
    status: 'completed',
    paidDate: new Date('2025-01-20'),
    notes: 'Mobile app project deposit'
  },
  
  // Michael Brown payments
  {
    customerEmail: 'mbrown@tech.co.zw',
    amount: 1400,
    currency: 'USD',
    paymentType: 'deposit',
    paymentMethod: 'bank_transfer',
    status: 'completed',
    paidDate: new Date('2024-12-05'),
    notes: 'Inventory system deposit'
  },
  {
    customerEmail: 'mbrown@tech.co.zw',
    amount: 1400,
    currency: 'USD',
    paymentType: 'milestone',
    paymentMethod: 'bank_transfer',
    status: 'pending',
    dueDate: new Date('2025-02-20'),
    notes: 'Payment upon testing completion'
  },
  
  // David Wilson payments
  {
    customerEmail: 'dwilson@enterprise.co.zw',
    amount: 4000,
    currency: 'USD',
    paymentType: 'deposit',
    paymentMethod: 'bank_transfer',
    status: 'completed',
    paidDate: new Date('2024-08-10'),
    notes: 'ERP Phase 1 - Initial payment'
  },
  {
    customerEmail: 'dwilson@enterprise.co.zw',
    amount: 4000,
    currency: 'USD',
    paymentType: 'final',
    paymentMethod: 'bank_transfer',
    status: 'completed',
    paidDate: new Date('2024-12-01'),
    notes: 'ERP Phase 1 - Final payment'
  },
  {
    customerEmail: 'dwilson@enterprise.co.zw',
    amount: 4500,
    currency: 'USD',
    paymentType: 'deposit',
    paymentMethod: 'bank_transfer',
    status: 'completed',
    paidDate: new Date('2025-01-10'),
    notes: 'ERP Phase 2 - Deposit'
  }
];

async function seedData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Clear existing data
    console.log('\nClearing existing customer and payment data...');
    await Customer.deleteMany({});
    await Payment.deleteMany({});
    console.log('✓ Cleared existing data');

    // Insert customers
    console.log('\nInserting sample customers...');
    const insertedCustomers = await Customer.insertMany(sampleCustomers);
    console.log(`✓ Inserted ${insertedCustomers.length} customers`);

    // Create a map of email to customer ID
    const customerMap = {};
    insertedCustomers.forEach(customer => {
      customerMap[customer.email] = customer._id;
    });

    // Insert payments with correct customer references
    console.log('\nInserting sample payments...');
    const paymentsToInsert = samplePayments.map(payment => ({
      ...payment,
      customer: customerMap[payment.customerEmail]
    }));

    const insertedPayments = await Payment.insertMany(paymentsToInsert);
    console.log(`✓ Inserted ${insertedPayments.length} payments`);

    // Update customer revenues
    console.log('\nUpdating customer revenues...');
    for (const customer of insertedCustomers) {
      await customer.calculateRevenue();
    }
    console.log('✓ Updated customer revenues');

    // Display summary
    console.log('\n========================================');
    console.log('SEED DATA SUMMARY');
    console.log('========================================');
    
    const customers = await Customer.find({});
    for (const customer of customers) {
      console.log(`\n${customer.name} (${customer.status.toUpperCase()})`);
      console.log(`  Email: ${customer.email}`);
      console.log(`  Projects: ${customer.projectCount}`);
      console.log(`  Total Revenue: $${customer.totalRevenue.toFixed(2)}`);
      console.log(`  Outstanding: $${customer.outstandingBalance.toFixed(2)}`);
    }

    console.log('\n========================================');
    console.log('✓ Seeding completed successfully!');
    console.log('========================================\n');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

// Run the seed function
seedData();
