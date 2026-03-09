import React, { useEffect, useState, useMemo } from 'react';
import {
  DollarSign, TrendingUp, TrendingDown, Calendar,
  CreditCard, RefreshCw, BarChart3, Users, ArrowUpRight,
  ArrowDownRight, Wallet, PieChart, Award
} from 'lucide-react';
import PageLoader from './PageLoader';
import { apiRequest } from '../utils/api';

interface RevenueData {
  totalRevenue: number;
  monthlyRevenue: any[];
  yearlyRevenue: any[];
  topCustomers: any[];
  paymentMethodBreakdown: any[];
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const METHOD_LABELS: Record<string, string> = {
  bank_transfer: 'Bank Transfer',
  credit_card: 'Credit Card',
  debit_card: 'Debit Card',
  mobile_money: 'Mobile Money',
  cash: 'Cash',
  paypal: 'PayPal',
  crypto: 'Cryptocurrency',
  check: 'Check',
  other: 'Other',
};

const METHOD_COLORS = [
  { bg: 'bg-indigo-500', text: 'text-indigo-600', light: 'bg-indigo-50', ring: 'ring-indigo-200' },
  { bg: 'bg-emerald-500', text: 'text-emerald-600', light: 'bg-emerald-50', ring: 'ring-emerald-200' },
  { bg: 'bg-amber-500', text: 'text-amber-600', light: 'bg-amber-50', ring: 'ring-amber-200' },
  { bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-50', ring: 'ring-blue-200' },
  { bg: 'bg-pink-500', text: 'text-pink-600', light: 'bg-pink-50', ring: 'ring-pink-200' },
  { bg: 'bg-violet-500', text: 'text-violet-600', light: 'bg-violet-50', ring: 'ring-violet-200' },
];

const formatCurrency = (val: number) =>
  val >= 1000 ? `$${(val / 1000).toFixed(1)}k` : `$${val.toFixed(0)}`;

const formatPaymentMethod = (method: string) =>
  METHOD_LABELS[method] || method.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

/* ─── Stat Card ────────────────────────────────────────────── */
const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: React.ReactNode;
  gradient?: string;
  dark?: boolean;
}> = ({ icon, label, value, sub, gradient, dark }) => (
  <div
    className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-200 hover:shadow-lg
      ${gradient || 'bg-white border border-slate-200 shadow-sm'}`}
  >
    {gradient && (
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/20" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/10" />
      </div>
    )}
    <div className="relative z-10">
      <div className={`flex items-center gap-3 mb-3 ${dark ? 'text-white/90' : 'text-slate-500'}`}>
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className={`text-3xl font-extrabold tracking-tight mb-1 ${dark ? 'text-white' : 'text-slate-900'}`}>
        {value}
      </div>
      {sub && <div className="mt-1">{sub}</div>}
    </div>
  </div>
);

/* ─── Growth Badge ─────────────────────────────────────────── */
const GrowthBadge: React.FC<{ value: number; label: string; dark?: boolean }> = ({ value, label, dark }) => {
  const positive = value >= 0;
  return (
    <div className={`flex items-center gap-1.5 text-sm font-semibold
      ${dark
        ? positive ? 'text-emerald-200' : 'text-red-200'
        : positive ? 'text-emerald-600' : 'text-red-500'
      }`}
    >
      {positive ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
      <span>{Math.abs(value)}%</span>
      <span className={`font-normal ${dark ? 'text-white/60' : 'text-slate-400'}`}>{label}</span>
    </div>
  );
};

/* ─── Bar Chart ────────────────────────────────────────────── */
const MonthlyChart: React.FC<{ data: any[]; year: number }> = ({ data, year }) => {
  const maxRevenue = useMemo(() => Math.max(...data.map(m => m.total), 1), [data]);
  const fullYear = useMemo(() => {
    const map = new Map(data.map(m => [m.month, m]));
    return Array.from({ length: 12 }, (_, i) => map.get(i + 1) || { month: i + 1, total: 0, count: 0 });
  }, [data]);

  return (
    <div className="flex gap-1.5 h-64 pt-8 pb-1">
      {fullYear.map((m, i) => {
        const pct = maxRevenue > 0 ? (m.total / maxRevenue) * 100 : 0;
        const hasData = m.total > 0;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group relative">
            {/* Tooltip */}
            {hasData && (
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100
                pointer-events-none transition-all duration-200 z-10 -translate-y-full">
                <div className="bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                  ${m.total.toFixed(2)}
                  <div className="text-slate-400 font-normal text-[0.6875rem]">{m.count} payment{m.count !== 1 ? 's' : ''}</div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                    <div className="w-2 h-2 bg-slate-800 rotate-45 -mt-1" />
                  </div>
                </div>
              </div>
            )}

            {/* Value label */}
            <span className={`text-[0.625rem] font-bold transition-opacity
              ${hasData ? 'text-indigo-500 opacity-0 group-hover:opacity-100' : 'opacity-0'}`}>
              {formatCurrency(m.total)}
            </span>

            {/* Bar */}
            <div className="w-full flex-1 flex items-end">
              <div
                className={`w-full rounded-t-md transition-all duration-500 ease-out
                  ${hasData
                    ? 'bg-gradient-to-t from-indigo-600 to-indigo-400 group-hover:from-indigo-500 group-hover:to-indigo-300 shadow-sm'
                    : 'bg-slate-100'}`}
                style={{ height: `${Math.max(pct, hasData ? 8 : 2)}%` }}
              />
            </div>

            {/* Month label */}
            <span className="text-[0.6875rem] font-medium text-slate-400 group-hover:text-slate-600 transition-colors">
              {MONTH_NAMES[i]}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/* ─── Payment Method Row ───────────────────────────────────── */
const PaymentMethodRow: React.FC<{
  method: any; total: number; idx: number;
}> = ({ method, total, idx }) => {
  const c = METHOD_COLORS[idx % METHOD_COLORS.length];
  const pct = total > 0 ? ((method.total / total) * 100) : 0;
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className={`w-2.5 h-2.5 rounded-full ${c.bg}`} />
          <span className="text-sm font-medium text-slate-700">{formatPaymentMethod(method._id)}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-sm font-bold ${c.text}`}>${method.total.toFixed(2)}</span>
          <span className="text-xs text-slate-400 w-12 text-right">{pct.toFixed(1)}%</span>
        </div>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${c.bg} transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-slate-400 mt-1 pl-5">{method.count} transaction{method.count !== 1 ? 's' : ''}</p>
    </div>
  );
};

