import React, { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Mail, Phone, Calendar, Search, RefreshCw, Reply } from 'lucide-react';
import ReplyModal from './ReplyModal';
import { fetchContacts as fetchContactsAPI, updateContactStatus } from '../utils/api';

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  submittedAt: string;
  createdAt: string;
}

const ContactsList: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchContactsAPI();
      setContacts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setError('Failed to load contacts. Please try again.');
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await updateContactStatus(id, newStatus);
      fetchContacts();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update contact status. Please try again.');
    }
  };

  const filteredContacts = Array.isArray(contacts) ? contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) : [];

  if (loading) {
    return (
      <div className="list-container">
        <h1>Contact Forms</h1>
        <p>Loading submissions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="list-container">
        <h1>Contact Form Submissions</h1>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#dc2626', marginBottom: '1rem' }}>{error}</p>
          <button onClick={fetchContacts} className="refresh-btn">
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
          <h1>Contact Form Submissions</h1>
          <p>{contacts.length} total submissions</p>
        </div>
        <button onClick={fetchContacts} className="refresh-btn">
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      <div className="list-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by name, email, or message..."
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
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="submissions-list">
        {filteredContacts.length === 0 ? (
          <div className="empty-state">
            <p>No contact forms found</p>
          </div>
        ) : (
          filteredContacts.map(contact => (
            <div key={contact._id} className="submission-card">
              <div className="submission-header">
                <div>
                  <h3>{contact.name}</h3>
                  <div className="submission-meta">
                    <span><Mail size={14} /> {contact.email}</span>
                    <span><Phone size={14} /> {contact.phone}</span>
                    <span><Calendar size={14} /> {formatDistanceToNow(new Date(contact.submittedAt), { addSuffix: true })}</span>
                  </div>
                </div>
                <select
                  value={contact.status}
                  onChange={(e) => updateStatus(contact._id, e.target.value)}
                  className={`status-badge status-${contact.status}`}
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div className="submission-content">
                <p>{contact.message}</p>
              </div>
              <div className="submission-actions">
                <button 
                  className="action-btn btn-reply"
                  onClick={() => {
                    setSelectedContact(contact);
                    setReplyModalOpen(true);
                  }}
                >
                  <Reply size={16} />
                  Send Reply
                </button>
                <a href={`mailto:${contact.email}`} className="action-btn">Direct Email</a>
                <a href={`https://wa.me/${contact.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="action-btn">WhatsApp</a>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedContact && (
        <ReplyModal
          isOpen={replyModalOpen}
          onClose={() => {
            setReplyModalOpen(false);
            setSelectedContact(null);
          }}
          recipient={{
            name: selectedContact.name,
            email: selectedContact.email,
            phone: selectedContact.phone,
            type: 'contact',
            id: selectedContact._id
          }}
          onSend={() => {
            updateStatus(selectedContact._id, 'replied');
          }}
        />
      )}
    </div>
  );
};

export default ContactsList;
