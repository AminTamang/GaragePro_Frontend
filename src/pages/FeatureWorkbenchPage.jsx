import { useMemo, useState } from 'react';
import { RefreshCw, Send, Database, Play, Trash2 } from 'lucide-react';
import DataTable from '../components/DataTable';
import { apiRequest, unwrapData } from '../services/apiClient';

function normalizeValue(value, type) {
  if (type === 'number') return Number(value);
  if (type === 'date') return value ? new Date(value).toISOString() : value;
  return value;
}

function getValue(row, keys) {
  for (const key of keys) {
    if (row?.[key] !== undefined && row?.[key] !== null) return row[key];
  }
  return '-';
}

export default function FeatureWorkbenchPage({ config }) {
  const initialForm = useMemo(
    () => Object.fromEntries((config.fields || []).map((field) => [field.name, field.defaultValue || ''])),
    [config.fields]
  );
  const [form, setForm] = useState(initialForm);
  const [rows, setRows] = useState(config.sampleRows || []);
  const [status, setStatus] = useState('Ready');
  const [busy, setBusy] = useState(false);

  async function runAction(action) {
    setBusy(true);
    setStatus(`Running ${action.label}...`);
    try {
      const body = action.body ? action.body(form) : undefined;
      const path = typeof action.path === 'function' ? action.path(form) : action.path;
      const payload = await apiRequest(path, {
        method: action.method || 'GET',
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = unwrapData(payload);
      if (data.length) setRows(data);
      setStatus(payload?.message || `${action.label} completed`);
    } catch (error) {
      setStatus(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function submitForm(event) {
    event.preventDefault();
    if (!config.submitAction) return;
    await runAction(config.submitAction);
  }

  async function deleteFirst() {
    const id = rows[0]?.id || rows[0]?.partId || rows[0]?.vendorId || rows[0]?.staffId;
    if (!config.deletePath || !id) {
      setStatus('Select/load a row with an id before deleting.');
      return;
    }
    await runAction({ label: 'Delete first row', method: 'DELETE', path: config.deletePath(id) });
  }

  const tableRows = rows.map((row) =>
    config.columns.map((column) => getValue(row, column.keys || [column.key]))
  );

  return (
    <>
      <section className="feature-hero">
        <div>
          <span className="eyebrow">{config.owner} / Feature {config.feature}</span>
          <h1>{config.title}</h1>
          <p>{config.description}</p>
        </div>
        <div className="feature-actions">
          {config.loadAction && (
            <button className="btn-primary" disabled={busy} onClick={() => runAction(config.loadAction)}>
              <RefreshCw size={15} /> Refresh Data
            </button>
          )}
          {config.deletePath && (
            <button className="btn-ghost" disabled={busy} onClick={deleteFirst}>
              <Trash2 size={15} /> Delete First
            </button>
          )}
        </div>
      </section>

      <div className="feature-grid">
        <form className="panel feature-form" onSubmit={submitForm}>
          <div className="panel-header">
            <div className="panel-title-row">
              <Database size={17} />
              <span className="panel-title">{config.formTitle || 'Backend Action'}</span>
            </div>
          </div>
          <div className="form-body">
            {(config.fields || []).map((field) => (
              <label key={field.name}>
                {field.label}
                <input
                  type={field.type || 'text'}
                  value={form[field.name] || ''}
                  placeholder={field.placeholder}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [field.name]: normalizeValue(event.target.value, field.type),
                    }))
                  }
                />
              </label>
            ))}
            {config.submitAction && (
              <button className="btn-primary form-submit" disabled={busy}>
                <Send size={15} /> {config.submitAction.label}
              </button>
            )}
          </div>
        </form>

        <section className="panel endpoint-panel">
          <div className="panel-header">
            <span className="panel-title">API Controls</span>
            <span className="count-pill">{busy ? 'Working' : 'Connected-ready'}</span>
          </div>
          <div className="endpoint-list">
            {(config.quickActions || []).map((action) => (
              <button key={action.label} className="endpoint-button" disabled={busy} onClick={() => runAction(action)}>
                <Play size={14} />
                <span>{action.label}</span>
                <small>{action.method || 'GET'} {typeof action.path === 'string' ? action.path : action.hint}</small>
              </button>
            ))}
          </div>
          <div className="status-box">{status}</div>
        </section>
      </div>

      <section className="panel">
        <div className="panel-header">
          <span className="panel-title">{config.tableTitle || 'Live Data'}</span>
          <span className="count-pill">{rows.length} rows</span>
        </div>
        <DataTable columns={config.columns.map((column) => column.label)} rows={tableRows} />
      </section>
    </>
  );
}
