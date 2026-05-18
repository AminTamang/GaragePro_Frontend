import FeatureWorkbenchPage from './FeatureWorkbenchPage';
import { featureConfigs } from '../data/featureConfigs';

export default function PurchaseStockPage() {
  return <FeatureWorkbenchPage config={featureConfigs.purchaseStock} />;
}
