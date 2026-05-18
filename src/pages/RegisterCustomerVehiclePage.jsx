import FeatureWorkbenchPage from './FeatureWorkbenchPage';
import { featureConfigs } from '../data/featureConfigs';

export default function RegisterCustomerVehiclePage() {
  return <FeatureWorkbenchPage config={featureConfigs.registerVehicle} />;
}