/* ─── Top Customer Row ─────────────────────────────────────── */
const CustomerRow: React.FC<{ customer: any; rank: number }> = ({ customer, rank }) => {
  const rankColors = [
    'from-amber-400 to-yellow-500 ring-amber-200',
    'from-slate-300 to-slate-400 ring-slate-200',
    'from-orange-300 to-orange-400 ring-orange-200',
  ];
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200
      ${rank === 0 ? 'bg-amber-50/60 border border-amber-200/60' : 'bg-slate-50/50 hover:bg-slate-100/50 border border-transparent'}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0
        ${rank < 3
          ? `bg-gradient-to-br ${rankColors[rank]} text-white shadow-sm ring-2 ${rankColors[rank].split(' ').pop()}`
          : 'bg-slate-200 text-slate-600'}`}>
        {rank < 3 ? medals[rank] : `#${rank + 1}`}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-800 truncate">{customer.name}</p>
        <p className="text-xs text-slate-400 mt-0.5">
          {customer.paymentCount} payment{customer.paymentCount !== 1 ? 's' : ''} &bull; {customer.projectCount || 0} project{(customer.projectCount || 0) !== 1 ? 's' : ''}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-lg font-bold text-emerald-600">${customer.totalRevenue.toFixed(2)}</p>
        {customer.outstandingBalance > 0 && (
          <p className="text-xs font-medium text-red-500 mt-0.5">${customer.outstandingBalance.toFixed(2)} pending</p>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
const RevenueAnalytics: React.FC = () => {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => { fetchRevenueData(); }, [selectedYear]);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      const response = await apiRequest(`/api/admin/analytics/revenue?year=${selectedYear}`);
      if (response.ok) {
        const apiData = await response.json();
        const monthlyRevenue = (apiData.yearlyByMonth || []).map((m: any) => ({
          month: m._id?.month || m.month,
          total: m.total || 0,
          count: m.count || 0,
        }));
        const yearlyTotal = monthlyRevenue.reduce((sum: number, m: any) => sum + (m.total || 0), 0);

        let totalRevenue = yearlyTotal;
        try {
          const allPaymentsResponse = await apiRequest('/api/admin/payments?status=completed');
          if (allPaymentsResponse.ok) {
            const allPayments = await allPaymentsResponse.json();
            totalRevenue = allPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
          }
        } catch { /* fallback to yearly */ }

        setData({
          totalRevenue,
          monthlyRevenue,
          yearlyRevenue: [{ year: selectedYear, total: yearlyTotal }],
          topCustomers: apiData.topCustomers || [],
          paymentMethodBreakdown: apiData.paymentMethods || [],
        });
      }
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  /* ── Derived values ────────────────────────── */
  const computed = useMemo(() => {
    if (!data) return null;

    const currentMonth = data.monthlyRevenue?.[data.monthlyRevenue.length - 1] ?? null;
    const prevMonth = data.monthlyRevenue?.[data.monthlyRevenue.length - 2] ?? null;
    const monthGrowth = prevMonth && currentMonth
      ? +((currentMonth.total - prevMonth.total) / prevMonth.total * 100).toFixed(1)
      : 0;

    const yearTotal = data.yearlyRevenue?.[0]?.total ?? 0;
    const totalPayments = data.monthlyRevenue?.reduce((s, m) => s + (m.count || 0), 0) ?? 0;
    const avgTransaction = totalPayments > 0 ? yearTotal / totalPayments : 0;

    return { currentMonth, monthGrowth, yearTotal, totalPayments, avgTransaction };
  }, [data]);

  /* ── Loading state ─────────────────────────── */
  if (loading) {
    return <PageLoader variant="analytics" />;
  }

  if (!data || !computed) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <BarChart3 size={48} className="mx-auto mb-4 text-slate-300" />
          <p className="text-slate-500 font-medium">No revenue data available</p>
          <button onClick={fetchRevenueData} className="mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-semibold">
            Try again
          </button>
        </div>
      </div>
    );
  }

  const currentMonthName = computed.currentMonth
    ? MONTH_FULL[(computed.currentMonth.month ?? new Date().getMonth() + 1) - 1]
    : MONTH_FULL[new Date().getMonth()];

  return (
    <div className="animate-fade-in space-y-6 max-w-[1600px]">
      {/* ── Header ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-xl">
              <BarChart3 size={22} className="text-indigo-600" />
            </div>
            Revenue Analytics
          </h1>
          <p className="text-slate-500 text-sm mt-1">Track business performance and revenue streams</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 
              hover:border-indigo-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 
              outline-none cursor-pointer transition-all shadow-sm"
          >
            {[2024, 2025, 2026, 2027].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <button
            onClick={fetchRevenueData}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm 
              font-semibold text-slate-600 hover:border-indigo-300 hover:text-indigo-600 
              transition-all shadow-sm"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── KPI Cards ──────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          icon={<DollarSign size={22} />}
          label="Total Revenue"
          value={`$${data.totalRevenue.toFixed(2)}`}
          sub={<span className="text-sm text-emerald-200/80 font-medium">All-time earnings</span>}
          gradient="bg-gradient-to-br from-emerald-600 to-teal-700 shadow-lg shadow-emerald-200/40"
          dark
        />
        <StatCard
          icon={<Calendar size={22} className="text-indigo-500" />}
          label={currentMonthName}
          value={`$${computed.currentMonth?.total?.toFixed(2) ?? '0.00'}`}
          sub={<GrowthBadge value={computed.monthGrowth} label="vs last month" />}
        />
        <StatCard
          icon={<TrendingUp size={22} className="text-blue-500" />}
          label={`Year ${selectedYear}`}
          value={`$${computed.yearTotal.toFixed(2)}`}
          sub={
            <span className="text-sm text-slate-400 font-medium">
              {computed.totalPayments} total payment{computed.totalPayments !== 1 ? 's' : ''}
            </span>
          }
        />
        <StatCard
          icon={<CreditCard size={22} className="text-amber-500" />}
          label="Avg Transaction"
          value={`$${computed.avgTransaction.toFixed(2)}`}
          sub={
            <span className="text-sm text-slate-400 font-medium">
              per payment
            </span>
          }
        />
      </div>

      {/* ── Charts Row ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Monthly Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-800">Monthly Revenue</h3>
              <p className="text-xs text-slate-400 mt-0.5">{selectedYear} breakdown</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <div className="w-3 h-3 rounded bg-gradient-to-t from-indigo-600 to-indigo-400" />
              Revenue
            </div>
          </div>
          {data.monthlyRevenue.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-slate-400">
              <div className="text-center">
                <BarChart3 size={32} className="mx-auto mb-2 text-slate-300" />
                <p className="text-sm">No revenue data for {selectedYear}</p>
              </div>
            </div>
          ) : (
            <MonthlyChart data={data.monthlyRevenue} year={selectedYear} />
          )}
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="p-1.5 bg-violet-100 rounded-lg">
              <PieChart size={16} className="text-violet-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Payment Methods</h3>
              <p className="text-xs text-slate-400 mt-0.5">Revenue by channel</p>
            </div>
          </div>
          {!data.paymentMethodBreakdown || data.paymentMethodBreakdown.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-slate-400">
              <div className="text-center">
                <Wallet size={28} className="mx-auto mb-2 text-slate-300" />
                <p className="text-sm">No payment data</p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {data.paymentMethodBreakdown.map((method, i) => (
                <PaymentMethodRow
                  key={method._id || i}
                  method={method}
                  total={data.yearlyRevenue?.[0]?.total || 1}
                  idx={i}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Top Customers ──────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-100 rounded-lg">
              <Award size={16} className="text-amber-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Top Customers</h3>
              <p className="text-xs text-slate-400 mt-0.5">Ranked by total revenue</p>
            </div>
          </div>
          <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full font-medium">
            {data.topCustomers.length} customer{data.topCustomers.length !== 1 ? 's' : ''}
          </span>
        </div>
        {!data.topCustomers || data.topCustomers.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-slate-400">
            <div className="text-center">
              <Users size={32} className="mx-auto mb-2 text-slate-300" />
              <p className="text-sm">No customer data available</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {data.topCustomers.map((customer, i) => (
              <CustomerRow key={customer._id} customer={customer} rank={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueAnalytics;
