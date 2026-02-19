import React, { useEffect, useState } from 'react';
import {
  Send, Upload, X, FileText, User, Mail, GraduationCap, BookOpen,
  Briefcase, MessageSquare, CheckCircle, AlertCircle, RefreshCw,
  Search, Package, Trash2
} from 'lucide-react';
import { apiRequest } from '../utils/api';

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  university?: string;
  course?: string;
  projects: {
    _id: string;
    title: string;
    status: string;
  }[];
}

interface DeliveryHistory {
  recipientName: string;
  recipientEmail: string;
  projectTitle: string;
  filesCount: number;
  timestamp: string;
}

const DocumentDelivery: React.FC = () => {
  // Customer data
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [projectType, setProjectType] = useState('');
  const [university, setUniversity] = useState('');
  const [course, setCourse] = useState('');
  const [message, setMessage] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');

  // Files
  const [files, setFiles] = useState<File[]>([]);

  // UI state
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deliveryHistory, setDeliveryHistory] = useState<DeliveryHistory[]>([]);
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);

  useEffect(() => {
    fetchCustomers();
    // Load delivery history from localStorage
    const history = localStorage.getItem('delivery_history');
    if (history) {
      try { setDeliveryHistory(JSON.parse(history)); } catch { }
    }
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoadingCustomers(true);
      const res = await apiRequest('/api/admin/customers', { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        setCustomers(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const selectCustomer = (customer: Customer) => {
    setRecipientName(customer.name);
    setRecipientEmail(customer.email);
    setUniversity(customer.university || '');
    setCourse(customer.course || '');
    setSelectedCustomerId(customer._id);
    setSelectedProjectId('');
    setShowCustomerSearch(false);
    setSearchTerm('');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
    // Reset input
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return '📕';
      case 'doc': case 'docx': return '📘';
      case 'xls': case 'xlsx': return '📗';
      case 'ppt': case 'pptx': return '📙';
      case 'zip': case 'rar': case '7z': return '📦';
      case 'py': case 'ipynb': return '🐍';
      case 'js': case 'ts': return '💻';
      case 'csv': return '📊';
      case 'jpg': case 'jpeg': case 'png': case 'gif': return '🖼️';
      default: return '📄';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!recipientEmail || !recipientName || !projectTitle) {
      setError('Please fill in recipient name, email, and project title');
      return;
    }

    if (files.length === 0) {
      setError('Please attach at least one document to deliver');
      return;
    }

    try {
      setSending(true);

      const formData = new FormData();
      formData.append('recipientEmail', recipientEmail);
      formData.append('recipientName', recipientName);
      formData.append('projectTitle', projectTitle);
      formData.append('projectType', projectType);
      formData.append('university', university);
      formData.append('course', course);
      formData.append('message', message);
      if (selectedCustomerId) formData.append('customerId', selectedCustomerId);
      if (selectedProjectId) formData.append('projectId', selectedProjectId);

      files.forEach(file => {
        formData.append('documents', file);
      });

      const res = await apiRequest('/api/admin/deliver-documents', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to deliver documents');
      }

      const data = await res.json();
      setSuccess(data.message || 'Documents delivered successfully!');

      // Save to local delivery history
      const newEntry: DeliveryHistory = {
        recipientName,
        recipientEmail,
        projectTitle,
        filesCount: files.length,
        timestamp: new Date().toISOString(),
      };
      const updatedHistory = [newEntry, ...deliveryHistory].slice(0, 20);
      setDeliveryHistory(updatedHistory);
      localStorage.setItem('delivery_history', JSON.stringify(updatedHistory));

      // Reset form
      setRecipientName('');
      setRecipientEmail('');
      setProjectTitle('');
      setProjectType('');
      setUniversity('');
      setCourse('');
      setMessage('');
      setFiles([]);
      setSelectedCustomerId('');
      setSelectedProjectId('');
    } catch (err: any) {
      setError(err.message || 'Failed to deliver documents');
    } finally {
      setSending(false);
    }
  };

  const selectedCustomer = customers.find(c => c._id === selectedCustomerId);
  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <Package className="text-blue-600" size={28} />
            Document Delivery
          </h1>
          <p className="text-slate-500 mt-1">
            Send project documents to your customers via professional email
          </p>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 animate-fade-in">
          <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-green-800 font-semibold text-sm">Delivery Successful!</p>
            <p className="text-green-700 text-sm mt-0.5">{success}</p>
          </div>
          <button onClick={() => setSuccess(null)} className="ml-auto text-green-600 hover:text-green-800">
            <X size={16} />
          </button>
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-fade-in">
          <AlertCircle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-red-800 font-semibold text-sm">Delivery Failed</p>
            <p className="text-red-700 text-sm mt-0.5">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="ml-auto text-red-600 hover:text-red-800">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form - takes 2 columns */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Send size={18} />
                Send Project Files
              </h2>
              <p className="text-blue-100 text-sm mt-1">Fill in the details and attach documents to deliver</p>
            </div>

            <div className="p-6 space-y-5">
              {/* Quick Customer Select */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Customer (optional)
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCustomerSearch(!showCustomerSearch)}
                    className="w-full flex items-center justify-between px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white hover:bg-slate-50 transition-colors text-left"
                  >
                    {selectedCustomer ? (
                      <span className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">
                          {selectedCustomer.name.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-800">{selectedCustomer.name}</span>
                        <span className="text-slate-400">({selectedCustomer.email})</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 flex items-center gap-2">
                        <Search size={14} />
                        Search and select a customer...
                      </span>
                    )}
                    <span className="text-slate-400">{showCustomerSearch ? '▲' : '▼'}</span>
                  </button>

                  {showCustomerSearch && (
                    <div className="absolute z-20 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-64 overflow-hidden">
                      <div className="p-2 border-b border-slate-100">
                        <div className="relative">
                          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name or email..."
                            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                            autoFocus
                          />
                        </div>
                      </div>
                      <div className="overflow-y-auto max-h-48">
                        {loadingCustomers ? (
                          <div className="p-4 text-center text-slate-400 text-sm">
                            <RefreshCw size={16} className="animate-spin inline mr-2" /> Loading...
                          </div>
                        ) : filteredCustomers.length === 0 ? (
                          <div className="p-4 text-center text-slate-400 text-sm">No customers found</div>
                        ) : (
                          filteredCustomers.map(c => (
                            <button
                              key={c._id}
                              type="button"
                              onClick={() => selectCustomer(c)}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-blue-50 transition-colors text-sm"
                            >
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                                {c.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-slate-800 truncate">{c.name}</p>
                                <p className="text-xs text-slate-400 truncate">{c.email}</p>
                              </div>
                              {c.projects?.length > 0 && (
                                <span className="ml-auto text-xs text-slate-400 flex-shrink-0">
                                  {c.projects.length} project{c.projects.length !== 1 ? 's' : ''}
                                </span>
                              )}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer project select */}
              {selectedCustomer && selectedCustomer.projects?.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Link to Project
                  </label>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => {
                      setSelectedProjectId(e.target.value);
                      const proj = selectedCustomer.projects.find(p => p._id === e.target.value);
                      if (proj) setProjectTitle(proj.title);
                    }}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="">Select a project (optional)</option>
                    {selectedCustomer.projects.map(p => (
                      <option key={p._id} value={p._id}>
                        {p.title} ({p.status})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Recipient Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Recipient Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Customer's full name"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Recipient Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="customer@email.com"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Project Title <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      placeholder="e.g. Sales Prediction System"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Project Type
                  </label>
                  <div className="relative">
                    <FileText size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      placeholder="e.g. Machine Learning, Data Science"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* University & Course */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">University</label>
                  <div className="relative">
                    <GraduationCap size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      placeholder="University name"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Course</label>
                  <div className="relative">
                    <BookOpen size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      placeholder="Course/Program"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <MessageSquare size={14} className="inline mr-1" />
                  Personal Message (optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a personal note for the customer... e.g. includes source code, documentation, and data files."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Upload size={14} className="inline mr-1" />
                  Project Documents <span className="text-red-500">*</span>
                </label>
                
                {/* Drop zone */}
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer relative">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.7z,.py,.ipynb,.csv,.txt,.js,.ts,.html,.css,.json,.jpg,.jpeg,.png,.gif,.mp4,.avi"
                  />
                  <Upload size={32} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-sm font-medium text-slate-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    PDF, Word, Excel, PowerPoint, ZIP, Python, Code files • Max 50MB each
                  </p>
                </div>

                {/* File list */}
                {files.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {files.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-100 group hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-lg">{getFileIcon(file.name)}</span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
                            <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center justify-between px-2 pt-1">
                      <p className="text-xs text-slate-400">
                        {files.length} file{files.length !== 1 ? 's' : ''} •{' '}
                        {formatFileSize(files.reduce((sum, f) => sum + f.size, 0))} total
                      </p>
                      <button
                        type="button"
                        onClick={() => setFiles([])}
                        className="text-xs text-red-500 hover:text-red-700 font-medium"
                      >
                        Clear all
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-400">
                Documents will be emailed with a professional delivery template
              </p>
              <button
                type="submit"
                disabled={sending || files.length === 0 || !recipientEmail || !recipientName || !projectTitle}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-blue-200"
              >
                {sending ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Delivering...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Deliver Documents
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Sidebar - Delivery History */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-8">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                <Package size={16} className="text-blue-600" />
                Recent Deliveries
              </h3>
            </div>

            {deliveryHistory.length === 0 ? (
              <div className="p-8 text-center">
                <Package size={36} className="mx-auto text-slate-200 mb-3" />
                <p className="text-sm text-slate-400">No deliveries yet</p>
                <p className="text-xs text-slate-300 mt-1">Your delivery history will appear here</p>
              </div>
            ) : (
              <div className="max-h-[560px] overflow-y-auto divide-y divide-slate-50">
                {deliveryHistory.map((entry, idx) => (
                  <div key={idx} className="px-5 py-3.5 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-700 truncate">
                          {entry.projectTitle}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 truncate flex items-center gap-1">
                          <User size={10} />
                          {entry.recipientName}
                        </p>
                        <p className="text-xs text-slate-400 truncate flex items-center gap-1">
                          <Mail size={10} />
                          {entry.recipientEmail}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">
                          <CheckCircle size={10} />
                          Sent
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
                      <span>{entry.filesCount} file{entry.filesCount !== 1 ? 's' : ''}</span>
                      <span>
                        {new Date(entry.timestamp).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {deliveryHistory.length > 0 && (
              <div className="px-5 py-3 border-t border-slate-100 bg-slate-50">
                <button
                  onClick={() => {
                    if (confirm('Clear delivery history?')) {
                      setDeliveryHistory([]);
                      localStorage.removeItem('delivery_history');
                    }
                  }}
                  className="text-xs text-red-500 hover:text-red-700 font-medium"
                >
                  Clear History
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDelivery;
