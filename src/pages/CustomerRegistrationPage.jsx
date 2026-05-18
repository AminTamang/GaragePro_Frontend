import FeatureWorkbenchPage from './FeatureWorkbenchPage';
import { featureConfigs } from '../data/featureConfigs';

export default function CustomerRegistrationPage() {
  return <FeatureWorkbenchPage config={featureConfigs.customerRegistration} />;
}
