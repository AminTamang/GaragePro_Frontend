import { useState } from 'react';
import { Download, FileText, Filter, TrendingUp, TrendingDown } from 'lucide-react';
import DataTable from '../components/DataTable';
import { apiRequest } from '../services/apiClient';
import {
  financialCards,
  revenueBreakdown,
  transactionRows,
  categoryStats,
  monthlySummary,
} from '../data/MockData';

const maxVal = Math.max(
  ...revenueBreakdown.map((r) => r.parts + r.service + r.labour)
);

const catBadgeClass = { Parts: 'cb-parts', Service: 'cb-service', Labour: 'cb-labour', Other: 'cb-other' };

export default function FinancialReportsPage() {
  const [status, setStatus] = useState('Ready');

  async function loadFinancialReport() {
    setStatus('Loading financial report...');
    try {
      const payload = await apiRequest('/api/admin/reports/financial?type=monthly&year=2026&month=5');
      setStatus(payload?.message || 'Financial report loaded from backend.');
    } catch (error) {
      setStatus(error.message);
    }
  }

  function exportReport() {
    const report = { financialCards, revenueBreakdown, transactionRows, categoryStats, monthlySummary };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'garagepro-financial-report.json';
    link.click();
    URL.revokeObjectURL(url);
    setStatus('Report exported.');
  }

  return (
    <>
      {/* Filter Bar */}
      <div className="filter-bar">
        <span className="filter-label">Period</span>
        <div className="seg-control">
          {['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'].map((p) => (
            <button key={p} className={`seg-btn ${p === 'Monthly' ? 'active' : ''}`} onClick={loadFinancialReport}>{p}</button>
          ))}
        </div>
        <select className="date-select">
          {['Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026'].map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <div style={{ flex: 1 }} />
        <button className="btn-ghost" onClick={loadFinancialReport}><Filter size={14} /> Filter</button>
        <button className="btn-primary" onClick={exportReport}><Download size={14} /> Export</button>
      </div>
      <div className="status-box">{status}</div>

      {/* KPI Grid */}
      <div className="kpi-grid">
        {financialCards.map((card, i) => {
          const colorClass = ['kc-g', 'kc-b', 'kc-a', 'kc-p'][i];
          const iconClass = ['ki-green', 'ki-blue', 'ki-amber', 'ki-purple'][i];
          return (
            <div className={`kpi-card ${colorClass}`} key={card.label}>
              <div className="kpi-top">
                <div className={`kpi-icon ${iconClass}`}>
                  {card.trend === 'up' ? <TrendingUp size={17} /> : <TrendingDown size={17} />}
                </div>
                <span className={`kpi-trend ${card.trend === 'up' ? 'trend-up' : 'trend-dn'}`}>
                  {card.change}
                </span>
              </div>
              <div className="kpi-val">{card.value}</div>
              <div className="kpi-lbl">{card.label}</div>
              <div className="kpi-sub">{card.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Reports Grid */}
      <div className="reports-grid">
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Bar Chart */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title-row">
                <span className="panel-icon"><FileText size={17} /></span>
                <span className="panel-title">Monthly Revenue Breakdown</span>
              </div>
              <div className="panel-actions">
                <button className="icon-btn" onClick={exportReport} aria-label="Export financial chart"><Download size={14} /></button>
              </div>
            </div>

            <div className="chart-legend">
              <div className="legend-item"><div className="legend-dot" style={{ background: 'var(--electric-blue)' }} />Parts</div>
              <div className="legend-item"><div className="legend-dot" style={{ background: 'var(--clean-green)' }} />Service</div>
              <div className="legend-item"><div className="legend-dot" style={{ background: 'var(--burnt-orange)' }} />Labour</div>
            </div>

            <div className="chart-wrap">
              <div className="bar-chart">
                {revenueBreakdown.map((item) => {
                  const ph = Math.round((item.parts / maxVal) * 160);
                  const sh = Math.round((item.service / maxVal) * 160);
                  const lh = Math.round((item.labour / maxVal) * 160);
                  return (
                    <div className="bar-group" key={item.month}>
                      <div className="bars">
                        <div className="bar" style={{ height: `${ph}px`, background: 'var(--electric-blue)' }} title={`Parts ${item.parts}k`} />
                        <div className="bar" style={{ height: `${sh}px`, background: 'var(--clean-green)' }} title={`Service ${item.service}k`} />
                        <div className="bar" style={{ height: `${lh}px`, background: 'var(--burnt-orange)' }} title={`Labour ${item.labour}k`} />
                      </div>
                      <span className="bar-lbl">{item.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title-row">
                <span className="panel-icon"><FileText size={17} /></span>
                <span className="panel-title">Recent Transactions</span>
              </div>
            </div>
            <DataTable
              columns={['Invoice', 'Customer', 'Category', 'Date', 'Amount']}
              rows={transactionRows.map((row) => [
                <span className="mono-text" key={row.invoice}>{row.invoice}</span>,
                row.customer,
                <span className={`cat-badge ${catBadgeClass[row.category] || 'cb-other'}`} key={`${row.invoice}-cat`}>{row.category}</span>,
                row.date,
                <span className="amount-cell" key={`${row.invoice}-amt`}>{row.amount}</span>,
              ])}
            />
          </div>
        </div>

        {/* Right column */}
        <div className="right-col">
          {/* Revenue by Category */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title-row">
                <span className="panel-icon"><FileText size={17} /></span>
                <span className="panel-title">Revenue by Category</span>
              </div>
            </div>
            <div>
              {categoryStats.map((cat) => (
                <div className="breakdown-item" key={cat.label}>
                  <div className="bd-left">
                    <div className="bd-dot" style={{ background: cat.color }} />
                    <div>
                      <div className="bd-name">{cat.label}</div>
                      <div className="bd-pct">{cat.percent}% of total</div>
                    </div>
                  </div>
                  <div className="bd-right">
                    <div className="bd-val">{cat.value}</div>
                    <div className="bd-bar-wrap">
                      <div className="bd-bar-fill" style={{ width: `${cat.percent}%`, background: cat.color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Summary */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title-row">
                <span className="panel-icon"><FileText size={17} /></span>
                <span className="panel-title">Monthly Summary</span>
              </div>
            </div>
            {monthlySummary.map((item) => (
              <div className="summary-stat" key={item.label}>
                <span className="ss-label">{item.label}</span>
                <span className={`ss-val ${item.tone}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
