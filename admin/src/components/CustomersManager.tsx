import React, { useEffect, useState, useMemo } from 'react';
import {
  Search, RefreshCw, Plus, Trash2, Eye, ChevronDown, ChevronUp,
  Users, Briefcase, TrendingUp, DollarSign, Receipt, Star,
  ArrowUpRight, ArrowDownRight, UserCheck, UserX, Crown,
  Filter, Download, MoreHorizontal, ChevronLeft, ChevronRight,
  Mail, Phone, Building2, Calendar, AlertCircle, CheckCircle2,
  Clock, ExternalLink
} from 'lucide-react';
import { apiRequest } from '../utils/api';
import CustomerModal from './CustomerModal';
import PageLoader from './PageLoader';
import PaymentModal from './PaymentModal';
import PaymentHistoryModal from './PaymentHistoryModal';

/* ─── Types ──────────────────────────────── */
interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  university?: string;
  status: 'lead' | 'active' | 'inactive' | 'vip';
  totalRevenue: number;
  outstandingBalance: number;
  projectCount: number;
  activeProjects: number;
  projects: any[];
  createdAt: string;
}

type SortField = 'name' | 'totalRevenue' | 'outstandingBalance' | 'projectCount' | 'createdAt';
type SortDir = 'asc' | 'desc';

