import FeatureWorkbenchPage from './FeatureWorkbenchPage';
import { featureConfigs } from '../data/featureConfigs';

export default function CustomerDetailsPage() {
  return <FeatureWorkbenchPage config={featureConfigs.customerDetails} />;
}
