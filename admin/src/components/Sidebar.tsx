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
  UserCog,
  Send,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import Logo from './Logo';

type View = 'dashboard' | 'contacts' | 'quotes' | 'projects' | 'services' | 'portfolio' | 'pricing' | 'customers' | 'revenue' | 'users' | 'documents';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: View) => void;
  onLogout: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const menuSections = [
  {
    label: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Inbox',
    items: [
      { id: 'contacts', label: 'Contacts', icon: MessageSquare },
      { id: 'quotes', label: 'Quotes', icon: DollarSign },
      { id: 'projects', label: 'Projects', icon: FolderKanban },
    ],
  },
  {
    label: 'Content',
    items: [
      { id: 'services', label: 'Services', icon: Briefcase },
      { id: 'portfolio', label: 'Portfolio', icon: Image },
      { id: 'pricing', label: 'Pricing', icon: Tag },
    ],
  },
  {
    label: 'Business',
    items: [
      { id: 'customers', label: 'Customers', icon: Users },
      { id: 'revenue', label: 'Revenue', icon: TrendingUp },
      { id: 'documents', label: 'Documents', icon: Send },
    ],
  },
  {
    label: 'System',
    items: [
      { id: 'users', label: 'Admin Users', icon: UserCog },
    ],
  },
];

const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  onLogout,
  collapsed = false,
  onToggleCollapse,
}) => {
  return (
    <aside className={`h-full flex flex-col bg-[#0f1117] text-slate-300 transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-[260px]'}`}>
      {/* Brand */}
      <div className={`flex items-center h-[60px] border-b border-white/[0.06] flex-shrink-0 ${collapsed ? 'justify-center px-2' : 'px-5'}`}>
        {collapsed ? (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Logo className="w-5 h-5 object-contain" />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Logo
                alt="ZimScholar"
                className="w-5 h-5 object-contain"
                width={20}
                height={20}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-bold text-white tracking-tight leading-tight">ScholarX</span>
              <span className="text-[10px] font-semibold text-indigo-400/80 uppercase tracking-[0.15em] leading-tight">Admin</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2.5 space-y-5 scrollbar-thin">
        {menuSections.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <p className="px-3 mb-1.5 text-[10px] font-bold text-slate-500/80 uppercase tracking-[0.15em]">
                {section.label}
              </p>
            )}
            {collapsed && <div className="w-6 h-px bg-white/[0.06] mx-auto mb-2"></div>}

            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id as View)}
                    title={collapsed ? item.label : undefined}
                    className={`
                      group w-full flex items-center rounded-xl text-[13px] font-medium transition-all duration-200 relative
                      ${collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2'}
                      ${isActive
                        ? 'bg-indigo-500/15 text-indigo-400'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                      }
                    `}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-indigo-400 rounded-r-full"></div>
                    )}

                    <Icon
                      size={collapsed ? 20 : 18}
                      strokeWidth={isActive ? 2.2 : 1.8}
                      className={`flex-shrink-0 transition-colors ${
                        isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'
                      }`}
                    />
                    {!collapsed && <span>{item.label}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className={`border-t border-white/[0.06] flex-shrink-0 ${collapsed ? 'p-2' : 'p-3'}`}>
        {/* Collapse toggle (desktop only) */}
        <button
          onClick={onToggleCollapse}
          className={`
            hidden lg:flex w-full items-center rounded-xl text-[13px] font-medium text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] transition-colors mb-1
            ${collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2'}
          `}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronsRight size={18} /> : (
            <>
              <ChevronsLeft size={18} />
              <span>Collapse</span>
            </>
          )}
        </button>

        {/* Logout */}
        <button
          onClick={onLogout}
          className={`
            w-full flex items-center rounded-xl text-[13px] font-medium text-slate-500 hover:text-rose-400 hover:bg-rose-500/[0.08] transition-colors
            ${collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2'}
          `}
          title={collapsed ? 'Sign out' : undefined}
        >
          <LogOut size={collapsed ? 20 : 18} strokeWidth={1.8} className="flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
