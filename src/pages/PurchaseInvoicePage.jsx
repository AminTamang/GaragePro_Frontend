import {
  Bell,
  DollarSign,
  FileText,
  Gauge,
  PackageCheck,
  PackagePlus,
  ShoppingCart,
} from 'lucide-react'
import { DataTable, MetricStrip, PageIntro, Panel, ProgressList } from '../components/DashboardParts'

const invoiceRows = [
  ['PI-2048', 'Kathmandu Auto Parts', 'Engine oil filter', '48', 'Rs. 43,200'],
  ['PI-2049', 'Valley Spares', 'Brake pad set', '26', 'Rs. 79,800'],
  ['PI-2050', 'Rapid Tools Nepal', 'Socket kit', '12', 'Rs. 31,500'],
]

function PurchaseInvoicePage() {
  return (
    <>
      <PageIntro
        hero={{
          icon: PackagePlus,
          eyebrow: 'Inventory control',
          description:
            'Record supplier invoices, verify received parts, and update stock levels before items reach the counter.',
          stats: [
            ['Pending invoices', '7'],
            ['Stock updates', '23'],
            ['Low stock', '9'],
          ],
        }}
        quickPanel={{
          icon: ShoppingCart,
          title: 'Invoice Entry',
          note: '2 invoices awaiting approval',
          fields: ['Supplier', 'Invoice no.', 'Received date'],
          action: 'Update Stock',
        }}
      />

      <MetricStrip
        metrics={[
          ['Parts received', '86', PackageCheck],
          ['Invoice value', 'Rs. 154,500', DollarSign],
          ['Stock movement', '+112', Gauge],
          ['Supplier issues', '2', Bell],
        ]}
      />

      <section className="content-grid">
        <Panel title="Purchase Invoices" subtitle="Supplier bills ready for stock posting." icon={FileText}>
          <DataTable
            headers={['Invoice', 'Supplier', 'Part', 'Qty', 'Total']}
            rows={invoiceRows}
          />
        </Panel>
        <Panel title="Stock Update" subtitle="Recent movements by category." icon={PackagePlus}>
          <ProgressList
            items={[
              ['Filters', 'Received 48 units', 64],
              ['Brake parts', 'Received 26 sets', 46],
              ['Tools', 'Received 12 kits', 38],
            ]}
          />
        </Panel>
      </section>
    </>
  )
}

export default PurchaseInvoicePage
