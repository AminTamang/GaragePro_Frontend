import FeatureWorkbenchPage from './FeatureWorkbenchPage';
import { featureConfigs } from '../data/featureConfigs';

export default function PartsManagementPage() {
  return <FeatureWorkbenchPage config={featureConfigs.partsManagement} />;
}
