import { FileText, Send, X, BadgeCheck } from 'lucide-react';

export default function InvoiceEmailModal({ invoice, onClose }) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="invoice-email-title">
        <header className="modal-header">
          <div>
            <span className="eyebrow">Feature 11</span>
            <h2 id="invoice-email-title">Email Invoice {invoice.id}</h2>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </header>

        <div className="form-grid">
          <label>
            Recipient
            <input value={invoice.email} readOnly />
          </label>
          <label>
            Subject
            <input value={`Your GaragePro invoice ${invoice.id}`} readOnly />
          </label>
          <label className="full-field">
            Message
            <textarea
              defaultValue={`Hi ${invoice.customer},\n\nYour invoice for ${invoice.service} is ready. The total due is ${invoice.total}. Please review the attached invoice and contact us with any questions.\n\nThank you,\nGaragePro Service Team`}
            />
          </label>
        </div>

        <div className="attachment-row">
          <FileText size={16} />
          <div>
            <strong>{invoice.id}.pdf</strong>
            <span>Attached invoice summary and payment details</span>
          </div>
          <BadgeCheck size={16} className="accent-icon" />
        </div>

        <footer className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={onClose}>
            <Send size={14} /> Send Invoice
          </button>
        </footer>
      </section>
    </div>
  );
}