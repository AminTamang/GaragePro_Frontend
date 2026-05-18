import { Bell, CalendarClock, CheckCircle2, Mail, Sparkles } from 'lucide-react'
import { DataTable, MetricStrip, PageIntro, Panel, ProgressList } from '../components/DashboardParts'

const reminderRows = [
  ['Service follow-up', 'Rina Maharjan', 'Today, 11:30 AM', 'SMS ready'],
  ['Payment reminder', 'Prakash Shrestha', 'Today, 2:00 PM', 'Email ready'],
  ['Warranty expiry', 'Nabin Tamang', 'Tomorrow, 9:00 AM', 'Call queued'],
]

function NotificationDashboardPage() {
  return (
    <>
      <PageIntro
        hero={{
          icon: Bell,
          eyebrow: 'Follow-up center',
          description:
            'Track service reminders, expiring estimates, overdue payments, and appointment notifications in one queue.',
          stats: [
            ['Due today', '14'],
            ['Sent', '86'],
            ['Escalations', '5'],
          ],
        }}
        quickPanel={{
          icon: Mail,
          title: 'Reminder Queue',
          note: '14 messages due today',
          fields: ['Reminder type', 'Recipient', 'Send time'],
          action: 'Schedule Reminder',
        }}
      />

      <MetricStrip
        metrics={[
          ['Reminders sent', '86', Mail],
          ['Due today', '14', CalendarClock],
          ['Completed', '71', CheckCircle2],
          ['Escalated', '5', Bell],
        ]}
      />

      <section className="content-grid">
        <Panel title="Reminder Dashboard" subtitle="Notifications waiting for review." icon={Bell}>
          <DataTable
            headers={['Type', 'Customer', 'Time', 'Status']}
            rows={reminderRows}
          />
        </Panel>
        <Panel title="Channels" subtitle="Delivery health across reminders." icon={Sparkles}>
          <ProgressList
            items={[
              ['SMS', '96% delivery rate', 96],
              ['Email', '88% delivery rate', 88],
              ['Phone call', '62% resolved', 62],
            ]}
          />
        </Panel>
      </section>
    </>
  )
}

export default NotificationDashboardPage
