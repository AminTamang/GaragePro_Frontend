import { Bell, CheckCircle2, ClipboardList, UserPlus, Users, Wrench } from 'lucide-react'
import { MetricStrip, PageIntro, Panel, Timeline } from '../components/DashboardParts'

function CustomerProfilePage() {
  return (
    <>
      <PageIntro
        hero={{
          icon: UserPlus,
          eyebrow: 'Customer records',
          description:
            'Register customers, attach vehicles, and keep contact details, preferences, and service notes together.',
          stats: [
            ['Profiles', '1,284'],
            ['Vehicles', '1,731'],
            ['New this week', '38'],
          ],
        }}
        quickPanel={{
          icon: UserPlus,
          title: 'Customer Lookup',
          note: 'Last registration: 12 minutes ago',
          fields: ['Full name', 'Phone number', 'Vehicle plate'],
          action: 'Save Profile',
        }}
      />

      <MetricStrip
        metrics={[
          ['Registered', '1,284', Users],
          ['Profiles updated', '67', CheckCircle2],
          ['Vehicles linked', '1,731', Wrench],
          ['Pending review', '11', Bell],
        ]}
      />

      <section className="content-grid">
        <Panel title="Customer Profile" subtitle="Registration details and vehicle record." icon={UserPlus}>
          <div className="profile-card">
            <div className="large-avatar">RS</div>
            <div>
              <h3>Ramesh Shrestha</h3>
              <p>9841000000</p>
              <p>Bagmati Province, Nepal</p>
            </div>
          </div>
          <div className="detail-grid">
            <span>Vehicle</span>
            <strong>Hyundai Creta</strong>
            <span>Plate</span>
            <strong>BA 19 PA 4821</strong>
            <span>Preference</span>
            <strong>SMS reminders</strong>
          </div>
        </Panel>
        <Panel title="Service Notes" subtitle="Recent profile activity." icon={ClipboardList}>
          <Timeline
            items={[
              ['Profile created', 'Verified phone and email contact.'],
              ['Vehicle linked', 'Added Hyundai Creta to customer garage.'],
              ['Reminder enabled', 'Next service alert set for 5,000 km.'],
            ]}
          />
        </Panel>
      </section>
    </>
  )
}

export default CustomerProfilePage
