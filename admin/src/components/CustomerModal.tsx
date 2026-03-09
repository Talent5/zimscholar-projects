import React, { useState, useEffect } from 'react';
import {
  X, Save, User, Mail, Phone, Building2, Tag, DollarSign,
  Calendar, FileText, Plus, Trash2, ChevronDown, Loader2,
  Briefcase, Globe, MessageSquare
} from 'lucide-react';
import { apiRequest } from '../utils/api';

/* ─── Types ──────────────────────────────── */
interface Project {
  title: string;
  description: string;
  status: string;
  stage: string;
  progress: number;
  budget: number;
  actualCost: number;
  startDate: string;
  endDate: string;
}

interface CustomerModalProps {
  customer?: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

/* ─── Constants ──────────────────────────── */
const PROJECT_STATUSES = [
  { value: 'inquiry',         label: 'Inquiry',         color: 'bg-slate-100 text-slate-600' },
  { value: 'quotation-sent',  label: 'Quotation Sent',  color: 'bg-amber-50 text-amber-600' },
  { value: 'accepted',        label: 'Accepted',        color: 'bg-blue-50 text-blue-600' },
  { value: 'in-progress',     label: 'In Progress',     color: 'bg-indigo-50 text-indigo-600' },
  { value: 'review',          label: 'Review',          color: 'bg-purple-50 text-purple-600' },
  { value: 'completed',       label: 'Completed',       color: 'bg-emerald-50 text-emerald-600' },
  { value: 'delivered',       label: 'Delivered',       color: 'bg-green-50 text-green-700' },
  { value: 'cancelled',       label: 'Cancelled',       color: 'bg-red-50 text-red-600' },
];

const SOURCE_OPTIONS = [
  { value: 'website',      label: 'Website',      icon: <Globe size={14} /> },
  { value: 'phone',        label: 'Phone Call',    icon: <Phone size={14} /> },
  { value: 'email',        label: 'Email',         icon: <Mail size={14} /> },
  { value: 'whatsapp',     label: 'WhatsApp',      icon: <MessageSquare size={14} /> },
  { value: 'referral',     label: 'Referral',      icon: <User size={14} /> },
  { value: 'social_media', label: 'Social Media',  icon: <Globe size={14} /> },
  { value: 'walk_in',      label: 'Walk-in',       icon: <Building2 size={14} /> },
  { value: 'other',        label: 'Other',         icon: <Tag size={14} /> },
];

const emptyProject = (): Project => ({
  title: '',
  description: '',
  status: 'inquiry',
  stage: 'requirements',
  progress: 0,
  budget: 0,
  actualCost: 0,
  startDate: new Date().toISOString().split('T')[0],
  endDate: '',
});

/* ─── Shared UI ──────────────────────────── */
const inputCls = 'w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-300';
const selectCls = `${inputCls} appearance-none cursor-pointer bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-8`;

const Field: React.FC<{
  label: string;
  icon?: React.ReactNode;
  required?: boolean;
  span?: boolean;
  children: React.ReactNode;
}> = ({ label, icon, required, span, children }) => (
  <div className={span ? 'col-span-2' : ''}>
    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
      {icon}
      {label}
      {required && <span className="text-red-400">*</span>}
    </label>
    {children}
  </div>
);

/* ─── Component ──────────────────────────── */
const CustomerModal: React.FC<CustomerModalProps> = ({ customer, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    university: '',
    status: 'lead' as 'lead' | 'active' | 'inactive' | 'vip',
    source: 'website' as string,
    outstandingBalance: 0,
  });

