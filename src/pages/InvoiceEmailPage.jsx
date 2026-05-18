import FeatureWorkbenchPage from './FeatureWorkbenchPage';
import { featureConfigs } from '../data/featureConfigs';

export default function InvoiceEmailPage() {
  return <FeatureWorkbenchPage config={featureConfigs.invoiceEmail} />;
}
