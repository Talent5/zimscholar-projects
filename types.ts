import { LucideIcon } from 'lucide-react';

export enum Page {
  HOME = 'HOME',
  SERVICES = 'SERVICES',
  PORTFOLIO = 'PORTFOLIO',
  PRICING = 'PRICING',
  ABOUT = 'ABOUT',
  FAQ = 'FAQ',
  CONTACT = 'CONTACT'
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
}

export interface ProjectItem {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  isReadyMade: boolean;
}

export interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  institution: string;
  content: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}