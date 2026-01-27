import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from './models/Service.js';

dotenv.config();

const SERVICES_DATA = [
  {
    title: "Machine Learning Projects",
    slug: "machine-learning-projects",
    description: "Advanced machine learning solutions including supervised, unsupervised, and deep learning projects tailored for academic excellence.",
    icon: "brain",
    features: [
      "Custom ML model development",
      "Dataset preprocessing and analysis",
      "Model training and optimization",
      "Comprehensive documentation",
      "Performance evaluation reports",
      "Source code with comments"
    ],
    category: "Machine Learning",
    pricing: {
      basic: 150,
      standard: 280,
      premium: 450
    },
    isActive: true,
    order: 1
  },
  {
    title: "Data Science & Analytics",
    slug: "data-science-analytics",
    description: "Complete data science projects with statistical analysis, data visualization, and predictive modeling for your academic research.",
    icon: "bar-chart",
    features: [
      "Statistical data analysis",
      "Interactive visualizations",
      "Predictive modeling",
      "Jupyter notebooks included",
      "Professional reports",
      "Data cleaning pipelines"
    ],
    category: "Data Science",
    pricing: {
      basic: 120,
      standard: 220,
      premium: 380
    },
    isActive: true,
    order: 2
  },
  {
    title: "Web Application Development",
    slug: "web-application-development",
    description: "Full-stack web applications using modern frameworks like React, Node.js, and databases for your final year project.",
    icon: "globe",
    features: [
      "Responsive UI design",
      "RESTful API development",
      "Database integration",
      "User authentication",
      "Deployment ready code",
      "Admin dashboard included"
    ],
    category: "Software Engineering",
    pricing: {
      basic: 180,
      standard: 320,
      premium: 520
    },
    isActive: true,
    order: 3
  },
  {
    title: "Mobile App Development",
    slug: "mobile-app-development",
    description: "Native and cross-platform mobile applications for Android and iOS using React Native, Flutter, or native development.",
    icon: "smartphone",
    features: [
      "Cross-platform development",
      "Native performance",
      "Backend integration",
      "Push notifications",
      "Offline functionality",
      "App store deployment guide"
    ],
    category: "Software Engineering",
    pricing: {
      basic: 200,
      standard: 380,
      premium: 600
    },
    isActive: true,
    order: 4
  },
  {
    title: "IoT & Embedded Systems",
    slug: "iot-embedded-systems",
    description: "Internet of Things projects with sensor integration, data collection, and real-time monitoring systems for smart solutions.",
    icon: "cpu",
    features: [
      "Hardware integration",
      "Sensor data collection",
      "Real-time monitoring",
      "Cloud connectivity",
      "Mobile app interface",
      "Circuit diagrams included"
    ],
    category: "IoT",
    pricing: {
      basic: 160,
      standard: 300,
      premium: 480
    },
    isActive: true,
    order: 5
  },
  {
    title: "Computer Vision Projects",
    slug: "computer-vision-projects",
    description: "Image and video processing projects including object detection, facial recognition, and image classification systems.",
    icon: "eye",
    features: [
      "Object detection models",
      "Image classification",
      "Real-time video processing",
      "Pretrained model integration",
      "Custom dataset training",
      "Performance benchmarks"
    ],
    category: "Machine Learning",
    pricing: {
      basic: 170,
      standard: 310,
      premium: 500
    },
    isActive: true,
    order: 6
  },
  {
    title: "Natural Language Processing",
    slug: "natural-language-processing",
    description: "NLP projects including text analysis, sentiment analysis, chatbots, and language translation systems.",
    icon: "message-square",
    features: [
      "Sentiment analysis",
      "Text classification",
      "Named entity recognition",
      "Chatbot development",
      "Language models",
      "API integration"
    ],
    category: "Machine Learning",
    pricing: {
      basic: 140,
      standard: 260,
      premium: 420
    },
    isActive: true,
    order: 7
  },
  {
    title: "Database Management Systems",
    slug: "database-management-systems",
    description: "Comprehensive database solutions with design, implementation, and optimization for academic and commercial applications.",
    icon: "database",
    features: [
      "Database design (ERD)",
      "SQL queries optimization",
      "Stored procedures",
      "Backup and recovery",
      "Performance tuning",
      "Security implementation"
    ],
    category: "Software Engineering",
    pricing: {
      basic: 100,
      standard: 190,
      premium: 320
    },
    isActive: true,
    order: 8
  },
  {
    title: "Blockchain & Cryptocurrency",
    slug: "blockchain-cryptocurrency",
    description: "Blockchain-based applications including smart contracts, cryptocurrency wallets, and decentralized applications (DApps).",
    icon: "link",
    features: [
      "Smart contract development",
      "DApp creation",
      "Wallet integration",
      "Ethereum/Solidity",
      "Token creation",
      "Security auditing"
    ],
    category: "Software Engineering",
    pricing: {
      basic: 220,
      standard: 400,
      premium: 650
    },
    isActive: true,
    order: 9
  },
  {
    title: "Cybersecurity Projects",
    slug: "cybersecurity-projects",
    description: "Security-focused projects including penetration testing, vulnerability assessment, and secure application development.",
    icon: "shield",
    features: [
      "Vulnerability scanning",
      "Penetration testing",
      "Encryption implementation",
      "Security protocols",
      "Ethical hacking demos",
      "Security audit reports"
    ],
    category: "Software Engineering",
    pricing: {
      basic: 180,
      standard: 330,
      premium: 540
    },
    isActive: true,
    order: 10
  },
  {
    title: "Cloud Computing Solutions",
    slug: "cloud-computing-solutions",
    description: "Cloud-based applications and infrastructure projects using AWS, Azure, or Google Cloud Platform.",
    icon: "cloud",
    features: [
      "Cloud architecture design",
      "Serverless applications",
      "Container orchestration",
      "Auto-scaling setup",
      "Cost optimization",
      "Deployment automation"
    ],
    category: "Software Engineering",
    pricing: {
      basic: 190,
      standard: 350,
      premium: 560
    },
    isActive: true,
    order: 11
  },
  {
    title: "Game Development",
    slug: "game-development",
    description: "2D and 3D game development projects using Unity, Unreal Engine, or web-based game engines.",
    icon: "gamepad",
    features: [
      "2D/3D game mechanics",
      "Character design",
      "Physics integration",
      "Level design",
      "Sound effects",
      "Multiplayer functionality"
    ],
    category: "Software Engineering",
    pricing: {
      basic: 210,
      standard: 390,
      premium: 620
    },
    isActive: true,
    order: 12
  },
  {
    title: "Recommendation Systems",
    slug: "recommendation-systems",
    description: "Intelligent recommendation engines using collaborative filtering, content-based filtering, and hybrid approaches.",
    icon: "star",
    features: [
      "Collaborative filtering",
      "Content-based recommendations",
      "Hybrid systems",
      "User preference analysis",
      "Real-time recommendations",
      "A/B testing framework"
    ],
    category: "Machine Learning",
    pricing: {
      basic: 160,
      standard: 290,
      premium: 470
    },
    isActive: true,
    order: 13
  },
  {
    title: "Time Series Forecasting",
    slug: "time-series-forecasting",
    description: "Predictive models for time series data including stock prediction, weather forecasting, and sales prediction.",
    icon: "trending-up",
    features: [
      "ARIMA models",
      "LSTM networks",
      "Prophet forecasting",
      "Seasonal decomposition",
      "Anomaly detection",
      "Visualization dashboards"
    ],
    category: "Data Science",
    pricing: {
      basic: 140,
      standard: 270,
      premium: 440
    },
    isActive: true,
    order: 14
  },
  {
    title: "E-commerce Platforms",
    slug: "ecommerce-platforms",
    description: "Complete e-commerce solutions with shopping cart, payment integration, and inventory management.",
    icon: "shopping-cart",
    features: [
      "Product catalog",
      "Shopping cart system",
      "Payment gateway integration",
      "Order management",
      "Inventory tracking",
      "Customer reviews"
    ],
    category: "Software Engineering",
    pricing: {
      basic: 200,
      standard: 370,
      premium: 590
    },
    isActive: true,
    order: 15
  }
];

