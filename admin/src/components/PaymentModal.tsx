import React, { useState, useEffect } from 'react';
import { X, Save, DollarSign, Calendar, CreditCard, FileText, User } from 'lucide-react';
import { apiRequest } from '../utils/api';

interface PaymentModalProps {
  customerId: string;
  customerName: string;
  projectTitle?: string;
  totalCharged: number;
  alreadyPaid: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  customerId,
  customerName,
  projectTitle,
  totalCharged,
  alreadyPaid,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    amount: 0,
    paymentType: 'deposit' as 'deposit' | 'milestone' | 'final' | 'full' | 'other',
    paymentMethod: 'bank_transfer' as 'bank_transfer' | 'credit_card' | 'debit_card' | 'paypal' | 'cash' | 'mobile_money' | 'crypto' | 'check' | 'other',
    status: 'completed' as 'pending' | 'completed' | 'failed' | 'refunded' | 'overdue',
    paidDate: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const remaining = totalCharged - alreadyPaid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate amount
    if (formData.amount <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }
    
    if (formData.amount > remaining) {
      if (!confirm(`Payment amount ($${formData.amount}) exceeds remaining balance ($${remaining.toFixed(2)}). Continue anyway?`)) {
        return;
      }
    }

    setLoading(true);

    try {
      const payload = {
        customer: customerId,
        amount: formData.amount,
        paymentType: formData.paymentType,
        paymentMethod: formData.paymentMethod,
        status: formData.status,
        paidDate: formData.paidDate,
        notes: formData.notes
      };

      const response = await apiRequest('/api/admin/payments', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to record payment');
      }

      const savedPayment = await response.json();
      console.log('Payment recorded successfully:', savedPayment);
      
      // Call onSave to refresh parent data
      await onSave();
      
      // Close modal
      onClose();
      
      // Reset form
      setFormData({
        amount: 0,
        paymentType: 'deposit',
        paymentMethod: 'bank_transfer',
        status: 'completed',
        paidDate: new Date().toISOString().split('T')[0],
        notes: ''
      });
    } catch (error: any) {
      console.error('Error recording payment:', error);
      alert(error.message || 'Failed to record payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
        maxWidth: '500px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
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
              Record Payment
            </h2>
            <p style={{ fontSize: '0.875rem', opacity: 0.9, margin: '0.25rem 0 0 0' }}>
              {customerName}
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

        {/* Payment Summary */}
        <div style={{
          padding: '1.5rem 2rem',
          background: '#f9fafb',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Total Charged</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937' }}>${totalCharged.toFixed(2)}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Already Paid</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#059669' }}>${alreadyPaid.toFixed(2)}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Remaining</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: remaining > 0 ? '#dc2626' : '#6b7280' }}>
                ${remaining.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <div style={{ 
            flex: 1,
            overflowY: 'auto',
            padding: '2rem'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Amount */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                <DollarSign size={16} />
                Payment Amount (USD) *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
                placeholder="0.00"
              />
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                Maximum remaining: ${remaining.toFixed(2)}
              </div>
            </div>

            {/* Payment Type */}
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem', display: 'block' }}>
                Payment Type *
              </label>
              <select
                value={formData.paymentType}
                onChange={(e) => setFormData({ ...formData, paymentType: e.target.value as any })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  background: 'white'
                }}
              >
                <option value="deposit">Deposit</option>
                <option value="milestone">Milestone Payment</option>
                <option value="final">Final Payment</option>
                <option value="full">Full Payment</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Payment Method */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                <CreditCard size={16} />
                Payment Method *
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  background: 'white'
                }}
                required
              >
                <option value="bank_transfer">Bank Transfer</option>
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
                <option value="mobile_money">Mobile Money</option>
                <option value="cash">Cash</option>
                <option value="paypal">PayPal</option>
                <option value="crypto">Cryptocurrency</option>
                <option value="check">Check</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Payment Date */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                <Calendar size={16} />
                Payment Date *
              </label>
              <input
                type="date"
                required
                value={formData.paidDate}
                onChange={(e) => setFormData({ ...formData, paidDate: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  background: 'white'
                }}
              />
            </div>

            {/* Status */}
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem', display: 'block' }}>
                Payment Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
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

            {/* Notes */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                <FileText size={16} />
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  resize: 'vertical'
                }}
                placeholder="Additional notes about this payment..."
              />
            </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end',
            padding: '1.5rem 2rem',
            borderTop: '1px solid #e5e7eb',
            background: 'white'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: loading ? '#9ca3af' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              <Save size={16} />
              {loading ? 'Recording...' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
