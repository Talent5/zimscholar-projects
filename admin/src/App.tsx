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
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
          <img 
            src="/zimscholar-logo.png" 
            alt="ZimScholar Logo" 
            className="w-16 h-16 object-contain mb-2 animate-pulse"
          />
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Verifying authentication...</p>
        </div>
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
