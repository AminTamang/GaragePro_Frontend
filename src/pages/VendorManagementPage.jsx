import FeatureWorkbenchPage from './FeatureWorkbenchPage';
import { featureConfigs } from '../data/featureConfigs';

export default function VendorManagementPage() {
  return <FeatureWorkbenchPage config={featureConfigs.vendorManagement} />;
}
