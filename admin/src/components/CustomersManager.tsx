import React, { useEffect, useState } from 'react';
import { Search, RefreshCw, Plus, Trash2, Eye, CheckCircle, Users, Briefcase, TrendingUp, DollarSign, Receipt } from 'lucide-react';
import { apiRequest } from '../utils/api';
import CustomerModal from './CustomerModal';
import PaymentModal from './PaymentModal';
import PaymentHistoryModal from './PaymentHistoryModal';

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
  const [paymentTotals, setPaymentTotals] = useState<{totalCharged: number; alreadyPaid: number}>({ totalCharged: 0, alreadyPaid: 0 });

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
        console.log('Customers fetched:', data.length);
      } else {
        console.error('Failed to fetch customers');
        setCustomers([]);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
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
        console.log('Stats fetched:', data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Calculate actual totals from payment data
  const calculateCustomerTotals = async (customerId: string) => {
    try {
      const response = await apiRequest(`/api/admin/customers/${customerId}/payments`);
      if (response.ok) {
        const payments = await response.json();
        const totalCharged = customers.find(c => c._id === customerId)?.projects.reduce((sum, p) => sum + (p.budget || 0), 0) || 0;
        const alreadyPaid = payments.filter((p: any) => p.status === 'completed').reduce((sum: number, p: any) => sum + p.amount, 0);
        return { totalCharged, alreadyPaid, payments };
      }
    } catch (error) {
      console.error('Error calculating totals:', error);
    }
    return { totalCharged: 0, alreadyPaid: 0, payments: [] };
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    
    try {
      const response = await apiRequest(`/api/admin/customers/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchCustomers();
        fetchStats();
      } else {
        alert('Failed to delete customer');
      }
    } catch (error) {
      alert('Failed to delete customer');
    }
  };

  const handleRecordPayment = async (customer: Customer) => {
    const totals = await calculateCustomerTotals(customer._id);
    setPaymentTotals({ totalCharged: totals.totalCharged, alreadyPaid: totals.alreadyPaid });
    setSelectedCustomer(customer);
    setShowPaymentModal(true);
  };

  const handleViewPaymentHistory = async (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowPaymentHistory(true);
  };

  const handleModalClose = async () => {
    await fetchCustomers();
    await fetchStats();
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'vip': return '#f59e0b';
      case 'active': return '#10b981';
      case 'lead': return '#3b82f6';
      case 'inactive': return '#6b7280';
      default: return '#9ca3af';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'vip': return '⭐';
      case 'active': return '✓';
      case 'lead': return '👤';
      case 'inactive': return '○';
      default: return '•';
    }
  };

  if (loading) {
    return (
      <div className="list-container">
        <h1>Customer Management</h1>
        <p>Loading customers...</p>
      </div>
    );
  }

  return (
    <div className="list-container">
      <div className="list-header">
        <div>
          <h1>Customer Management</h1>
          <p>{customers.length} customers</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={fetchCustomers} className="refresh-btn">
            <RefreshCw size={18} />
            Refresh
          </button>
          <button
            onClick={() => {
              setSelectedCustomer(null);
              setShowModal(true);
            }}
            className="btn-primary"
          >
            <Plus size={18} />
            Add Customer
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '1.5rem',
            borderRadius: '12px',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <Users size={24} />
              <span style={{ fontSize: '0.875rem', opacity: 0.9 }}>Total Customers</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700' }}>{stats.total}</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            padding: '1.5rem',
            borderRadius: '12px',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <CheckCircle size={24} />
              <span style={{ fontSize: '0.875rem', opacity: 0.9 }}>Active Customers</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700' }}>{stats.active}</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            padding: '1.5rem',
            borderRadius: '12px',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <TrendingUp size={24} />
              <span style={{ fontSize: '0.875rem', opacity: 0.9 }}>VIP Customers</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700' }}>{stats.vip}</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            padding: '1.5rem',
            borderRadius: '12px',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <Briefcase size={24} />
              <span style={{ fontSize: '0.875rem', opacity: 0.9 }}>With Active Projects</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700' }}>{stats.withActiveProjects}</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="list-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Status</option>
          <option value="lead">Leads</option>
          <option value="active">Active</option>
          <option value="vip">VIP</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Customers Table */}
      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem', color: '#6b7280' }}>Customer</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem', color: '#6b7280' }}>Contact</th>
              <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', fontSize: '0.875rem', color: '#6b7280' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', fontSize: '0.875rem', color: '#6b7280' }}>Projects</th>
              <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', fontSize: '0.875rem', color: '#6b7280' }}>Revenue</th>
              <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', fontSize: '0.875rem', color: '#6b7280' }}>Outstanding</th>
              <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', fontSize: '0.875rem', color: '#6b7280' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
                  No customers found
                </td>
              </tr>
            ) : (
              filteredCustomers.map(customer => (
                <tr key={customer._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '1rem' }}>
                    <div>
                      <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                        {customer.name}
                      </div>
                      {customer.university && (
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {customer.university}
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.875rem' }}>
                      <div style={{ color: '#1f2937', marginBottom: '0.25rem' }}>{customer.email}</div>
                      <div style={{ color: '#6b7280' }}>{customer.phone}</div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.375rem 0.875rem',
                      background: `${getStatusColor(customer.status)}15`,
                      color: getStatusColor(customer.status),
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}>
                      {getStatusIcon(customer.status)}
                      {customer.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.875rem' }}>
                      <div style={{ fontWeight: '600', color: '#1f2937' }}>{customer.projectCount || 0} total</div>
                      <div style={{ color: '#059669', fontSize: '0.8125rem' }}>{customer.activeProjects || 0} active</div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ fontWeight: '600', color: '#059669', fontSize: '1rem' }}>
                      ${customer.totalRevenue?.toFixed(2) || '0.00'}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ 
                      fontWeight: '600', 
                      color: customer.outstandingBalance > 0 ? '#dc2626' : '#6b7280',
                      fontSize: '1rem'
                    }}>
                      ${customer.outstandingBalance?.toFixed(2) || '0.00'}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleViewPaymentHistory(customer)}
                        style={{
                          padding: '0.5rem',
                          background: '#fef3c7',
                          color: '#d97706',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        title="View Payments"
                      >
                        <Receipt size={16} />
                      </button>
                      <button
                        onClick={() => handleRecordPayment(customer)}
                        style={{
                          padding: '0.5rem',
                          background: '#dcfce7',
                          color: '#059669',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        title="Record Payment"
                      >
                        <DollarSign size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setShowModal(true);
                        }}
                        style={{
                          padding: '0.5rem',
                          background: '#eff6ff',
                          color: '#3b82f6',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        title="View/Edit"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(customer._id)}
                        style={{
                          padding: '0.5rem',
                          background: '#fee2e2',
                          color: '#dc2626',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Customer Detail Modal would go here */}
      <CustomerModal
        customer={selectedCustomer}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedCustomer(null);
        }}
        onSave={() => {
          fetchCustomers();
          fetchStats();
        }}
      />

      {/* Payment Modal */}
      {selectedCustomer && (
        <PaymentModal
          customerId={selectedCustomer._id}
          customerName={selectedCustomer.name}
          totalCharged={paymentTotals.totalCharged}
          alreadyPaid={paymentTotals.alreadyPaid}
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedCustomer(null);
          }}
          onSave={handleModalClose}
        />
      )}

      {/* Payment History Modal */}
      {selectedCustomer && (
        <PaymentHistoryModal
          customerId={selectedCustomer._id}
          customerName={selectedCustomer.name}
          isOpen={showPaymentHistory}
          onClose={() => {
            setShowPaymentHistory(false);
            setSelectedCustomer(null);
          }}
          onUpdate={handleModalClose}
        />
      )}
    </div>
  );
};

export default CustomersManager;
