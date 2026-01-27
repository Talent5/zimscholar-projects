import { 
  Cpu, 
  Database, 
  Code, 
  BarChart, 
  Layers, 
  Zap 
} from 'lucide-react';
import { ServiceItem, ProjectItem, PricingTier, Testimonial, FaqItem } from './types';

export const SERVICES: ServiceItem[] = [
  {
    title: "Data Science & AI",
    description: "From data cleaning to complex ML models. We handle Python, R, Jupyter Notebooks, and comprehensive analysis reports.",
    icon: Database,
    features: ["Machine Learning Models", "Data Visualization", "Deep Learning", "Thesis Analysis"]
  },
  {
    title: "IoT Systems",
    description: "Hardware and software integration. Arduino, Raspberry Pi, ESP32, and cloud connectivity prototyping.",
    icon: Cpu,
    features: ["Circuit Design", "Embedded Code", "Smart Home Systems", "IoT Dashboards"]
  },
  {
    title: "Software Engineering",
    description: "Full-stack web and mobile applications tailored to your specific requirements using modern tech stacks.",
    icon: Code,
    features: ["Web Applications", "Mobile Apps (Flutter/React)", "System Design", "API Development"]
  }
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 1,
    title: "AgriTech Crop Disease Detection",
    category: "Machine Learning",
    image: "https://picsum.photos/seed/agritech/600/400",
    description: "A Python-based deep learning model identifying crop diseases from leaf images with 95% accuracy.",
    isReadyMade: true
  },
  {
    id: 2,
    title: "Smart Home Energy Monitor",
    category: "IoT",
    image: "https://picsum.photos/seed/iotenergy/600/400",
    description: "IoT system using ESP32 to monitor real-time energy usage, displayed on a React dashboard.",
    isReadyMade: true
  },
  {
    id: 3,
    title: "University Portal System",
    category: "Software Dev",
    image: "https://picsum.photos/seed/uniportal/600/400",
    description: "Comprehensive student management system built with Node.js and React.",
    isReadyMade: false
  },
  {
    id: 4,
    title: "Traffic Density Analysis",
    category: "Data Science",
    image: "https://picsum.photos/seed/traffic/600/400",
    description: "Analysis of traffic patterns in Harare using historical data and predictive modeling.",
    isReadyMade: true
  }
];

export const PRICING_TIERS: PricingTier[] = [
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
    ]
  },
  {
    name: "Standard",
    price: "$120 - $200",
    description: "Most popular for final year diploma projects.",
    recommended: true,
    features: [
      "Complete Source Code",
      "Full Project Report (50+ pages)",
      "System Diagrams (UML)",
      "3 Revision Rounds",
      "Installation Guide",
      "Video Walkthrough"
    ]
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
    ]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Tinashe M.",
    role: "BSc Computer Science",
    institution: "Harare Institute of Technology",
    content: "The IoT project I got was well-documented and helped me understand every step. Got an A! Highly recommended."
  },
  {
    id: 2,
    name: "Sarah K.",
    role: "Diploma in IT",
    institution: "Polytechnic",
    content: "I was stuck on my Python code for weeks. The team here fixed it in 2 days and explained where I went wrong."
  },
  {
    id: 3,
    name: "Blessing C.",
    role: "Data Analytics Student",
    institution: "NUST",
    content: "Professional and fast. The ready-made project saved me so much time, and I could customize it easily."
  }
];

export const FAQS: FaqItem[] = [
  {
    question: "Is this service legal/allowed?",
    answer: "Yes, our service provides educational assistance and reference materials. We act as professional tutors/consultants. It is your responsibility to use the materials ethically as a study aid or starting point, in accordance with your institution's academic integrity policies."
  },
  {
    question: "Are the projects plagiarism-free?",
    answer: "Absolutely. All custom projects are built from scratch. For ready-made projects, we ensure uniqueness in code structure and provide guidance on how to customize the documentation to make it your own."
  },
  {
    question: "How long does a custom project take?",
    answer: "Simple projects can be done in roughly 1 week. Complex engineering or research projects typically take 3-4 weeks. We recommend starting early!"
  },
  {
    question: "How do I pay?",
    answer: "We accept EcoCash, Zipit, USD Cash (local), and international transfers for students outside Zimbabwe. Payment is typically split: 50% deposit to start, 50% upon completion."
  }
];