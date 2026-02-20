import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Menu,
  Bell,
  Search,
  ChevronRight,
  LogOut,
  User,
  Settings,
  LayoutDashboard,
  MessageSquare,
  DollarSign,
  FolderKanban,
  Briefcase,
  Image,
  Tag,
  Users,
  TrendingUp,
  UserCog,
  Send,
  X,
  Command,
} from 'lucide-react';
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
import NotificationPanel, { useUnreadCount } from './components/NotificationPanel';
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

const VIEW_ICONS: Record<View, React.ElementType> = {
  dashboard: LayoutDashboard,
  contacts: MessageSquare,
  quotes: DollarSign,
  projects: FolderKanban,
  services: Briefcase,
  portfolio: Image,
  pricing: Tag,
  customers: Users,
  revenue: TrendingUp,
  users: UserCog,
  documents: Send,
};

const SECTION_LABELS: Partial<Record<View, string>> = {
  contacts: 'Inbox',
  quotes: 'Inbox',
  projects: 'Inbox',
  services: 'Content',
  portfolio: 'Content',
  pricing: 'Content',
  customers: 'Business',
  revenue: 'Business',
  documents: 'Business',
  users: 'System',
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Header interactive state
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const unreadCount = useUnreadCount();

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

  /* Keyboard shortcut: Ctrl+K to open search */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setProfileOpen(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  /* Focus search input when opened */
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery('');
    }
  }, [searchOpen]);

  /* Close dropdowns on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Search results */
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return Object.entries(VIEW_TITLES) as [View, string][];
    const q = searchQuery.toLowerCase();
    return (Object.entries(VIEW_TITLES) as [View, string][]).filter(
      ([, label]) => label.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleLogin = () => setIsAuthenticated(true);

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setCurrentView('dashboard');
  };

  const handleViewChange = (view: View) => {
    setCurrentView(view);
    setSidebarOpen(false);
    setSearchOpen(false);
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
        <header className="h-[60px] bg-white/80 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-4 lg:px-6 flex-shrink-0 z-30">
          {/* Left: hamburger + breadcrumb */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumb navigation */}
            <nav className="hidden lg:flex items-center gap-1 text-sm min-w-0">
              <button
                onClick={() => handleViewChange('dashboard')}
                className="flex items-center gap-1.5 text-slate-400 hover:text-indigo-600 transition-colors font-medium"
              >
                <LayoutDashboard size={14} />
                Home
              </button>
              {currentView !== 'dashboard' && (
                <>
                  <ChevronRight size={14} className="text-slate-300 flex-shrink-0" />
                  {SECTION_LABELS[currentView] && (
                    <>
                      <span className="text-slate-400 font-medium">{SECTION_LABELS[currentView]}</span>
                      <ChevronRight size={14} className="text-slate-300 flex-shrink-0" />
                    </>
                  )}
                  <span className="text-slate-700 font-semibold truncate">{VIEW_TITLES[currentView]}</span>
                </>
              )}
              {currentView === 'dashboard' && (
                <>
                  <ChevronRight size={14} className="text-slate-300 flex-shrink-0" />
                  <span className="text-slate-700 font-semibold">Overview</span>
                </>
              )}
            </nav>

            {/* Mobile title */}
            <button
              onClick={() => handleViewChange('dashboard')}
              className="lg:hidden text-[15px] font-semibold text-slate-800 truncate"
            >
              {VIEW_TITLES[currentView]}
            </button>
          </div>

          {/* Right: search + notifications + profile */}
          <div className="flex items-center gap-1">
            {/* Search trigger */}
            <div ref={searchRef} className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="hidden md:flex items-center gap-2 bg-slate-50/80 border border-slate-200/80 rounded-xl px-3 py-[7px] w-56 hover:border-slate-300 hover:bg-white transition-all cursor-pointer group"
              >
                <Search size={15} className="text-slate-400 flex-shrink-0" />
                <span className="text-sm text-slate-400 flex-1 text-left">Search…</span>
                <kbd className="hidden lg:flex items-center gap-0.5 text-[10px] text-slate-400 bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 font-mono group-hover:border-slate-300">
                  <Command size={10} />K
                </kbd>
              </button>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="md:hidden p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
              >
                <Search size={19} />
              </button>

              {/* Search dropdown */}
              {searchOpen && (
                <div className="absolute right-0 md:left-0 top-full mt-2 w-[320px] md:w-[360px] bg-white rounded-2xl shadow-2xl shadow-slate-900/12 border border-slate-200/80 z-[100] animate-scale-in origin-top overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
                    <Search size={16} className="text-slate-400 flex-shrink-0" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search pages…"
                      className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 placeholder-slate-400"
                      onKeyDown={e => {
                        if (e.key === 'Enter' && searchResults.length > 0) {
                          handleViewChange(searchResults[0][0]);
                        }
                      }}
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="p-0.5 rounded text-slate-400 hover:text-slate-600">
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  <div className="max-h-[300px] overflow-y-auto py-1">
                    {searchResults.length === 0 ? (
                      <div className="px-4 py-6 text-center text-sm text-slate-400">No pages found</div>
                    ) : (
                      searchResults.map(([view, label]) => {
                        const Icon = VIEW_ICONS[view];
                        return (
                          <button
                            key={view}
                            onClick={() => handleViewChange(view)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50 transition-colors ${
                              currentView === view ? 'bg-indigo-50/50' : ''
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              currentView === view ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'
                            }`}>
                              <Icon size={15} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium truncate ${currentView === view ? 'text-indigo-700' : 'text-slate-700'}`}>{label}</p>
                              {SECTION_LABELS[view] && (
                                <p className="text-[11px] text-slate-400">{SECTION_LABELS[view]}</p>
                              )}
                            </div>
                            {currentView === view && (
                              <span className="text-[10px] font-semibold text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded">Current</span>
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                className={`relative p-2 rounded-xl transition-colors ${
                  notifOpen
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                }`}
              >
                <Bell size={19} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white bg-rose-500 rounded-full ring-2 ring-white px-1 animate-scale-in">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
              <NotificationPanel
                open={notifOpen}
                onClose={() => setNotifOpen(false)}
                onNavigate={handleViewChange}
              />
            </div>

            {/* Divider */}
            <div className="w-px h-7 bg-slate-200 mx-1"></div>

            {/* Profile dropdown */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                className={`flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors ${
                  profileOpen ? 'bg-slate-100' : 'hover:bg-slate-50'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm shadow-indigo-500/25">
                  A
                </div>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm font-medium text-slate-700 leading-tight">Admin</span>
                  <span className="text-[10px] text-slate-400 leading-tight">Administrator</span>
                </div>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-[220px] bg-white rounded-2xl shadow-2xl shadow-slate-900/12 border border-slate-200/80 z-[100] animate-scale-in origin-top-right overflow-hidden">
                  {/* Profile info */}
                  <div className="px-4 pt-4 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-indigo-500/25">
                        A
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Admin</p>
                        <p className="text-[11px] text-slate-400">Administrator</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    <button
                      onClick={() => { handleViewChange('users'); setProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                    >
                      <User size={15} className="text-slate-400" />
                      My Profile
                    </button>
                    <button
                      onClick={() => { handleViewChange('users'); setProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                    >
                      <Settings size={15} className="text-slate-400" />
                      Settings
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-slate-100 py-1">
                    <button
                      onClick={() => { handleLogout(); setProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut size={15} />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
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
