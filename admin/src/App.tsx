import React, { useState, useEffect } from 'react';
import { Menu, Bell, Search } from 'lucide-react';
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
import UserManagement from './components/UserManagement';
import DocumentDelivery from './components/DocumentDelivery';
import Login from './components/Login';
import Logo from './components/Logo';
import { verifyAuth, logout, isAuthenticated as checkAuth } from './config/auth.config';
import './styles/global.css';

type View = 'dashboard' | 'contacts' | 'quotes' | 'projects' | 'services' | 'portfolio' | 'pricing' | 'customers' | 'revenue' | 'users' | 'documents';

const VIEW_TITLES: Record<View, string> = {
  dashboard: 'Dashboard',
  contacts: 'Contact Forms',
  quotes: 'Quote Requests',
  projects: 'Project Requests',
  services: 'Services',
  portfolio: 'Portfolio',
  pricing: 'Pricing',
  customers: 'Customers',
  revenue: 'Revenue Analytics',
  users: 'Admin Users',
  documents: 'Send Documents',
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

  const handleLogin = () => setIsAuthenticated(true);

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setCurrentView('dashboard');
  };

  const handleViewChange = (view: View) => {
    setCurrentView(view);
    setSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f1117]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/25">
              <Logo className="w-10 h-10 object-contain" />
            </div>
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 opacity-20 blur-lg animate-pulse"></div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0ms]"></span>
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:300ms]"></span>
            </div>
            <p className="text-sm text-slate-500 font-medium">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'contacts': return <ContactsList />;
      case 'quotes': return <QuoteRequestsList />;
      case 'projects': return <ProjectRequestsList />;
      case 'services': return <ServicesManager />;
      case 'portfolio': return <PortfolioManager />;
      case 'pricing': return <PricingManager />;
      case 'customers': return <CustomersManager />;
      case 'revenue': return <RevenueAnalytics />;
      case 'users': return <UserManagement />;
      case 'documents': return <DocumentDelivery />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[#f8f9fb] overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-out
        lg:relative lg:translate-x-0 lg:flex-shrink-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${sidebarCollapsed ? 'w-[72px]' : 'w-[260px]'}
      `}>
        <Sidebar
          currentView={currentView}
          onViewChange={handleViewChange}
          onLogout={handleLogout}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-[60px] bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-4 lg:px-6 flex-shrink-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="hidden lg:block">
              <h1 className="text-[15px] font-semibold text-slate-800">{VIEW_TITLES[currentView]}</h1>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 bg-slate-50/80 border border-slate-200/80 rounded-xl px-3 py-[7px] w-56 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-500/10 focus-within:bg-white transition-all">
              <Search size={15} className="text-slate-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm text-slate-600 placeholder-slate-400 w-full"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors">
              <Bell size={19} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </button>

            {/* Divider + Profile */}
            <div className="w-px h-7 bg-slate-200 mx-1.5"></div>
            <button className="flex items-center gap-2 hover:bg-slate-50 rounded-xl px-2 py-1.5 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm shadow-indigo-500/25">
                A
              </div>
              <span className="hidden sm:block text-sm font-medium text-slate-700">Admin</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 xl:p-8 max-w-[1600px] mx-auto animate-fadeIn">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
