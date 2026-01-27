import React from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  DollarSign, 
  FolderKanban,
  Briefcase,
  Image,
  Tag,
  Users,
  TrendingUp,
  LogOut,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: 'dashboard' | 'contacts' | 'quotes' | 'projects' | 'services' | 'portfolio' | 'pricing' | 'customers' | 'revenue') => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'contacts', label: 'Contact Forms', icon: MessageSquare },
    { id: 'quotes', label: 'Quote Requests', icon: DollarSign },
    { id: 'projects', label: 'Project Requests', icon: FolderKanban },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'portfolio', label: 'Portfolio', icon: Image },
    { id: 'pricing', label: 'Pricing', icon: Tag },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'revenue', label: 'Revenue Analytics', icon: TrendingUp },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-slate-300 flex flex-col shadow-xl z-50">
      <div className="p-6 border-b border-slate-800 bg-slate-950/50">
        <div className="flex items-center gap-3">
          <img 
            src="/zimscholar-logo.png" 
            alt="ZimScholar Logo" 
            className="w-8 h-8 rounded-lg object-contain shadow-lg"
          />
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">ZimScholar</h2>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Admin Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        <p className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Main Menu
        </p>
        
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as any)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white transition-colors'}`} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight size={14} className="opacity-75" />}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-950/30">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
        <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-center text-slate-600">
          v1.0.0 • © 2026 Admin
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
