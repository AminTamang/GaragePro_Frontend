import FeatureWorkbenchPage from './FeatureWorkbenchPage';
import { featureConfigs } from '../data/featureConfigs';

export default function NotificationsPage() {
  return <FeatureWorkbenchPage config={featureConfigs.notifications} />;
}
