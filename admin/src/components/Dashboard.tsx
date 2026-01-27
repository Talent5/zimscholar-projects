import React, { useEffect, useState } from 'react';
import { MessageSquare, DollarSign, FolderKanban, TrendingUp, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
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

  const statCards = [
    {
      title: 'Contact Forms',
      value: stats.totalContacts,
      change: '+12%',
      trend: 'up',
      icon: MessageSquare,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-100',
    },
    {
      title: 'Quote Requests',
      value: stats.totalQuotes,
      change: '+4%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
    },
    {
      title: 'Project Requests',
      value: stats.totalProjects,
      change: '-2%',
      trend: 'down',
      icon: FolderKanban,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100',
    },
    {
      title: 'Recent Activity',
      value: stats.recentSubmissions,
      change: '+8%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-violet-600',
      bgColor: 'bg-violet-50',
      borderColor: 'border-violet-100',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
          <p className="mt-1 text-slate-500">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System Online
          </span>
          <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
            Download Report
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-100 flex items-center gap-2">
          <Activity size={20} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div 
              key={card.title} 
              className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl ${card.bgColor} ${card.color} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={24} />
                </div>
                {card.trend === 'up' ? (
                  <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    <ArrowUpRight size={14} />
                    {card.change}
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full">
                    <ArrowDownRight size={14} />
                    {card.change}
                  </div>
                )}
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-slate-500">{card.title}</h3>
                <p className="text-3xl font-bold text-slate-900 mt-1 tracking-tight">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">Notifications</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div className="flex flex-col items-center justify-center py-8 text-slate-400">
             <MessageSquare size={48} className="mb-4 opacity-20" />
             <p>No new notifications</p> 
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl border border-slate-800 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          
          <h2 className="text-lg font-bold mb-2">System Status</h2>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
            <span className="text-slate-300 text-sm">All systems operational</span>
          </div>

          <div className="space-y-4 relative z-10">
            <div>
              <div className="flex justify-between text-sm mb-1 text-slate-300">
                <span>Server Load</span>
                <span>24%</span>
              </div>
              <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <div className="h-full w-[24%] bg-blue-500 rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1 text-slate-300">
                <span>Database Usage</span>
                <span>45%</span>
              </div>
              <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <div className="h-full w-[45%] bg-purple-500 rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1 text-slate-300">
                <span>Memory</span>
                <span>12%</span>
              </div>
              <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <div className="h-full w-[12%] bg-emerald-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
