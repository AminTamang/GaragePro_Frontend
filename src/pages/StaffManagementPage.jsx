import FeatureWorkbenchPage from './FeatureWorkbenchPage';
import { featureConfigs } from '../data/featureConfigs';

export default function StaffManagementPage() {
  return <FeatureWorkbenchPage config={featureConfigs.staffManagement} />;
}
