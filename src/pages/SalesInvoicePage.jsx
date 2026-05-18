import FeatureWorkbenchPage from './FeatureWorkbenchPage';
import { featureConfigs } from '../data/featureConfigs';

export default function SalesInvoicePage() {
  return <FeatureWorkbenchPage config={featureConfigs.salesInvoice} />;
}
