import {
  Bell,
  CheckCircle2,
  DollarSign,
  Gauge,
  ShieldCheck,
  UserCog,
  Users,
} from 'lucide-react'
import { DataTable, MetricStrip, PageIntro, Panel, ProgressList } from '../components/DashboardParts'

const staffRows = [
  ['Aarav Karki', 'Senior Mechanic', 'Brake inspection', '8:00 AM - 4:00 PM', 'Active'],
  ['Maya Rai', 'Service Advisor', 'Customer intake', '9:00 AM - 5:00 PM', 'Active'],
  ['Niraj Thapa', 'Electrician', 'EV diagnostic', '10:00 AM - 6:00 PM', 'Busy'],
  ['Sana Gurung', 'Parts Clerk', 'Stock audit', '8:30 AM - 4:30 PM', 'Active'],
]

function StaffManagementPage() {
  return (
    <>
      <PageIntro
        hero={{
          icon: UserCog,
          eyebrow: 'Team operations',
          description:
            'Manage mechanic schedules, roles, workload, and staff availability from one balanced workspace.',
          stats: [
            ['Active staff', '18'],
            ['On duty', '12'],
            ['Open tasks', '46'],
          ],
        }}
        quickPanel={{
          icon: ShieldCheck,
          title: 'Staff Control',
          note: '3 staff need workload review',
          fields: ['Role', 'Shift', 'Task'],
          action: 'Assign Staff',
        }}
      />

      <MetricStrip
        metrics={[
          ['Attendance', '94%', Users],
          ['Completed jobs', '128', CheckCircle2],
          ['Payroll hold', 'Rs. 0.00', DollarSign],
          ['Open alerts', '3', Bell],
        ]}
      />

      <section className="content-grid">
        <Panel title="Staff Directory" subtitle="Roles, shifts, and current assignments." icon={Users}>
          <DataTable
            headers={['Name', 'Role', 'Current task', 'Shift', 'Status']}
            rows={staffRows}
          />
        </Panel>
        <Panel title="Workload" subtitle="Today by service bay." icon={Gauge}>
          <ProgressList
            items={[
              ['Bay 1', 'Brake repairs', 72],
              ['Bay 2', 'Engine diagnostics', 58],
              ['Bay 3', 'General service', 84],
            ]}
          />
        </Panel>
      </section>
    </>
  )
}

export default StaffManagementPage
