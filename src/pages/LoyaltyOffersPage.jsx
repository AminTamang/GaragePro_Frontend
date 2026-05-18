import FeatureWorkbenchPage from './FeatureWorkbenchPage';
import { featureConfigs } from '../data/featureConfigs';

export default function LoyaltyOffersPage() {
  return <FeatureWorkbenchPage config={featureConfigs.loyaltyOffers} />;
}
