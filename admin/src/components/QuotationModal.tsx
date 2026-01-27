import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Send } from 'lucide-react';

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface QuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  quoteRequest: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    university: string;
    course: string;
    projectType: string;
    description: string;
    quotation?: {
      quotationNumber: string;
      lineItems: LineItem[];
      discount: number;
      discountType: 'percentage' | 'fixed';
      taxRate: number;
      paymentTerms: string;
      quotationNotes: string;
      validUntil: string;
      dateIssued: string;
    };
  };
  onQuotationSent: () => void;
  editMode?: boolean;
}

const QuotationModal: React.FC<QuotationModalProps> = ({ 
  isOpen, 
  onClose, 
  quoteRequest,
  onQuotationSent,
  editMode = false
}) => {
  const [lineItems, setLineItems] = useState<LineItem[]>([{ description: '', quantity: 1, unitPrice: 0 }]);
  const [discount, setDiscount] = useState<number>(0);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [taxRate, setTaxRate] = useState<number>(0);
  const [paymentTerms, setPaymentTerms] = useState<string>(
    'A 50% deposit is required before project commencement. Final balance is due upon project completion and before delivery.'
  );
  const [quotationNotes, setQuotationNotes] = useState<string>('');
  const [validityDays, setValidityDays] = useState<number>(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Pre-fill form when in edit mode
  useEffect(() => {
    if (isOpen && editMode && quoteRequest.quotation) {
      const q = quoteRequest.quotation;
      setLineItems(q.lineItems || [{ description: '', quantity: 1, unitPrice: 0 }]);
      setDiscount(q.discount || 0);
      setDiscountType(q.discountType || 'percentage');
      setTaxRate(q.taxRate || 0);
      setPaymentTerms(q.paymentTerms || 'A 50% deposit is required before project commencement. Final balance is due upon project completion and before delivery.');
      setQuotationNotes(q.quotationNotes || '');
      
      // Calculate validity days from dates
      if (q.validUntil && q.dateIssued) {
        const issued = new Date(q.dateIssued);
        const valid = new Date(q.validUntil);
        const days = Math.ceil((valid.getTime() - issued.getTime()) / (1000 * 60 * 60 * 24));
        setValidityDays(days > 0 ? days : 30);
      }
    } else if (isOpen && !editMode) {
      // Reset form for new quotation
      setLineItems([{ description: '', quantity: 1, unitPrice: 0 }]);
      setDiscount(0);
      setDiscountType('percentage');
      setTaxRate(0);
      setPaymentTerms('A 50% deposit is required before project commencement. Final balance is due upon project completion and before delivery.');
      setQuotationNotes('');
      setValidityDays(30);
    }
  }, [isOpen, editMode, quoteRequest.quotation]);

  if (!isOpen) return null;

  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setLineItems(updated);
  };

  const calculateSubtotal = (): number => {
    return lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const calculateDiscount = (): number => {
    const subtotal = calculateSubtotal();
    if (discountType === 'percentage') {
      return subtotal * (discount / 100);
    }
    return discount;
  };

  const calculateTax = (): number => {
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscount();
    return (subtotal - discountAmount) * (taxRate / 100);
  };

  const calculateTotal = (): number => {
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscount();
    const taxAmount = calculateTax();
    return subtotal - discountAmount + taxAmount;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    const validLineItems = lineItems.filter(
      item => item.description.trim() && item.quantity > 0 && item.unitPrice > 0
    );

    if (validLineItems.length === 0) {
      setError('Please add at least one valid line item with description, quantity, and price');
      return;
    }

    if (calculateTotal() <= 0) {
      setError('Total amount must be greater than zero');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('zimscholar_auth_token');
      if (!token) {
        throw new Error('Please login to continue');
      }

      const endpoint = editMode 
        ? `/api/admin/quote-requests/${quoteRequest._id}/quotation`
        : `/api/admin/quote-requests/${quoteRequest._id}/generate-quotation`;
      
      const method = editMode ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          lineItems: validLineItems,
          discount,
          discountType,
          taxRate,
          paymentTerms,
          quotationNotes,
          validityDays
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate quotation');
      }

      const data = await response.json();
      
      // Handle successful generation with or without email
      if (data.warning && !data.emailSent) {
        const shouldDownload = confirm(
          `⚠️ Quotation generated but email failed to send!\n\n` +
          `Error: ${data.emailError || 'Unknown error'}\n\n` +
          `The quotation has been saved and you can download it to send manually.\n\n` +
          `Click OK to download the quotation now.`
        );
        
        if (shouldDownload) {
          // Download the quotation
          const downloadUrl = `${data.downloadUrl}`;
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = `quotation-${data.quotation.quotationNumber}.pdf`;
          
          // Add authorization header by opening in new window
          const token = localStorage.getItem('zimscholar_auth_token');
          fetch(downloadUrl, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          .then(res => res.blob())
          .then(blob => {
            const url = window.URL.createObjectURL(blob);
            link.href = url;
            link.click();
            window.URL.revokeObjectURL(url);
          })
          .catch(err => {
            console.error('Download error:', err);
            alert('Failed to download quotation. Please try from the quote requests list.');
          });
        }
        
        alert(
          `✅ Quotation #${data.quotation.quotationNumber} ${editMode ? 'updated' : 'generated'} successfully!\n\n` +
          `⚠️ Email sending failed, but the quotation is saved.\n` +
          `You can download it from the quote requests list and send it manually to ${quoteRequest.email}.`
        );
      } else {
        alert(`✅ Quotation ${editMode ? 'updated' : 'sent'} successfully${!editMode ? ` to ${quoteRequest.email}` : ''}!`);
      }
      
      onQuotationSent();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to send quotation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{editMode ? '✏️ Edit Quotation' : '📝 Generate Professional Quotation'}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div style={{ padding: '0 30px 30px' }}>
          {/* Client Info Summary */}
          <div style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            padding: '20px', 
            borderRadius: '10px', 
            marginBottom: '25px',
            color: 'white'
          }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>Client Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
              <div><strong>Name:</strong> {quoteRequest.name}</div>
              <div><strong>Email:</strong> {quoteRequest.email}</div>
              <div><strong>Phone:</strong> {quoteRequest.phone}</div>
              <div><strong>University:</strong> {quoteRequest.university}</div>
              <div><strong>Course:</strong> {quoteRequest.course}</div>
              <div><strong>Project Type:</strong> {quoteRequest.projectType}</div>
            </div>
            <div style={{ marginTop: '12px', fontSize: '13px' }}>
              <strong>Description:</strong>
              <p style={{ margin: '5px 0 0 0', opacity: 0.95 }}>{quoteRequest.description}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Line Items */}
            <div style={{ marginBottom: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#4f46e5' }}>Line Items</h3>
                <button
                  type="button"
                  onClick={addLineItem}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '8px 15px',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  <Plus size={18} /> Add Item
                </button>
              </div>

              {lineItems.map((item, index) => (
                <div 
                  key={index} 
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '2fr 100px 120px 40px', 
                    gap: '12px', 
                    marginBottom: '12px',
                    padding: '15px',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  <input
                    type="text"
                    placeholder="Description (e.g., Project Development)"
                    value={item.description}
                    onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(index, 'quantity', parseInt(e.target.value) || 1)}
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Unit Price"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => updateLineItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeLineItem(index)}
                    disabled={lineItems.length === 1}
                    style={{
                      padding: '10px',
                      background: lineItems.length === 1 ? '#e5e7eb' : '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: lineItems.length === 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Pricing Summary */}
            <div style={{ 
              background: '#f0f9ff', 
              padding: '20px', 
              borderRadius: '10px', 
              marginBottom: '25px',
              border: '2px solid #dbeafe'
            }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#1e40af' }}>Pricing Breakdown</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Subtotal:</span>
                <strong>${calculateSubtotal().toFixed(2)}</strong>
              </div>

              {/* Discount */}
              <div style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                  <input
                    type="number"
                    placeholder="Discount"
                    min="0"
                    step="0.01"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #bfdbfe' }}
                  />
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                    style={{ padding: '8px', borderRadius: '6px', border: '1px solid #bfdbfe' }}
                  >
                    <option value="percentage">%</option>
                    <option value="fixed">$</option>
                  </select>
                </div>
                {discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                    <span>Discount Amount:</span>
                    <strong>-${calculateDiscount().toFixed(2)}</strong>
                  </div>
                )}
              </div>

              {/* Tax */}
              <div style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                  <input
                    type="number"
                    placeholder="Tax Rate (%)"
                    min="0"
                    step="0.01"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #bfdbfe' }}
                  />
                  <span style={{ width: '30px' }}>%</span>
                </div>
                {taxRate > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Tax Amount:</span>
                    <strong>${calculateTax().toFixed(2)}</strong>
                  </div>
                )}
              </div>

              <div style={{ 
                borderTop: '2px solid #1e40af', 
                paddingTop: '15px', 
                marginTop: '15px',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '20px',
                color: '#1e40af'
              }}>
                <strong>Total:</strong>
                <strong>${calculateTotal().toFixed(2)}</strong>
              </div>
            </div>

            {/* Payment Terms */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                Payment Terms
              </label>
              <textarea
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                rows={3}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {/* Quotation Notes */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                Additional Notes (Optional)
              </label>
              <textarea
                value={quotationNotes}
                onChange={(e) => setQuotationNotes(e.target.value)}
                rows={3}
                placeholder="Any additional information or special conditions..."
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {/* Validity Period */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                Quotation Valid For (Days)
              </label>
              <input
                type="number"
                min="1"
                value={validityDays}
                onChange={(e) => setValidityDays(parseInt(e.target.value) || 30)}
                style={{ 
                  width: '200px', 
                  padding: '10px', 
                  borderRadius: '8px', 
                  border: '1px solid #d1d5db'
                }}
              />
            </div>

            {error && (
              <div style={{ 
                padding: '12px', 
                background: '#fee2e2', 
                color: '#991b1b', 
                borderRadius: '8px',
                marginBottom: '20px',
                border: '1px solid #fecaca'
              }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                style={{
                  padding: '12px 30px',
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '16px'
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
                  gap: '8px',
                  padding: '12px 30px',
                  background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: 600
                }}
              >
                {loading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Send size={20} />
                    Generate & Send Quotation
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          width: 100%;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 25px 30px;
          border-bottom: 2px solid #e5e7eb;
        }

        .modal-header h2 {
          margin: 0;
          color: #1f2937;
          font-size: 24px;
        }

        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px;
          color: #6b7280;
          transition: color 0.2s;
        }

        .close-btn:hover {
          color: #1f2937;
        }
      `}</style>
    </div>
  );
};

export default QuotationModal;
