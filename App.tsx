import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Menu, X } from 'lucide-react';
import { Button } from './components/Button';
import { WhatsAppFloat } from './components/WhatsAppFloat';
import { Footer } from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import PortfolioPage from './pages/PortfolioPage';
import PortfolioDetailPage from './pages/PortfolioDetailPage';
import PricingPage from './pages/PricingPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import QuotePage from './pages/QuotePage';
import ProjectRequestPage from './pages/ProjectRequestPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const NavLink = ({ to, label }: { to: string, label: string }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`font-medium transition-colors ${
          isActive ? 'text-brand-600' : 'text-slate-600 hover:text-brand-600'
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50 h-16 sm:h-20">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Link 
            to="/"
            className="flex items-center gap-2 group"
          >
            <img 
              src="/scholarxafrica-logo.png" 
              alt="ScholarXafrica Logo" 
              className="h-8 sm:h-10 w-auto"
            />
            <span className="text-xl sm:text-2xl font-black text-brand-700 tracking-tight group-hover:text-brand-600 transition-colors">
              ScholarXafrica<span className="text-accent-500">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" label="Home" />
            <NavLink to="/services" label="Services" />
            <NavLink to="/portfolio" label="Projects" />
            <NavLink to="/pricing" label="Pricing" />
            <NavLink to="/faq" label="FAQ" />
            <Link to="/project-request">
              <Button size="sm" variant="secondary">Request Project</Button>
            </Link>
            <Link to="/quote">
              <Button size="sm">Get Quote</Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-slate-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-slate-100 shadow-xl p-4 flex flex-col gap-4 animate-fadeIn">
            <Link to="/" className="text-left py-2 px-4 hover:bg-slate-50 rounded">Home</Link>
            <Link to="/services" className="text-left py-2 px-4 hover:bg-slate-50 rounded">Services</Link>
            <Link to="/portfolio" className="text-left py-2 px-4 hover:bg-slate-50 rounded">Projects</Link>
            <Link to="/pricing" className="text-left py-2 px-4 hover:bg-slate-50 rounded">Pricing</Link>
            <Link to="/faq" className="text-left py-2 px-4 hover:bg-slate-50 rounded">FAQ</Link>
            <Link to="/project-request" className="text-left py-2 px-4 text-purple-600 font-bold">Request Project</Link>
            <Link to="/quote" className="text-left py-2 px-4 text-brand-600 font-bold">Get Quote</Link>
            <Link to="/contact" className="text-left py-2 px-4 hover:bg-slate-50 rounded">Contact</Link>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow pt-16 sm:pt-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/portfolio/:slug" element={<PortfolioDetailPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/project-request" element={<ProjectRequestPage />} />
          <Route path="/quote" element={<QuotePage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <Router>
          <ScrollToTop />
          <AppContent />
        </Router>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;