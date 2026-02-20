import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Bell,
  MessageSquare,
  DollarSign,
  FolderKanban,
  X,
  Check,
  CheckCheck,
  Clock,
  ExternalLink,
  Inbox,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { fetchContacts, fetchQuoteRequests, fetchProjectRequests } from '../utils/api';

type View = 'dashboard' | 'contacts' | 'quotes' | 'projects' | 'services' | 'portfolio' | 'pricing' | 'customers' | 'revenue' | 'users' | 'documents';

interface NotificationItem {
  id: string;
  type: 'contact' | 'quote' | 'project';
  title: string;
  subtitle: string;
  time: Date;
  read: boolean;
  view: View;
}

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (view: View) => void;
}

const TAB_FILTERS = ['all', 'contact', 'quote', 'project'] as const;
type TabFilter = typeof TAB_FILTERS[number];

const TAB_META: Record<TabFilter, { label: string; icon: React.ElementType; color: string }> = {
  all:     { label: 'All',      icon: Bell,          color: 'text-slate-600' },
  contact: { label: 'Contacts', icon: MessageSquare, color: 'text-blue-600' },
  quote:   { label: 'Quotes',   icon: DollarSign,    color: 'text-emerald-600' },
  project: { label: 'Projects', icon: FolderKanban,  color: 'text-purple-600' },
};

const TYPE_STYLE: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
  contact: { bg: 'bg-blue-50', text: 'text-blue-600', icon: MessageSquare },
  quote:   { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: DollarSign },
  project: { bg: 'bg-purple-50', text: 'text-purple-600', icon: FolderKanban },
};

/* Readable relative time */
function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/* Local storage key for dismissed notifications */
const DISMISSED_KEY = 'scholarx_dismissed_notifs';

