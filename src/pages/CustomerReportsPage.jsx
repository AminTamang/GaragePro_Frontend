import FeatureWorkbenchPage from './FeatureWorkbenchPage';
import { featureConfigs } from '../data/featureConfigs';

export default function CustomerReportsPage() {
  return <FeatureWorkbenchPage config={featureConfigs.customerReports} />;
}
