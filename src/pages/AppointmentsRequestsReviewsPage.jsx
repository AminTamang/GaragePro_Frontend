import FeatureWorkbenchPage from './FeatureWorkbenchPage';
import { featureConfigs } from '../data/featureConfigs';

export default function AppointmentsRequestsReviewsPage() {
  return <FeatureWorkbenchPage config={featureConfigs.appointmentsRequestsReviews} />;
}