  const [projects, setProjects] = useState<Project[]>([emptyProject()]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'projects'>('details');

  /* ── Populate form ── */
  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        university: customer.university || '',
        status: customer.status || 'lead',
        source: customer.source || 'website',
        outstandingBalance: customer.outstandingBalance || 0,
      });
      const formatted = (customer.projects || []).map((p: any) => ({
        title: p.title || '',
        description: p.description || '',
        status: p.status || 'inquiry',
        stage: p.stage || 'requirements',
        progress: p.progress || 0,
        budget: p.budget || 0,
        actualCost: p.actualCost || 0,
        startDate: p.startDate ? new Date(p.startDate).toISOString().split('T')[0] : '',
        endDate: p.endDate ? new Date(p.endDate).toISOString().split('T')[0] : '',
      }));
      setProjects(formatted.length > 0 ? formatted : [emptyProject()]);
    } else {
      setFormData({ name: '', email: '', phone: '', university: '', status: 'lead', source: 'website', outstandingBalance: 0 });
      setProjects([emptyProject()]);
    }
    setActiveTab('details');
  }, [customer, isOpen]);

  /* ── Submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validProjects = projects.filter(p => p.title && p.budget > 0);
    if (validProjects.length === 0) {
      alert('Please add at least one project with a title and budget');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        projects: validProjects.map(p => ({ ...p, startDate: p.startDate || null, endDate: p.endDate || null })),
      };

      const url = customer?._id ? `/api/admin/customers/${customer._id}` : '/api/admin/customers';
      const method = customer?._id ? 'PUT' : 'POST';
      const response = await apiRequest(url, { method, body: JSON.stringify(payload) });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save customer');
      }

      onSave();
      onClose();
    } catch (error: any) {
      alert(error.message || 'Failed to save customer');
    } finally {
      setLoading(false);
    }
  };

  /* ── Project helpers ── */
  const addProject = () => setProjects([...projects, emptyProject()]);
  const removeProject = (i: number) => setProjects(projects.filter((_, idx) => idx !== i));
  const updateProject = (i: number, field: string, value: any) => {
    const updated = [...projects];
    updated[i] = { ...updated[i], [field]: value };
    setProjects(updated);
  };

  const totalBudget = projects.reduce((s, p) => s + (p.budget || 0), 0);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-[95%] max-w-[860px] max-h-[92vh] overflow-hidden shadow-2xl flex flex-col animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* ═══ Header ═══ */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 px-6 py-5 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold text-white">
              {customer ? 'Edit Customer' : 'New Customer'}
            </h2>
            <p className="text-indigo-200 text-sm mt-0.5">
              {customer ? 'Update profile and project details' : 'Create a new customer record'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* ═══ Tabs ═══ */}
        <div className="border-b border-slate-200 bg-slate-50/50 px-6 flex gap-0 shrink-0">
          {[
            { key: 'details' as const, label: 'Customer Details', icon: <User size={14} /> },
            { key: 'projects' as const, label: `Projects (${projects.length})`, icon: <Briefcase size={14} /> },
          ].map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === tab.key
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ═══ Body ═══ */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          {/* ── Details Tab ── */}
          {activeTab === 'details' && (
            <div className="p-6 space-y-6 animate-fade-in">
              {/* Personal info */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <div className="w-1 h-4 bg-indigo-500 rounded-full" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Full Name" icon={<User size={13} />} required>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className={inputCls}
                      placeholder="John Doe"
                    />
                  </Field>
                  <Field label="Email Address" icon={<Mail size={13} />} required>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className={inputCls}
                      placeholder="john@example.com"
                    />
                  </Field>
                  <Field label="Phone Number" icon={<Phone size={13} />} required>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className={inputCls}
                      placeholder="+263771234567"
                    />
                  </Field>
                  <Field label="University / Company" icon={<Building2 size={13} />}>
                    <input
                      type="text"
                      value={formData.university}
                      onChange={e => setFormData({ ...formData, university: e.target.value })}
                      className={inputCls}
                      placeholder="University of Zimbabwe"
                    />
                  </Field>
                </div>
              </div>

              {/* Classification */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                  Classification
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Customer Status" icon={<Tag size={13} />}>
                    <div className="flex gap-2">
                      {(['lead', 'active', 'inactive'] as const).map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setFormData({ ...formData, status: s })}
                          className={`flex-1 py-2.5 text-xs font-semibold rounded-lg border-2 transition-all ${
                            formData.status === s
                              ? s === 'active'
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                : s === 'inactive'
                                ? 'border-slate-400 bg-slate-50 text-slate-700'
                                : 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                          }`}
                        >
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                      ))}
                    </div>
                  </Field>
                  <Field label="Lead Source" icon={<Globe size={13} />}>
                    <select
                      value={formData.source}
                      onChange={e => setFormData({ ...formData, source: e.target.value })}
                      className={selectCls}
                    >
                      {SOURCE_OPTIONS.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </Field>
                </div>
              </div>
            </div>
          )}

          {/* ── Projects Tab ── */}
          {activeTab === 'projects' && (
            <div className="p-6 space-y-4 animate-fade-in">
              {/* Summary bar */}
              <div className="flex items-center justify-between bg-slate-50 rounded-lg p-3 border border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="text-xs text-slate-500">
                    <span className="font-semibold text-slate-800">{projects.length}</span> project{projects.length !== 1 ? 's' : ''}
                  </div>
                  <div className="w-px h-4 bg-slate-200" />
                  <div className="text-xs text-slate-500">
                    Total Budget: <span className="font-semibold text-emerald-600">${totalBudget.toLocaleString()}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addProject}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 border border-indigo-200 transition-colors"
                >
                  <Plus size={14} />
                  Add Project
                </button>
              </div>

              {/* Project cards */}
              {projects.map((project, index) => {
                const statusMeta = PROJECT_STATUSES.find(s => s.value === project.status) || PROJECT_STATUSES[0];
                return (
                  <div key={index} className="border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-slate-300 transition-colors">
                    {/* Project header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-50/60 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <span className="text-sm font-semibold text-slate-700">
                          {project.title || 'Untitled Project'}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusMeta.color}`}>
                          {statusMeta.label}
                        </span>
                      </div>
                      {projects.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProject(index)}
                          className="p-1.5 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    {/* Project fields */}
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Project Title" icon={<FileText size={13} />} required span>
                        <input
                          type="text"
                          value={project.title}
                          onChange={e => updateProject(index, 'title', e.target.value)}
                          className={inputCls}
                          placeholder="e.g., Student Management System"
                        />
                      </Field>

                      <Field label="Description" span>
                        <textarea
                          value={project.description}
                          onChange={e => updateProject(index, 'description', e.target.value)}
                          rows={2}
                          className={`${inputCls} resize-none`}
                          placeholder="Brief project description..."
                        />
                      </Field>

                      <Field label="Total Price (USD)" icon={<DollarSign size={13} />} required>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={project.budget}
                          onChange={e => updateProject(index, 'budget', parseFloat(e.target.value) || 0)}
                          className={inputCls}
                          placeholder="0.00"
                        />
                      </Field>

                      <Field label="Status" icon={<Tag size={13} />}>
                        <select
                          value={project.status}
                          onChange={e => updateProject(index, 'status', e.target.value)}
                          className={selectCls}
                        >
                          {PROJECT_STATUSES.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                      </Field>

                      <Field label="Start Date" icon={<Calendar size={13} />}>
                        <input
                          type="date"
                          value={project.startDate}
                          onChange={e => updateProject(index, 'startDate', e.target.value)}
                          className={inputCls}
                        />
                      </Field>

                      <Field label="Expected End Date" icon={<Calendar size={13} />}>
                        <input
                          type="date"
                          value={project.endDate}
                          onChange={e => updateProject(index, 'endDate', e.target.value)}
                          className={inputCls}
                        />
                      </Field>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ═══ Footer ═══ */}
          <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
            <div className="text-xs text-slate-400">
              {projects.filter(p => p.title && p.budget > 0).length} valid project{projects.filter(p => p.title && p.budget > 0).length !== 1 ? 's' : ''}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {loading ? 'Saving...' : customer ? 'Update Customer' : 'Create Customer'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerModal;
