import React, { useState, useEffect } from 'react';
import { X, Edit, Trash2, DollarSign, Calendar, CreditCard, CheckCircle, Clock, AlertCircle, Save } from 'lucide-react';
import { apiRequest } from '../utils/api';

interface Payment {
  _id: string;
  invoiceNumber: string;
  amount: number;
  paymentType: string;
  paymentMethod: string;
  status: string;
  paidDate: string;
  notes: string;
  createdAt: string;
}

interface PaymentHistoryModalProps {
  customerId: string;
  customerName: string;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const PaymentHistoryModal: React.FC<PaymentHistoryModalProps> = ({
  customerId,
  customerName,
  isOpen,
  onClose,
  onUpdate
}) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  useEffect(() => {
    if (isOpen && customerId) {
      fetchPayments();
    }
  }, [isOpen, customerId]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await apiRequest(`/api/admin/payments?customer=${customerId}`);
      if (response.ok) {
        const data = await response.json();
        setPayments(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (payment: Payment) => {
    setEditingId(payment._id);
    setEditForm({
      amount: payment.amount,
      paymentType: payment.paymentType,
      paymentMethod: payment.paymentMethod,
      status: payment.status,
      paidDate: payment.paidDate.split('T')[0],
      notes: payment.notes || ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (paymentId: string) => {
    try {
      const response = await apiRequest(`/api/admin/payments/${paymentId}`, {
        method: 'PUT',
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        await fetchPayments();
        setEditingId(null);
        setEditForm({});
        onUpdate();
      } else {
        alert('Failed to update payment');
      }
    } catch (error) {
      console.error('Error updating payment:', error);
      alert('Failed to update payment');
    }
  };

  const deletePayment = async (paymentId: string) => {
    if (!confirm('Are you sure you want to delete this payment?')) return;

    try {
      const response = await apiRequest(`/api/admin/payments/${paymentId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchPayments();
        onUpdate();
      } else {
        alert('Failed to delete payment');
      }
    } catch (error) {
      console.error('Error deleting payment:', error);
      alert('Failed to delete payment');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'failed': return '#ef4444';
      case 'overdue': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} />;
      case 'pending': return <Clock size={16} />;
      case 'failed': return <AlertCircle size={16} />;
      case 'overdue': return <AlertCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const totalPaid = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1001,
      backdropFilter: 'blur(4px)'
    }} onClick={onClose}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        width: '90%',
        maxWidth: '900px',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column'
      }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          padding: '1.5rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'white'
        }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>
              Payment History
            </h2>
            <p style={{ fontSize: '0.875rem', opacity: 0.9, margin: '0.25rem 0 0 0' }}>
              {customerName} • Total Paid: ${totalPaid.toFixed(2)}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '8px',
              padding: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: 'white'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
              Loading payments...
            </div>
          ) : payments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
              No payments recorded yet
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {payments.map((payment) => (
                <div key={payment._id} style={{
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '1.5rem'
                }}>
                  {editingId === payment._id ? (
                    // Edit Mode
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '0.5rem' }}>
                          Amount (USD)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={editForm.amount}
                          onChange={(e) => setEditForm({ ...editForm, amount: parseFloat(e.target.value) })}
                          style={{
                            width: '100%',
                            padding: '0.625rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '0.875rem'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '0.5rem' }}>
                          Payment Type
                        </label>
                        <select
                          value={editForm.paymentType}
                          onChange={(e) => setEditForm({ ...editForm, paymentType: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '0.625rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            background: 'white'
                          }}
                        >
                          <option value="deposit">Deposit</option>
                          <option value="milestone">Milestone</option>
                          <option value="final">Final</option>
                          <option value="full">Full</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '0.5rem' }}>
                          Payment Method
                        </label>
                        <select
                          value={editForm.paymentMethod}
                          onChange={(e) => setEditForm({ ...editForm, paymentMethod: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '0.625rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            background: 'white'
                          }}
                        >
                          <option value="bank_transfer">Bank Transfer</option>
                          <option value="credit_card">Credit Card</option>
                          <option value="mobile_money">Mobile Money</option>
                          <option value="cash">Cash</option>
                          <option value="paypal">PayPal</option>
                          <option value="crypto">Cryptocurrency</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '0.5rem' }}>
                          Status
                        </label>
                        <select
                          value={editForm.status}
                          onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '0.625rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            background: 'white'
                          }}
                        >
                          <option value="completed">Completed</option>
                          <option value="pending">Pending</option>
                          <option value="failed">Failed</option>
                          <option value="overdue">Overdue</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '0.5rem' }}>
                          Payment Date
                        </label>
                        <input
                          type="date"
                          value={editForm.paidDate}
                          onChange={(e) => setEditForm({ ...editForm, paidDate: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '0.625rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '0.875rem'
                          }}
                        />
                      </div>

                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '0.5rem' }}>
                          Notes
                        </label>
                        <textarea
                          value={editForm.notes}
                          onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                          rows={2}
                          style={{
                            width: '100%',
                            padding: '0.625rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            resize: 'vertical'
                          }}
                        />
                      </div>

                      <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={cancelEdit}
                          style={{
                            padding: '0.5rem 1rem',
                            background: 'white',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => saveEdit(payment._id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: 'white',
                            cursor: 'pointer'
                          }}
                        >
                          <Save size={16} />
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                            Invoice: {payment.invoiceNumber}
                          </div>
                          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>
                            ${payment.amount.toFixed(2)}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => startEdit(payment)}
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
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => deletePayment(payment._id)}
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
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Payment Type</div>
                          <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937', textTransform: 'capitalize' }}>
                            {payment.paymentType.replace('_', ' ')}
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Payment Method</div>
                          <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937', textTransform: 'capitalize' }}>
                            {payment.paymentMethod.replace('_', ' ')}
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Status</div>
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.375rem',
                            padding: '0.25rem 0.625rem',
                            background: `${getStatusColor(payment.status)}15`,
                            color: getStatusColor(payment.status),
                            borderRadius: '6px',
                            fontSize: '0.8125rem',
                            fontWeight: '600',
                            textTransform: 'capitalize'
                          }}>
                            {getStatusIcon(payment.status)}
                            {payment.status}
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Payment Date</div>
                          <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937' }}>
                            {new Date(payment.paidDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {payment.notes && (
                        <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'white', borderRadius: '6px' }}>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Notes</div>
                          <div style={{ fontSize: '0.875rem', color: '#1f2937' }}>{payment.notes}</div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentHistoryModal;
