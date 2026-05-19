function escapeCsv(value) {
  if (value === null || value === undefined) return '';
  const text = String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function downloadBlob(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadCsv(filename, rows, columns) {
  const header = columns.map((col) => escapeCsv(col.label)).join(',');
  const lines = rows.map((row) =>
    columns
      .map((col) => {
        const value = typeof col.value === 'function' ? col.value(row) : row[col.key];
        return escapeCsv(value);
      })
      .join(',')
  );
  const csv = [header, ...lines].join('\n');
  downloadBlob(csv, filename, 'text/csv');
}

export function printPdf({ title, subtitle, columns = [], rows = [], summary = [] }) {
  const tableHeader = columns.map((col) => `<th>${col.label}</th>`).join('');
  const tableRows = rows
    .map((row) => {
      const cells = columns.map((col) => {
        const value = typeof col.value === 'function' ? col.value(row) : row[col.key];
        return `<td>${value ?? '-'}</td>`;
      });
      return `<tr>${cells.join('')}</tr>`;
    })
    .join('');
  const summaryRows = summary
    .map((item) => `<tr><th>${item.label}</th><td>${item.value ?? '-'}</td></tr>`)
    .join('');

  const html = `
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #111827; }
          h1 { margin: 0 0 6px; }
          h2 { margin: 0 0 16px; font-weight: 400; color: #6b7280; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th, td { border: 1px solid #e5e7eb; padding: 8px 10px; text-align: left; font-size: 12px; }
          th { background: #f3f4f6; }
          .summary { margin-top: 16px; max-width: 420px; }
          .summary th { width: 60%; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        ${subtitle ? `<h2>${subtitle}</h2>` : ''}
        ${summaryRows ? `<table class="summary">${summaryRows}</table>` : ''}
        ${columns.length ? `<table><thead><tr>${tableHeader}</tr></thead><tbody>${tableRows}</tbody></table>` : ''}
        <script>window.print()</script>
      </body>
    </html>
  `;

  const win = window.open('', '_blank', 'width=900,height=700');
  if (!win) return;
  win.document.open();
  win.document.write(html);
  win.document.close();
}
