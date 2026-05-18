import FeatureWorkbenchPage from './FeatureWorkbenchPage';
import { featureConfigs } from '../data/featureConfigs';

export default function PurchaseServiceHistoryPage() {
  return <FeatureWorkbenchPage config={featureConfigs.purchaseHistory} />;
}