async function seedServices() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Check if services already exist
    const existingCount = await Service.countDocuments();
    
    if (existingCount > 0) {
      console.log(`⚠ Found ${existingCount} existing services.`);
      console.log('Do you want to delete them and reseed? (y/n)');
      console.log('Skipping seed. To force reseed, delete services manually from admin dashboard or run with --force flag.');
      
      // Check for --force flag
      if (process.argv.includes('--force')) {
        console.log('🗑️  Force flag detected. Deleting existing services...');
        await Service.deleteMany({});
        console.log('✓ Existing services deleted');
      } else {
        process.exit(0);
      }
    }

    // Insert services
    console.log('📦 Inserting services...');
    const inserted = await Service.insertMany(SERVICES_DATA);
    
    console.log(`\n✓ Successfully inserted ${inserted.length} services:`);
    inserted.forEach(service => {
      console.log(`  - ${service.title} (${service.category})`);
    });

    console.log('\n✅ Services data seeded successfully!');
    console.log('\nService Categories Summary:');
    const categories = {};
    inserted.forEach(service => {
      categories[service.category] = (categories[service.category] || 0) + 1;
    });
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`  - ${category}: ${count} service(s)`);
    });

    console.log('\n📊 Pricing Range:');
    const prices = inserted.map(s => s.pricing);
    console.log(`  - Basic: $${Math.min(...prices.map(p => p.basic))} - $${Math.max(...prices.map(p => p.basic))}`);
    console.log(`  - Standard: $${Math.min(...prices.map(p => p.standard))} - $${Math.max(...prices.map(p => p.standard))}`);
    console.log(`  - Premium: $${Math.min(...prices.map(p => p.premium))} - $${Math.max(...prices.map(p => p.premium))}`);

    console.log('\nNext steps:');
    console.log('1. Start backend: cd backend && npm run dev');
    console.log('2. Start admin: cd admin && npm run dev');
    console.log('3. Go to http://localhost:5174 and login');
    console.log('4. Navigate to "Services" in the sidebar');
    console.log('5. Test the services management features');
    console.log('\n💡 To reseed, run: node seedServices.js --force');

  } catch (error) {
    console.error('❌ Error seeding services:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n✓ Disconnected from MongoDB');
  }
}

seedServices();
