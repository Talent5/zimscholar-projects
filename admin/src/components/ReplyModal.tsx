import React, { useState } from 'react';
import { X, Send, Loader2, Paperclip } from 'lucide-react';
import { getAuthToken } from '../../../config/api.config';

interface ReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipient: {
    name: string;
    email: string;
    phone: string;
    type: 'contact' | 'quote' | 'project';
    id: string;
  };
  onSend: () => void;
}

const ReplyModal: React.FC<ReplyModalProps> = ({ isOpen, onClose, recipient, onSend }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !message.trim()) {
      setError('Subject and message are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('recipientEmail', recipient.email);
      formData.append('recipientName', recipient.name);
      formData.append('subject', subject);
      formData.append('message', message);
      formData.append('submissionType', recipient.type);
      formData.append('submissionId', recipient.id);

      // Add files if any
      if (files) {
        for (let i = 0; i < files.length; i++) {
          formData.append('attachments', files[i]);
        }
      }

      const token = getAuthToken();
      const response = await fetch('http://localhost:5000/api/admin/send-reply', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to send email');

      setSuccess(true);
      setTimeout(() => {
        onSend();
        onClose();
        setSuccess(false);
        setSubject('');
        setMessage('');
        setFiles(null);
      }, 2000);
    } catch (err) {
      setError('Failed to send email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Send Reply to {recipient.name}</h2>
            <p>{recipient.email}</p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="subject">Subject *</label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Re: Your Project Request"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              rows={10}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="files">
              <Paperclip size={18} />
              Attach Files (Project files, documents, etc.)
            </label>
            <input
              type="file"
              id="files"
              onChange={handleFileChange}
              multiple
              className="file-input"
            />
            {files && files.length > 0 && (
              <div className="files-list">
                <p>Selected files:</p>
                <ul>
                  {Array.from(files).map((file, index) => (
                    <li key={index}>
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">Email sent successfully!</div>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send Email
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReplyModal;
