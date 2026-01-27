import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ContactsList from './components/ContactsList';
import QuoteRequestsList from './components/QuoteRequestsList';
import ProjectRequestsList from './components/ProjectRequestsList';
import ServicesManager from './components/ServicesManager';
import PortfolioManager from './components/PortfolioManager';
import PricingManager from './components/PricingManager';
import CustomersManager from './components/CustomersManager';
import RevenueAnalytics from './components/RevenueAnalytics';
import Login from './components/Login';
import { verifyAuth, logout, isAuthenticated as checkAuth } from './config/auth.config';
import './styles/global.css';

type View = 'dashboard' | 'contacts' | 'quotes' | 'projects' | 'services' | 'portfolio' | 'pricing' | 'customers' | 'revenue';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verify authentication on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (checkAuth()) {
        const isValid = await verifyAuth();
        setIsAuthenticated(isValid);
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setCurrentView('dashboard');
  };

  if (loading) {
    return (
      <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
          <div className="particle particle-5"></div>
        </div>

        {/* Main loader container */}
        <div className="relative z-10 flex flex-col items-center space-y-8">
          {/* Logo with glow effect */}
          <div className="relative">
            <div className="absolute inset-0 blur-2xl bg-blue-500/30 animate-pulse-slow"></div>
            <div className="relative bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-blue-500/30 shadow-2xl">
              <img 
                src="/scholarxafrica-logo.png" 
                alt="ZimScholar Logo" 
                className="w-20 h-20 object-contain animate-float"
              />
            </div>
          </div>

          {/* Futuristic spinner */}
          <div className="relative w-32 h-32">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
            
            {/* Spinning rings */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-400 animate-spin-slow"></div>
            <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-cyan-400 border-r-cyan-300 animate-spin-reverse"></div>
            <div className="absolute inset-4 rounded-full border-4 border-transparent border-t-blue-300 border-r-blue-200 animate-spin"></div>
            
            {/* Center glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse-glow shadow-lg shadow-blue-500/50"></div>
            </div>
          </div>

          {/* Loading text with typing effect */}
          <div className="text-center space-y-2">
            <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 animate-gradient">
              Initializing System
            </p>
            <div className="flex items-center justify-center space-x-2">
              <div className="flex space-x-1">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce-delay-0"></span>
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce-delay-1"></span>
                <span className="w-2 h-2 bg-blue-300 rounded-full animate-bounce-delay-2"></span>
              </div>
            </div>
            <p className="text-sm text-slate-400 font-mono">Verifying authentication...</p>
          </div>

          {/* Progress bar */}
          <div className="w-64 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 animate-progress"></div>
          </div>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-blue-500/30 rounded-tl-3xl"></div>
        <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-blue-500/30 rounded-tr-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-blue-500/30 rounded-bl-3xl"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-blue-500/30 rounded-br-3xl"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'contacts':
        return <ContactsList />;
      case 'quotes':
        return <QuoteRequestsList />;
      case 'projects':
        return <ProjectRequestsList />;
      case 'services':
        return <ServicesManager />;
      case 'portfolio':
        return <PortfolioManager />;
      case 'pricing':
        return <PricingManager />;
      case 'customers':
        return <CustomersManager />;
      case 'revenue':
        return <RevenueAnalytics />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView}
        onLogout={handleLogout}
      />
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
