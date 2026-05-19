import { Check, CheckCheck } from 'lucide-react';
import PaginatedDataTable from '../../components/PaginatedDataTable';
import { usePagedList } from '../../hooks/usePagedList';
import { apiRequest } from '../../services/apiClient';
import { useToast } from '../../components/ToastProvider';

const columns = [
  { key: 'notificationType', label: 'Type' },
  { key: 'message', label: 'Message' },
  {
    key: 'status',
    label: 'Status',
    render: (row) => (
      <span className={`status-pill ${row.acknowledgedAt ? 'status-acknowledged' : row.isRead ? 'status-read' : 'status-new'}`}>
        {row.acknowledgedAt ? 'Acknowledged' : row.isRead ? 'Read' : 'New'}
      </span>
    ),
  },
  { key: 'createdAt', label: 'Date', render: (r) => new Date(r.createdAt).toLocaleString() },
  { key: 'actions', label: 'Actions' },
];

function NotificationActions({ row, onUpdated }) {
  const { showToast } = useToast();

  async function markRead() {
    try {
      await apiRequest(`/api/notifications/${row.id}/read`, { method: 'PATCH' });
      showToast('Marked as read.', 'success');
      onUpdated();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async function acknowledge() {
    try {
      await apiRequest(`/api/notifications/${row.id}/acknowledge`, { method: 'PATCH' });
      showToast('Notification acknowledged.', 'success');
      onUpdated();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  return (
    <div className="row-actions">
      {!row.isRead && (
        <button type="button" className="link-btn" onClick={markRead}><Check size={14} /> Read</button>
      )}
      {!row.acknowledgedAt && (
        <button type="button" className="link-btn" onClick={acknowledge}><CheckCheck size={14} /> Acknowledge</button>
      )}
    </div>
  );
}

export default function NotificationsInboxPage({ title = 'Notifications', description = 'View and acknowledge your notifications.' }) {
  const list = usePagedList('/api/notifications', { initialSortBy: 'date', initialSortDir: 'desc' });
  const columnsWithReload = columns.map((col) =>
    col.key === 'actions' ? { ...col, render: (row) => <NotificationActions row={row} onUpdated={list.reload} /> } : col
  );

  return (
    <>
      <section className="feature-hero">
        <div>
          <span className="eyebrow">Inbox</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </section>

      {list.error && <p className="status-error">{list.error}</p>}
      {list.loading && <p className="status-text">Loading notifications...</p>}

      <PaginatedDataTable
        columns={columnsWithReload}
        rows={list.items}
        page={list.page}
        pageSize={list.pageSize}
        totalCount={list.totalCount}
        totalPages={list.totalPages}
        search={list.search}
        onSearchChange={(v) => { list.setSearch(v); list.setPage(1); }}
        onPageChange={list.setPage}
        onPageSizeChange={(size) => { list.setPageSize(size); list.setPage(1); }}
        emptyMessage="No notifications yet."
      />
    </>
  );
}
