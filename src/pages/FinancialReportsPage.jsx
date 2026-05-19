import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Download, FileText, TrendingUp } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import LoadingState from '../components/LoadingState';
import AlertBanner from '../components/AlertBanner';
import { apiRequest } from '../services/apiClient';
import { downloadCsv, printPdf } from '../utils/exportUtils';

const TYPE_BY_PATH = {
  '/admin/reports/daily': 'daily',
  '/admin/reports/monthly': 'monthly',
  '/admin/reports/yearly': 'yearly',
  '/admin/reports/sales': 'monthly',
};

export default function FinancialReportsPage() {
  const location = useLocation();
  const reportType = TYPE_BY_PATH[location.pathname] || 'monthly';
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [date, setDate] = useState(now.toISOString().slice(0, 10));

  const query = useMemo(() => {
    if (reportType === 'daily') return `type=daily&date=${date}`;
    if (reportType === 'yearly') return `type=yearly&year=${year}`;
    return `type=monthly&year=${year}&month=${month}`;
  }, [reportType, date, year, month]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const payload = await apiRequest(`/api/admin/reports/financial?${query}`);
        setReport(payload.data);
      } catch (err) {
        setError(err.message);
        setReport(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [query]);

  const title = reportType === 'daily' ? 'Daily Report' : reportType === 'yearly' ? 'Yearly Report' : 'Monthly Report';

  const chartSeries = useMemo(() => {
    if (!report) return [];
    const series = report.revenueBreakdown || report.trend || report.chart || report.monthlyRevenue || [];
    if (Array.isArray(series) && series.length) return series;
    return [];
  }, [report]);

  const summaryStats = report ? [
    { label: 'Total Sales', value: `Rs. ${Number(report.totalSales || report.revenue || 0).toLocaleString()}` },
    { label: 'Expenses', value: `Rs. ${Number(report.totalExpenses || report.expenses || 0).toLocaleString()}` },
    { label: 'Net Profit', value: `Rs. ${Number(report.netProfit || report.profit || 0).toLocaleString()}` },
    { label: 'Invoices', value: report.invoiceCount ?? report.invoices ?? 0 },
  ] : [];

  function exportCsv() {
    if (!report) return;
    const rows = chartSeries.length
      ? chartSeries.map((row) => ({
          period: row.month || row.period || row.label,
          parts: row.parts ?? row.partsRevenue ?? 0,
          service: row.service ?? row.serviceRevenue ?? 0,
          labour: row.labour ?? row.labourRevenue ?? 0,
          total: row.total ?? row.value ?? row.totalRevenue ?? 0,
        }))
      : [report];
    downloadCsv(`garagepro-${reportType}-report.csv`, rows, [
      { key: 'period', label: 'Period' },
      { key: 'parts', label: 'Parts' },
      { key: 'service', label: 'Service' },
      { key: 'labour', label: 'Labour' },
      { key: 'total', label: 'Total' },
    ]);
  }

  function exportPdf() {
    if (!report) return;
    const rows = chartSeries.map((row) => ({
      period: row.month || row.period || row.label,
      parts: row.parts ?? row.partsRevenue ?? 0,
      service: row.service ?? row.serviceRevenue ?? 0,
      labour: row.labour ?? row.labourRevenue ?? 0,
      total: row.total ?? row.value ?? row.totalRevenue ?? 0,
    }));
    printPdf({
      title: `GaragePro ${title}`,
      subtitle: `Generated for ${report.period || 'selected period'}`,
      summary: summaryStats,
      columns: [
        { key: 'period', label: 'Period' },
        { key: 'parts', label: 'Parts' },
        { key: 'service', label: 'Service' },
        { key: 'labour', label: 'Labour' },
        { key: 'total', label: 'Total' },
      ],
      rows,
    });
  }

  return (
    <>
      <PageHeader
        eyebrow="Admin / Reports"
        title={title}
        description="Live financial summary from your sales invoices."
        actions={
          <div className="action-row">
            <button type="button" className="btn-secondary" onClick={exportCsv} disabled={!report}>
              <Download size={16} /> CSV
            </button>
            <button type="button" className="btn-secondary" onClick={exportPdf} disabled={!report}>
              <FileText size={16} /> PDF
            </button>
          </div>
        }
      />

      <nav className="report-tabs">
        <Link className={`report-tab ${reportType === 'daily' ? 'active' : ''}`} to="/admin/reports/daily">Daily</Link>
        <Link className={`report-tab ${reportType === 'monthly' ? 'active' : ''}`} to="/admin/reports/monthly">Monthly</Link>
        <Link className={`report-tab ${reportType === 'yearly' ? 'active' : ''}`} to="/admin/reports/yearly">Yearly</Link>
      </nav>

      <section className="panel-card filter-card">
        <div className="filter-row">
          {reportType === 'daily' ? (
            <label>Date <input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
          ) : (
            <>
              <label>Year <input type="number" min="2020" max="2030" value={year} onChange={(e) => setYear(Number(e.target.value))} /></label>
              {reportType === 'monthly' && (
                <label>Month <input type="number" min="1" max="12" value={month} onChange={(e) => setMonth(Number(e.target.value))} /></label>
              )}
            </>
          )}
        </div>
      </section>

      <AlertBanner type="error">{error}</AlertBanner>
      {loading ? <LoadingState label="Generating report..." /> : report && (
        <>
          <div className="stat-grid animate-in">
            <article className="stat-card panel-card">
              <span className="stat-icon"><TrendingUp size={20} /></span>
              <p className="stat-value">Rs. {Number(report.totalSales || report.revenue || 0).toLocaleString()}</p>
              <p className="stat-label">Total Sales</p>
              <p className="stat-sub">Period: {report.period}</p>
            </article>
            <article className="stat-card panel-card">
              <p className="stat-value">Rs. {Number(report.totalExpenses || report.expenses || 0).toLocaleString()}</p>
              <p className="stat-label">Expenses</p>
            </article>
            <article className="stat-card panel-card">
              <p className="stat-value">Rs. {Number(report.netProfit || report.profit || 0).toLocaleString()}</p>
              <p className="stat-label">Net Profit</p>
            </article>
            <article className="stat-card panel-card">
              <p className="stat-value">{report.invoiceCount ?? report.invoices ?? 0}</p>
              <p className="stat-label">Invoices</p>
            </article>
          </div>

          {chartSeries.length > 0 && (
            <section className="panel-card animate-in" style={{ marginTop: 18 }}>
              <div className="panel-header">
                <span className="panel-title">Revenue Trend</span>
              </div>
              <div className="chart-legend">
                <span className="legend-item"><span className="legend-dot cb-parts" /> Parts</span>
                <span className="legend-item"><span className="legend-dot cb-service" /> Service</span>
                <span className="legend-item"><span className="legend-dot cb-labour" /> Labour</span>
              </div>
              <div className="chart-wrap">
                <div className="bar-chart">
                  {chartSeries.map((row, index) => {
                    const parts = Number(row.parts ?? row.partsRevenue ?? 0);
                    const service = Number(row.service ?? row.serviceRevenue ?? 0);
                    const labour = Number(row.labour ?? row.labourRevenue ?? 0);
                    const total = Math.max(parts + service + labour, Number(row.total ?? row.value ?? 0), 1);
                    return (
                      <div className="bar-group" key={`${row.month || row.period || row.label || index}`}>
                        <div className="bars">
                          <div className="bar cb-parts" style={{ height: `${(parts / total) * 100}%` }} />
                          <div className="bar cb-service" style={{ height: `${(service / total) * 100}%` }} />
                          <div className="bar cb-labour" style={{ height: `${(labour / total) * 100}%` }} />
                        </div>
                        <span className="bar-lbl">{row.month || row.period || row.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}
