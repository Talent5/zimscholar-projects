import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Menu, X, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
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
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left"
      style={{ scaleX: scrollYProgress, background: '#2b59d1' }}
    />
  );
}

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const pageTransition = { duration: 0.3, ease: [0.4, 0, 0.2, 1] };

function AppContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => setScrolled(latest > 20));
  useEffect(() => { setMobileMenuOpen(false); }, [location]);

  const NavLink = ({ to, label }: { to: string; label: string }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`relative font-medium text-sm tracking-wide transition-colors duration-300 py-1 ${
          isActive ? 'text-neon-cyan' : 'text-stone-500 hover:text-stone-800'
        }`}
      >
        {label}
        {isActive && (
          <motion.div
            layoutId="nav-underline"
            className="absolute -bottom-1 left-0 right-0 h-[2px] bg-neon-cyan rounded-full"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f6f3f1', color: '#242424' }}>
      <ScrollProgress />

      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass-heavy' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 sm:h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-neon-cyan flex items-center justify-center shadow-sm shadow-neon-cyan/20">
              <img src="/scholarxafrica-logo.png" alt="ScholarXafrica" className="h-5 w-auto brightness-0 invert" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-stone-800 group-hover:text-neon-cyan transition-colors duration-300">
                ScholarXafrica
              </span>
              <span className="hidden sm:block text-[10px] text-stone-400 uppercase tracking-[0.2em] leading-none">
                Academic Projects
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" label="Home" />
            <NavLink to="/services" label="Services" />
            <NavLink to="/portfolio" label="Projects" />
            <NavLink to="/pricing" label="Pricing" />
            <NavLink to="/faq" label="FAQ" />
            <Link to="/project-request">
              <Button size="sm" variant="secondary">
                <Sparkles size={14} className="mr-1" /> Request Project
              </Button>
            </Link>
            <Link to="/quote">
              <Button size="sm">Get Quote <ArrowRight size={14} className="ml-1" /></Button>
            </Link>
          </div>

          <motion.button
            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/80 text-stone-500 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileMenuOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X size={20} />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu size={20} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden absolute top-full left-0 right-0 mx-4 mt-2 rounded-2xl bg-white shadow-xl border border-stone-200 overflow-hidden"
              initial={{ opacity: 0, height: 0, scale: 0.98 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="px-4 py-4 flex flex-col gap-1">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/services', label: 'Services' },
                  { to: '/portfolio', label: 'Projects' },
                  { to: '/pricing', label: 'Pricing' },
                  { to: '/faq', label: 'FAQ' },
                  { to: '/contact', label: 'Contact' },
                ].map((link, i) => (
                  <motion.div key={link.to} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <Link
                      to={link.to}
                      className={`block py-3 px-4 rounded-lg text-sm transition-colors ${
                        location.pathname === link.to
                          ? 'bg-blue-50 text-neon-cyan font-medium'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="flex gap-3 mt-3 pt-3 border-t border-stone-200">
                  <Link to="/project-request" className="flex-1"><Button size="sm" variant="secondary" fullWidth>Request Project</Button></Link>
                  <Link to="/quote" className="flex-1"><Button size="sm" fullWidth>Get Quote</Button></Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <main className="flex-grow pt-16 sm:pt-20">
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
            <Routes location={location}>
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
          </motion.div>
        </AnimatePresence>
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
