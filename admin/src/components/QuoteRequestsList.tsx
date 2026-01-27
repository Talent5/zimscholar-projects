import React, { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Mail, Phone, Calendar, Search, RefreshCw, GraduationCap, Briefcase, Reply, FileText, Download, CheckCircle, Trash2 } from 'lucide-react';
import ReplyModal from './ReplyModal';
import QuotationModal from './QuotationModal';
import { fetchQuoteRequests, updateQuoteStatus } from '../utils/api';

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface QuoteRequest {
  _id: string;
  name: string;
  email: string;
  phone: string;
  university: string;
  course: string;
  projectType: string;
  packageTier: string;
  deadline?: string;
  budget?: string;
  description: string;
  status: string;
  quotedPrice?: number;
  submittedAt: string;
  quotation?: {
    quotationNumber: string;
    dateIssued: string;
    validUntil: string;
    pdfPath: string;
    sentAt: string;
    lineItems?: LineItem[];
    discount?: number;
    discountType?: 'percentage' | 'fixed';
    taxRate?: number;
    paymentTerms?: string;
    quotationNotes?: string;
  };
}

const QuoteRequestsList: React.FC = () => {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [quotationModalOpen, setQuotationModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchQuoteRequests();
      setQuotes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      setError('Failed to load quote requests. Please try again.');
      setQuotes([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await updateQuoteStatus(id, newStatus);
      fetchQuotes();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update quote status. Please try again.');
    }
  };

  const downloadQuotation = async (quotationNumber: string) => {
    try {
      const token = localStorage.getItem('zimscholar_auth_token');
      if (!token) {
        alert('Please login to download quotations');
        return;
      }

      const response = await fetch(
        `/api/admin/quotations/${quotationNumber}/pdf`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to download quotation');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `quotation-${quotationNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading quotation:', error);
      alert('Failed to download quotation. Please try again.');
    }
  };

  const deleteQuotation = async (quoteId: string, quotationNumber: string) => {
    if (!confirm(`Are you sure you want to delete quotation #${quotationNumber}?\n\nThis action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('zimscholar_auth_token');
      if (!token) {
        alert('Please login to delete quotations');
        return;
      }

      const response = await fetch(
        `/api/admin/quote-requests/${quoteId}/quotation`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete quotation');
      }

      alert('✅ Quotation deleted successfully!');
      fetchQuotes();
    } catch (error) {
      console.error('Error deleting quotation:', error);
      alert('Failed to delete quotation. Please try again.');
    }
  };

  const filteredQuotes = Array.isArray(quotes) ? quotes.filter(quote => {
    const matchesSearch = 
      quote.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.projectType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) : [];

  if (loading) {
    return (
      <div className="list-container">
        <h1>Quote Requests</h1>
        <p>Loading requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="list-container">
        <h1>Quote Requests</h1>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#dc2626', marginBottom: '1rem' }}>{error}</p>
          <button onClick={fetchQuotes} className="refresh-btn">
            <RefreshCw size={18} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="list-container">
      <div className="list-header">
        <div>
          <h1>Quote Requests</h1>
          <p>{quotes.length} total requests</p>
        </div>
        <button onClick={fetchQuotes} className="refresh-btn">
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      <div className="list-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by name, email, or project type..."
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
          <option value="pending">Pending</option>
          <option value="quoted">Quoted</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="submissions-list">
        {filteredQuotes.length === 0 ? (
          <div className="empty-state">
            <p>No quote requests found</p>
          </div>
        ) : (
          filteredQuotes.map(quote => (
            <div key={quote._id} className="submission-card">
              <div className="submission-header">
                <div>
                  <h3>{quote.name}</h3>
                  <div className="submission-meta">
                    <span><Mail size={14} /> {quote.email}</span>
                    <span><Phone size={14} /> {quote.phone}</span>
                  </div>
                  <div className="submission-meta">
                    <span><GraduationCap size={14} /> {quote.university}</span>
                    <span><Briefcase size={14} /> {quote.course}</span>
                  </div>
                  <div className="submission-meta">
                    <span><Calendar size={14} /> {formatDistanceToNow(new Date(quote.submittedAt), { addSuffix: true })}</span>
                  </div>
                </div>
                <select
                  value={quote.status}
                  onChange={(e) => updateStatus(quote._id, e.target.value)}
                  className={`status-badge status-${quote.status}`}
                >
                  <option value="pending">Pending</option>
                  <option value="quoted">Quoted</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="project-details">
                <span className="project-type-badge">{quote.projectType}</span>
                {quote.packageTier && <span className="package-badge">{quote.packageTier.split(' - ')[0]}</span>}
                {quote.deadline && <span className="deadline-badge">Deadline: {new Date(quote.deadline).toLocaleDateString()}</span>}
                {quote.budget && <span className="budget-badge">Budget: {quote.budget}</span>}
              </div>

              <div className="submission-content">
                <h4>Project Description:</h4>
                <p>{quote.description}</p>
              </div>

              {quote.quotation && (
                <div style={{
                  background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)',
                  border: '2px solid #667eea',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  marginTop: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1', minWidth: '200px' }}>
                    <CheckCircle size={20} color="#667eea" />
                    <div>
                      <div style={{ fontWeight: 600, color: '#4f46e5', marginBottom: '4px' }}>
                        Quotation #{quote.quotation.quotationNumber}
                      </div>
                      <div style={{ fontSize: '13px', color: '#6b7280' }}>
                        {quote.quotation.dateIssued && !isNaN(new Date(quote.quotation.dateIssued).getTime()) 
                          ? `Generated ${formatDistanceToNow(new Date(quote.quotation.dateIssued), { addSuffix: true })}`
                          : 'Quotation generated'}
                        {quote.quotedPrice && ` • Total: $${quote.quotedPrice.toFixed(2)}`}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => downloadQuotation(quote.quotation!.quotationNumber)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 600,
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#5a67d8'}
                      onMouseOut={(e) => e.currentTarget.style.background = '#667eea'}
                    >
                      <Download size={16} />
                      Download
                    </button>
                    <button
                      onClick={() => {
                        setSelectedQuote(quote);
                        setEditMode(true);
                        setQuotationModalOpen(true);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 600,
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#059669'}
                      onMouseOut={(e) => e.currentTarget.style.background = '#10b981'}
                      title="Edit Quotation"
                    >
                      <FileText size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => deleteQuotation(quote._id, quote.quotation!.quotationNumber)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 600,
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#dc2626'}
                      onMouseOut={(e) => e.currentTarget.style.background = '#ef4444'}
                      title="Delete Quotation"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              )}

              <div className="submission-actions">
                <button 
                  className="action-btn btn-quotation"
                  onClick={() => {
                    setSelectedQuote(quote);
                    setEditMode(false);
                    setQuotationModalOpen(true);
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontWeight: 600
                  }}
                >
                  <FileText size={16} />
                  Generate Quotation
                </button>
                <button 
                  className="action-btn btn-reply"
                  onClick={() => {
                    setSelectedQuote(quote);
                    setReplyModalOpen(true);
                  }}
                >
                  <Reply size={16} />
                  Send Reply
                </button>
                <a href={`mailto:${quote.email}?subject=Quote for ${quote.projectType} Project`} className="action-btn">Direct Email</a>
                <a href={`https://wa.me/${quote.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="action-btn">WhatsApp</a>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedQuote && (
        <>
          <QuotationModal
            isOpen={quotationModalOpen}
            onClose={() => {
              setQuotationModalOpen(false);
              setSelectedQuote(null);
              setEditMode(false);
            }}
            quoteRequest={selectedQuote as any}
            onQuotationSent={() => {
              fetchQuotes();
            }}
            editMode={editMode}
          />

          <ReplyModal
            isOpen={replyModalOpen}
            onClose={() => {
              setReplyModalOpen(false);
              setSelectedQuote(null);
            }}
            recipient={{
              name: selectedQuote.name,
              email: selectedQuote.email,
              phone: selectedQuote.phone,
              type: 'quote',
              id: selectedQuote._id
            }}
            onSend={() => {
              updateStatus(selectedQuote._id, 'quoted');
            }}
          />
        </>
      )}
    </div>
  );
};

export default QuoteRequestsList;