/* ─── Helpers ────────────────────────────── */
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  vip:      { label: 'VIP',      color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200',   icon: <Crown size={14} /> },
  active:   { label: 'Active',   color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', icon: <UserCheck size={14} /> },
  lead:     { label: 'Lead',     color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',     icon: <Clock size={14} /> },
  inactive: { label: 'Inactive', color: 'text-slate-500',  bg: 'bg-slate-50 border-slate-200',   icon: <UserX size={14} /> },
};

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

/* ─── Sub-components ─────────────────────── */
const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  trend?: number;
  accent: string;
}> = ({ icon, label, value, sub, trend, accent }) => (
  <div className="bg-white rounded-xl border border-slate-200/80 p-5 hover:shadow-md transition-all duration-200 group">
    <div className="flex items-start justify-between mb-3">
      <div className={`w-10 h-10 rounded-lg ${accent} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      {trend !== undefined && (
        <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
          trend >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
        }`}>
          {trend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
    <p className="text-xs text-slate-500 mt-1 font-medium">{label}</p>
    {sub && <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>}
  </div>
);

const ROWS_PER_PAGE = 10;

/* ─── Main Component ─────────────────────── */
const CustomersManager: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [paymentTotals, setPaymentTotals] = useState<{ totalCharged: number; alreadyPaid: number }>({ totalCharged: 0, alreadyPaid: 0 });
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  /* ── Data fetching ── */
  useEffect(() => {
    fetchCustomers();
    fetchStats();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('/api/admin/customers');
      if (response.ok) {
        const data = await response.json();
        setCustomers(Array.isArray(data) ? data : []);
      } else {
        setCustomers([]);
      }
    } catch {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiRequest('/api/admin/analytics/customers');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch { /* silent */ }
  };

  const calculateCustomerTotals = async (customerId: string) => {
    try {
      const response = await apiRequest(`/api/admin/customers/${customerId}/payments`);
      if (response.ok) {
        const payments = await response.json();
        const totalCharged = customers.find(c => c._id === customerId)?.projects.reduce((sum, p) => sum + (p.budget || 0), 0) || 0;
        const alreadyPaid = payments.filter((p: any) => p.status === 'completed').reduce((sum: number, p: any) => sum + p.amount, 0);
        return { totalCharged, alreadyPaid, payments };
      }
    } catch { /* silent */ }
    return { totalCharged: 0, alreadyPaid: 0, payments: [] };
  };

  /* ── Actions ── */
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer? This action cannot be undone.')) return;
    try {
      const response = await apiRequest(`/api/admin/customers/${id}`, { method: 'DELETE' });
      if (response.ok) { fetchCustomers(); fetchStats(); }
      else alert('Failed to delete customer');
    } catch { alert('Failed to delete customer'); }
  };

  const handleRecordPayment = async (customer: Customer) => {
    const totals = await calculateCustomerTotals(customer._id);
    setPaymentTotals({ totalCharged: totals.totalCharged, alreadyPaid: totals.alreadyPaid });
    setSelectedCustomer(customer);
    setShowPaymentModal(true);
  };

  const handleViewPaymentHistory = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowPaymentHistory(true);
  };

  const handleModalClose = async () => {
    await fetchCustomers();
    await fetchStats();
  };

  /* ── Sorting ── */
  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('desc'); }
  };

  const SortIcon: React.FC<{ field: SortField }> = ({ field }) => {
    if (sortField !== field) return <ChevronDown size={14} className="text-slate-300" />;
    return sortDir === 'asc'
      ? <ChevronUp size={14} className="text-indigo-500" />
      : <ChevronDown size={14} className="text-indigo-500" />;
  };

  /* ── Derived data ── */
  const filtered = useMemo(() => {
    let list = customers.filter(c => {
      const q = searchTerm.toLowerCase();
      const matchSearch = !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(searchTerm);
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchSearch && matchStatus;
    });

    list.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'name': cmp = a.name.localeCompare(b.name); break;
        case 'totalRevenue': cmp = a.totalRevenue - b.totalRevenue; break;
        case 'outstandingBalance': cmp = a.outstandingBalance - b.outstandingBalance; break;
        case 'projectCount': cmp = a.projectCount - b.projectCount; break;
        case 'createdAt': cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(); break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return list;
  }, [customers, searchTerm, statusFilter, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [searchTerm, statusFilter]);

  // Computed stats
  const totalRevenue = customers.reduce((s, c) => s + (c.totalRevenue || 0), 0);
  const totalOutstanding = customers.reduce((s, c) => s + (c.outstandingBalance || 0), 0);
  const activeCount = customers.filter(c => c.status === 'active' || c.status === 'vip').length;

  /* ── Loading ── */
  if (loading) return <PageLoader variant="table" />;

  /* ── Render ── */
  return (
    <div className="space-y-6 animate-fade-in">
      {/* ═══ Header ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            {customers.length} total customers &middot; {activeCount} active
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchCustomers}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
          <button
            onClick={() => { setSelectedCustomer(null); setShowModal(true); }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-colors"
          >
            <Plus size={15} />
            Add Customer
          </button>
        </div>
      </div>

      {/* ═══ KPI Cards ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users size={20} className="text-indigo-600" />}
          label="Total Customers"
          value={customers.length}
          sub={`${customers.filter(c => c.status === 'lead').length} leads`}
          accent="bg-indigo-50"
        />
        <StatCard
          icon={<UserCheck size={20} className="text-emerald-600" />}
          label="Active Customers"
          value={activeCount}
          sub={`${stats?.vip || 0} VIP`}
          accent="bg-emerald-50"
        />
        <StatCard
          icon={<DollarSign size={20} className="text-blue-600" />}
          label="Total Revenue"
          value={fmt(totalRevenue)}
          accent="bg-blue-50"
        />
        <StatCard
          icon={<AlertCircle size={20} className="text-amber-600" />}
          label="Outstanding"
          value={fmt(totalOutstanding)}
          sub={totalOutstanding > 0 ? 'Requires follow-up' : 'All clear'}
          accent="bg-amber-50"
        />
      </div>

      {/* ═══ Filters Bar ═══ */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
          </div>

          {/* Status pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {['all', 'lead', 'active', 'vip', 'inactive'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  statusFilter === status
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {status === 'all' ? 'All' : STATUS_CONFIG[status]?.label || status}
                {status !== 'all' && (
                  <span className={`ml-1.5 ${statusFilter === status ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {customers.filter(c => c.status === status).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Active filter indicator */}
        {(searchTerm || statusFilter !== 'all') && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
            <Filter size={13} className="text-slate-400" />
            <span className="text-xs text-slate-500">
              Showing {filtered.length} of {customers.length} customers
            </span>
            <button
              onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
              className="text-xs text-indigo-600 font-medium hover:text-indigo-700 ml-auto"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* ═══ Table ═══ */}
      <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                {[
                  { key: 'name' as SortField, label: 'Customer', align: 'text-left' },
                  { key: null, label: 'Contact', align: 'text-left hidden lg:table-cell' },
                  { key: null, label: 'Status', align: 'text-center' },
                  { key: 'projectCount' as SortField, label: 'Projects', align: 'text-center hidden md:table-cell' },
                  { key: 'totalRevenue' as SortField, label: 'Revenue', align: 'text-right' },
                  { key: 'outstandingBalance' as SortField, label: 'Outstanding', align: 'text-right hidden md:table-cell' },
                  { key: null, label: 'Actions', align: 'text-center' },
                ].map((col, i) => (
                  <th
                    key={i}
                    className={`px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider ${col.align} ${
                      col.key ? 'cursor-pointer select-none hover:text-slate-700 group' : ''
                    }`}
                    onClick={col.key ? () => toggleSort(col.key!) : undefined}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      {col.key && <SortIcon field={col.key} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                        <Users size={24} className="text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">No customers found</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {searchTerm || statusFilter !== 'all'
                            ? 'Try adjusting your search or filters'
                            : 'Add your first customer to get started'}
                        </p>
                      </div>
                      {!searchTerm && statusFilter === 'all' && (
                        <button
                          onClick={() => { setSelectedCustomer(null); setShowModal(true); }}
                          className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                          <Plus size={15} /> Add Customer
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map(customer => {
                  const sc = STATUS_CONFIG[customer.status] || STATUS_CONFIG.inactive;
                  const isExpanded = expandedRow === customer._id;

                  return (
                    <React.Fragment key={customer._id}>
                      <tr
                        className="hover:bg-slate-50/60 transition-colors cursor-pointer"
                        onClick={() => setExpandedRow(isExpanded ? null : customer._id)}
                      >
                        {/* Customer */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                              customer.status === 'vip'
                                ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {customer.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-900 truncate">
                                {customer.name}
                                {customer.status === 'vip' && (
                                  <Star size={12} className="inline ml-1.5 text-amber-500 fill-amber-500" />
                                )}
                              </p>
                              {customer.university && (
                                <p className="text-xs text-slate-400 truncate flex items-center gap-1 mt-0.5">
                                  <Building2 size={11} />
                                  {customer.university}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="px-4 py-3.5 hidden lg:table-cell">
                          <div className="space-y-0.5">
                            <p className="text-sm text-slate-700 truncate flex items-center gap-1.5">
                              <Mail size={12} className="text-slate-400 shrink-0" />
                              {customer.email}
                            </p>
                            <p className="text-xs text-slate-400 flex items-center gap-1.5">
                              <Phone size={11} className="text-slate-400 shrink-0" />
                              {customer.phone}
                            </p>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${sc.bg} ${sc.color}`}>
                            {sc.icon}
                            {sc.label}
                          </span>
                        </td>

                        {/* Projects */}
                        <td className="px-4 py-3.5 text-center hidden md:table-cell">
                          <div>
                            <span className="text-sm font-semibold text-slate-800">{customer.projectCount || 0}</span>
                            {(customer.activeProjects || 0) > 0 && (
                              <span className="ml-1 text-[11px] text-emerald-600 font-medium">
                                ({customer.activeProjects} active)
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Revenue */}
                        <td className="px-4 py-3.5 text-right">
                          <span className="text-sm font-semibold text-slate-900">
                            {fmt(customer.totalRevenue || 0)}
                          </span>
                        </td>

                        {/* Outstanding */}
                        <td className="px-4 py-3.5 text-right hidden md:table-cell">
                          <span className={`text-sm font-semibold ${
                            customer.outstandingBalance > 0 ? 'text-red-600' : 'text-slate-400'
                          }`}>
                            {customer.outstandingBalance > 0 ? fmt(customer.outstandingBalance) : '—'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-center gap-1" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => handleViewPaymentHistory(customer)}
                              className="p-1.5 rounded-md text-amber-600 hover:bg-amber-50 transition-colors"
                              title="Payment History"
                            >
                              <Receipt size={15} />
                            </button>
                            <button
                              onClick={() => handleRecordPayment(customer)}
                              className="p-1.5 rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors"
                              title="Record Payment"
                            >
                              <DollarSign size={15} />
                            </button>
                            <button
                              onClick={() => { setSelectedCustomer(customer); setShowModal(true); }}
                              className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
                              title="View / Edit"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(customer._id)}
                              className="p-1.5 rounded-md text-red-500 hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* ─── Expanded detail row ─── */}
                      {isExpanded && (
                        <tr className="bg-slate-50/50">
                          <td colSpan={7} className="px-4 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
                              {/* Quick Info */}
                              <div className="bg-white rounded-lg border border-slate-200 p-4">
                                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Contact Details</h4>
                                <div className="space-y-2.5">
                                  <div className="flex items-center gap-2 text-sm">
                                    <Mail size={14} className="text-slate-400" />
                                    <span className="text-slate-700">{customer.email}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Phone size={14} className="text-slate-400" />
                                    <span className="text-slate-700">{customer.phone}</span>
                                  </div>
                                  {customer.university && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <Building2 size={14} className="text-slate-400" />
                                      <span className="text-slate-700">{customer.university}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2 text-sm">
                                    <Calendar size={14} className="text-slate-400" />
                                    <span className="text-slate-500">Joined {fmtDate(customer.createdAt)}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Financial Summary */}
                              <div className="bg-white rounded-lg border border-slate-200 p-4">
                                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Financial Summary</h4>
                                <div className="space-y-3">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-500">Total Revenue</span>
                                    <span className="text-sm font-semibold text-emerald-600">{fmt(customer.totalRevenue || 0)}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-500">Outstanding</span>
                                    <span className={`text-sm font-semibold ${customer.outstandingBalance > 0 ? 'text-red-600' : 'text-slate-400'}`}>
                                      {fmt(customer.outstandingBalance || 0)}
                                    </span>
                                  </div>
                                  <div className="pt-2 border-t border-slate-100 flex gap-2">
                                    <button
                                      onClick={() => handleRecordPayment(customer)}
                                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                                    >
                                      <DollarSign size={13} /> Record Payment
                                    </button>
                                    <button
                                      onClick={() => handleViewPaymentHistory(customer)}
                                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                                    >
                                      <Receipt size={13} /> History
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* Projects Overview */}
                              <div className="bg-white rounded-lg border border-slate-200 p-4">
                                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                  Projects ({customer.projectCount || 0})
                                </h4>
                                {customer.projects && customer.projects.length > 0 ? (
                                  <div className="space-y-2 max-h-32 overflow-y-auto">
                                    {customer.projects.slice(0, 5).map((proj: any, i: number) => (
                                      <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                                        <div className="min-w-0 flex-1 mr-2">
                                          <p className="text-sm text-slate-700 font-medium truncate">{proj.title || 'Untitled'}</p>
                                        </div>
                                        <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                          proj.status === 'completed' || proj.status === 'delivered'
                                            ? 'bg-emerald-50 text-emerald-600'
                                            : proj.status === 'in-progress'
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'bg-slate-100 text-slate-500'
                                        }`}>
                                          {proj.status || 'inquiry'}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm text-slate-400 italic">No projects yet</p>
                                )}
                                <button
                                  onClick={() => { setSelectedCustomer(customer); setShowModal(true); }}
                                  className="mt-3 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                                >
                                  <ExternalLink size={13} /> View Full Profile
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ─── Pagination ─── */}
        {filtered.length > ROWS_PER_PAGE && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/40">
            <p className="text-xs text-slate-500">
              Showing <span className="font-medium text-slate-700">{(page - 1) * ROWS_PER_PAGE + 1}</span>
              –<span className="font-medium text-slate-700">{Math.min(page * ROWS_PER_PAGE, filtered.length)}</span>
              {' '}of <span className="font-medium text-slate-700">{filtered.length}</span>
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-md text-slate-500 hover:bg-white hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border border-transparent hover:border-slate-200"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .map((p, idx, arr) => (
                  <React.Fragment key={p}>
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <span className="text-xs text-slate-400 px-1">…</span>
                    )}
                    <button
                      onClick={() => setPage(p)}
                      className={`min-w-[28px] h-7 text-xs font-medium rounded-md transition-colors ${
                        page === p
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-600 hover:bg-white hover:text-slate-800 border border-transparent hover:border-slate-200'
                      }`}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-md text-slate-500 hover:bg-white hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border border-transparent hover:border-slate-200"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ═══ Modals ═══ */}
      <CustomerModal
        customer={selectedCustomer}
        isOpen={showModal}
        onClose={() => { setShowModal(false); setSelectedCustomer(null); }}
        onSave={() => { fetchCustomers(); fetchStats(); }}
      />

      {selectedCustomer && (
        <PaymentModal
          customerId={selectedCustomer._id}
          customerName={selectedCustomer.name}
          totalCharged={paymentTotals.totalCharged}
          alreadyPaid={paymentTotals.alreadyPaid}
          isOpen={showPaymentModal}
          onClose={() => { setShowPaymentModal(false); setSelectedCustomer(null); }}
          onSave={handleModalClose}
        />
      )}

      {selectedCustomer && (
        <PaymentHistoryModal
          customerId={selectedCustomer._id}
          customerName={selectedCustomer.name}
          isOpen={showPaymentHistory}
          onClose={() => { setShowPaymentHistory(false); setSelectedCustomer(null); }}
          onUpdate={handleModalClose}
        />
      )}
    </div>
  );
};

export default CustomersManager;
