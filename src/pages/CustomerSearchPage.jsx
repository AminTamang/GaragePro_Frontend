import FeatureWorkbenchPage from './FeatureWorkbenchPage';
import { featureConfigs } from '../data/featureConfigs';

export default function CustomerSearchPage() {
  return <FeatureWorkbenchPage config={featureConfigs.customerSearch} />;
}