function getDismissed(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(DISMISSED_KEY) || '[]'));
  } catch { return new Set(); }
}
function setDismissed(ids: Set<string>) {
  localStorage.setItem(DISMISSED_KEY, JSON.stringify([...ids]));
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ open, onClose, onNavigate }) => {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<TabFilter>('all');
  const [dismissed, setDismissedState] = useState<Set<string>>(getDismissed);
  const panelRef = useRef<HTMLDivElement>(null);
  const fetched = useRef(false);

  /* Close on outside click */
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose]);

  /* Fetch data */
  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [contacts, quotes, projects] = await Promise.all([
        fetchContacts().catch(() => []),
        fetchQuoteRequests().catch(() => []),
        fetchProjectRequests().catch(() => []),
      ]);

      const notifs: NotificationItem[] = [];

      (contacts as any[]).forEach(c => {
        if (c.status === 'new' || c.status === 'read') {
          notifs.push({
            id: c._id,
            type: 'contact',
            title: c.name,
            subtitle: c.message?.slice(0, 80) + (c.message?.length > 80 ? '…' : ''),
            time: new Date(c.submittedAt || c.createdAt),
            read: c.status !== 'new',
            view: 'contacts',
          });
        }
      });

      (quotes as any[]).forEach(q => {
        if (q.status === 'pending') {
          notifs.push({
            id: q._id,
            type: 'quote',
            title: q.name,
            subtitle: `${q.projectType} — ${q.university}`,
            time: new Date(q.submittedAt || q.createdAt),
            read: false,
            view: 'quotes',
          });
        }
      });

      (projects as any[]).forEach(p => {
        if (p.status === 'new') {
          notifs.push({
            id: p._id,
            type: 'project',
            title: p.name,
            subtitle: `${p.projectType}${p.university ? ' — ' + p.university : ''}`,
            time: new Date(p.submittedAt || p.createdAt),
            read: false,
            view: 'projects',
          });
        }
      });

      notifs.sort((a, b) => b.time.getTime() - a.time.getTime());
      setItems(notifs);
    } catch {
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open && !fetched.current) {
      fetched.current = true;
      loadNotifications();
    }
  }, [open, loadNotifications]);

  /* Re-fetch when re-opened */
  useEffect(() => {
    if (open) {
      loadNotifications();
    } else {
      fetched.current = false;
    }
  }, [open, loadNotifications]);

  const markAllRead = () => {
    const newDismissed = new Set(dismissed);
    items.forEach(i => newDismissed.add(i.id));
    setDismissedState(newDismissed);
    setDismissed(newDismissed);
  };

  const markRead = (id: string) => {
    const newDismissed = new Set(dismissed);
    newDismissed.add(id);
    setDismissedState(newDismissed);
    setDismissed(newDismissed);
  };

  const filtered = tab === 'all' ? items : items.filter(i => i.type === tab);
  const unreadCount = items.filter(i => !dismissed.has(i.id) && !i.read).length;
  const unreadFiltered = filtered.filter(i => !dismissed.has(i.id) && !i.read).length;

  if (!open) return null;

  return (
    <div ref={panelRef} className="absolute right-0 top-full mt-2 w-[400px] max-h-[520px] bg-white rounded-2xl shadow-2xl shadow-slate-900/12 border border-slate-200/80 flex flex-col z-[100] animate-scale-in origin-top-right overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <h3 className="text-[15px] font-semibold text-slate-800">Notifications</h3>
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold text-white bg-rose-500 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg px-2 py-1.5 transition-colors"
              title="Mark all as read"
            >
              <CheckCheck size={14} />
              <span className="hidden sm:inline">Mark all read</span>
            </button>
          )}
          <button
            onClick={() => { fetched.current = false; loadNotifications(); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-slate-100 bg-slate-50/50">
        {TAB_FILTERS.map(t => {
          const meta = TAB_META[t];
          const count = t === 'all'
            ? items.filter(i => !dismissed.has(i.id) && !i.read).length
            : items.filter(i => i.type === t && !dismissed.has(i.id) && !i.read).length;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                tab === t
                  ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200/80'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-white/60'
              }`}
            >
              <meta.icon size={13} />
              {meta.label}
              {count > 0 && (
                <span className={`ml-0.5 min-w-[16px] h-4 flex items-center justify-center text-[10px] font-bold rounded-full ${
                  tab === t ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        {loading && items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <RefreshCw size={20} className="text-slate-300 animate-spin" />
            <p className="text-sm text-slate-400">Loading notifications…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <AlertCircle size={24} className="text-rose-400" />
            <p className="text-sm text-slate-500">{error}</p>
            <button onClick={loadNotifications} className="text-xs text-indigo-600 hover:underline">Try again</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
              <Inbox size={22} className="text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-500">
              {tab === 'all' ? 'All caught up!' : `No ${TAB_META[tab].label.toLowerCase()} notifications`}
            </p>
            <p className="text-xs text-slate-400">New submissions will appear here</p>
          </div>
        ) : (
          <div className="py-1">
            {filtered.map(item => {
              const style = TYPE_STYLE[item.type];
              const Icon = style.icon;
              const isRead = dismissed.has(item.id) || item.read;
              return (
                <div
                  key={item.id}
                  className={`group flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors relative ${
                    isRead
                      ? 'bg-white hover:bg-slate-50'
                      : 'bg-indigo-50/30 hover:bg-indigo-50/50'
                  }`}
                  onClick={() => {
                    markRead(item.id);
                    onNavigate(item.view);
                    onClose();
                  }}
                >
                  {/* Unread dot */}
                  {!isRead && (
                    <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                  )}

                  {/* Icon */}
                  <div className={`w-9 h-9 rounded-xl ${style.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <Icon size={16} className={style.text} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm truncate ${isRead ? 'text-slate-600' : 'font-semibold text-slate-800'}`}>
                        {item.title}
                      </p>
                      <span className="text-[11px] text-slate-400 flex-shrink-0 flex items-center gap-1">
                        <Clock size={10} />
                        {timeAgo(item.time)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{item.subtitle}</p>
                  </div>

                  {/* Hover actions */}
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 flex-shrink-0 transition-opacity">
                    {!isRead && (
                      <button
                        onClick={e => { e.stopPropagation(); markRead(item.id); }}
                        className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="Mark as read"
                      >
                        <Check size={13} />
                      </button>
                    )}
                    <ExternalLink size={13} className="text-slate-300 group-hover:text-slate-400 mt-0.5" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {filtered.length > 0 && (
        <div className="border-t border-slate-100 px-4 py-2.5 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              {unreadFiltered} unread of {filtered.length} total
            </span>
            <button
              onClick={() => {
                onNavigate(tab === 'all' ? 'contacts' : (tab === 'contact' ? 'contacts' : tab === 'quote' ? 'quotes' : 'projects'));
                onClose();
              }}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1"
            >
              View all
              <ExternalLink size={11} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;

/* Export a hook to get unread count for the badge */
export function useUnreadCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchCount = async () => {
      try {
        const [contacts, quotes, projects] = await Promise.all([
          fetchContacts().catch(() => []),
          fetchQuoteRequests().catch(() => []),
          fetchProjectRequests().catch(() => []),
        ]);
        if (cancelled) return;

        const dismissed = getDismissed();
        let total = 0;
        (contacts as any[]).forEach(c => {
          if (c.status === 'new' && !dismissed.has(c._id)) total++;
        });
        (quotes as any[]).forEach(q => {
          if (q.status === 'pending' && !dismissed.has(q._id)) total++;
        });
        (projects as any[]).forEach(p => {
          if (p.status === 'new' && !dismissed.has(p._id)) total++;
        });
        setCount(total);
      } catch { /* silent */ }
    };

    fetchCount();
    const interval = setInterval(fetchCount, 60000); // Poll every 60 seconds

    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  return count;
}
