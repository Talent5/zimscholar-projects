import React, { useEffect, useState } from 'react';
import PageLoader from './PageLoader';
import {
  MessageSquare,
  DollarSign,
  FolderKanban,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap,
  BarChart3,
  CalendarDays,
} from 'lucide-react';
import { fetchStats } from '../utils/api';

interface Stats {
  totalContacts: number;
  totalQuotes: number;
  totalProjects: number;
  recentSubmissions: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalContacts: 0,
    totalQuotes: 0,
    totalProjects: 0,
    recentSubmissions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await fetchStats();
      setStats(data);
      setError('');
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening';
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const statCards = [
    {
      title: 'Contacts',
      value: stats.totalContacts,
      change: '+12%',
      trend: 'up' as const,
      icon: MessageSquare,
      gradient: 'from-blue-500 to-blue-600',
      shadowColor: 'shadow-blue-500/20',
      bgAccent: 'bg-blue-50',
      textAccent: 'text-blue-600',
    },
    {
      title: 'Quote Requests',
      value: stats.totalQuotes,
      change: '+4%',
      trend: 'up' as const,
      icon: DollarSign,
      gradient: 'from-emerald-500 to-emerald-600',
      shadowColor: 'shadow-emerald-500/20',
      bgAccent: 'bg-emerald-50',
      textAccent: 'text-emerald-600',
    },
    {
      title: 'Projects',
      value: stats.totalProjects,
      change: '-2%',
      trend: 'down' as const,
      icon: FolderKanban,
      gradient: 'from-amber-500 to-orange-500',
      shadowColor: 'shadow-amber-500/20',
      bgAccent: 'bg-amber-50',
      textAccent: 'text-amber-600',
    },
    {
      title: 'Activity',
      value: stats.recentSubmissions,
      change: '+8%',
      trend: 'up' as const,
      icon: Zap,
      gradient: 'from-violet-500 to-purple-600',
      shadowColor: 'shadow-violet-500/20',
      bgAccent: 'bg-violet-50',
      textAccent: 'text-violet-600',
    },
  ];

  if (loading) {
    return <PageLoader variant="dashboard" />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{greeting} 👋</h1>
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
            <CalendarDays size={14} className="text-slate-400" />
            {dateStr}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            All systems online
          </span>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200/60 rounded-xl text-rose-700 text-sm">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{error}</span>
          <button onClick={loadStats} className="ml-auto text-xs font-semibold underline hover:no-underline">Retry</button>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="group relative bg-white rounded-2xl border border-slate-200/60 p-5 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5 transition-all duration-300"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} ${card.shadowColor} shadow-lg flex items-center justify-center`}>
                  <Icon size={20} className="text-white" strokeWidth={2} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md ${
                  card.trend === 'up' 
                    ? 'text-emerald-700 bg-emerald-50' 
                    : 'text-rose-700 bg-rose-50'
                }`}>
                  {card.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {card.change}
                </div>
              </div>
              <div>
                <p className="text-[13px] font-medium text-slate-500 mb-0.5">{card.title}</p>
                <p className="text-[28px] font-bold text-slate-900 tracking-tight leading-none">{card.value.toLocaleString()}</p>
              </div>
              {/* Subtle bottom accent */}
              <div className={`absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            </div>
          );
        })}
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Quick actions */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/60 p-5">
          <h2 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <BarChart3 size={16} className="text-slate-400" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: 'View Contacts', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100', icon: MessageSquare },
              { label: 'View Quotes', color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100', icon: DollarSign },
              { label: 'View Projects', color: 'bg-amber-50 text-amber-700 hover:bg-amber-100', icon: FolderKanban },
              { label: 'Analytics', color: 'bg-violet-50 text-violet-700 hover:bg-violet-100', icon: TrendingUp },
            ].map((action) => {
              const ActionIcon = action.icon;
              return (
                <button
                  key={action.label}
                  className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-semibold ${action.color} transition-colors`}
                >
                  <ActionIcon size={16} />
                  {action.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* System status */}
        <div className="lg:col-span-3 bg-gradient-to-br from-[#0f1117] to-[#1a1d2e] rounded-2xl p-5 text-white relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <Activity size={16} className="text-indigo-400" />
                System Status
              </h2>
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                <CheckCircle2 size={14} />
                Operational
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: 'API Server', value: 24, color: 'bg-indigo-500' },
                { label: 'Database', value: 45, color: 'bg-purple-500' },
                { label: 'Storage', value: 12, color: 'bg-emerald-500' },
              ].map((metric) => (
                <div key={metric.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400 font-medium">{metric.label}</span>
                    <span className="text-slate-300 font-semibold">{metric.value}%</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${metric.color} rounded-full transition-all duration-1000`}
                      style={{ width: `${metric.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center gap-2 text-[11px] text-slate-500">
              <Clock size={12} />
              Last updated: just now
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
