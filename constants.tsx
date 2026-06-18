import { 
  Cpu, 
  Database, 
  Code, 
  BookOpen,
  FileText,
  BarChart, 
  Layers, 
  Zap 
} from 'lucide-react';
import { ServiceItem, ProjectItem, PricingTier, Testimonial, FaqItem } from './types';

export const SERVICES: ServiceItem[] = [
  {
    title: "Research Writing & Essays",
    description: "In-depth research papers, essays, and academic writing across all disciplines. Properly cited with APA, MLA, or Harvard referencing.",
    icon: FileText,
    features: ["Research Papers", "Literature Reviews", "Essay Writing", "Proper Referencing"]
  },
  {
    title: "Dissertations & Theses",
    description: "Full dissertation and thesis support from proposal to final chapter. Research methodology, data analysis, discussion, and conclusions.",
    icon: BookOpen,
    features: ["Full Dissertations", "Thesis Chapters", "Methodology Design", "Data Analysis"]
  },
  {
    title: "Data Science & AI",
    description: "From data cleaning to complex ML models. Python, R, Jupyter Notebooks, SPSS, Stata with comprehensive analysis reports.",
    icon: Database,
    features: ["Machine Learning", "Statistical Analysis", "Data Visualization", "SPSS & Stata"]
  },
  {
    title: "IoT & Engineering",
    description: "Hardware and software integration. Arduino, Raspberry Pi, ESP32, and cloud connectivity prototyping.",
    icon: Cpu,
    features: ["Circuit Design", "Embedded Code", "Smart Systems", "IoT Dashboards"]
  },
  {
    title: "Software Development",
    description: "Full-stack web and mobile applications tailored to your specific requirements using modern tech stacks.",
    icon: Code,
    features: ["Web Applications", "Mobile Apps", "System Design", "API Development"]
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
    question: "What academic disciplines do you cover?",
    answer: "All of them. We handle research papers, dissertations, proposals, essays, lab reports, and coursework across every discipline — Humanities, Social Sciences, Business, Law, Engineering, IT, Medicine, Natural Sciences, Education, and more. If it requires research and writing, we can help."
  },
  {
    question: "Do you check projects for AI-generated content?",
    answer: "Yes. Every project we deliver is scanned using AI detection tools (GPTZero, Turnitin AI detection, Originality.ai) before delivery. If any AI-generated passages are detected, we rewrite them to ensure your work reads naturally and passes all AI content detectors."
  },
  {
    question: "Is the work checked for plagiarism and Turnitin similarity?",
    answer: "Absolutely. We run every document through Turnitin similarity detection before delivery. We guarantee similarity scores well below your institution's threshold — typically under 10%. You receive the Turnitin report alongside your project for complete transparency."
  },
  {
    question: "What types of documents do you handle?",
    answer: "Everything: research papers, full dissertations and theses, research proposals, literature reviews, data analysis (SPSS, Stata, R, Python), lab reports, case studies, essays, problem sets, coursework assignments, and software/engineering projects. Any academic document, any level — undergraduate to PhD."
  },
  {
    question: "How do you remove AI-generated content from assignments?",
    answer: "We use advanced AI detection tools to identify machine-generated text, then manually rewrite flagged passages to sound authentically human while preserving the original meaning and academic rigor. This ensures your work passes all major AI detectors."
  },
  {
    question: "How long does a custom project take?",
    answer: "Simple papers and essays: 2–4 days. Research proposals and literature reviews: 5–7 days. Full dissertations and complex projects: 2–4 weeks. Every submission includes Turnitin checking and AI content review within the timeline."
  },
  {
    question: "How do I pay?",
    answer: "We accept EcoCash, Zipit, USD Cash (local), and international transfers for students outside Zimbabwe. Payment is typically split: 50% deposit to start, 50% upon completion. We also accept payments via Mukuru and WorldRemit for international students."
  }
];